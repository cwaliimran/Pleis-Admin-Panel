'use client';

import { SocketUrl } from '@/constant/constant';
import type { RootState } from '@/store/store';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { io, type Socket } from 'socket.io-client';
import type { OrderSocketEventName, OrderSocketMessage, OrderSocketStatus, UserType } from './types';

// ============================================================
// Order Management V2 — live updates
//
// The module's only transport concern. It owns the Socket.IO connection and
// nothing else: it does not touch the RTK Query cache, does not map wire
// shapes, and does not render. Callers get a status and a stream of
// messages, and decide for themselves what to do with them.
// ============================================================

/**
 * The namespace is per role, and the connection is scoped by the query
 * params — the server only pushes orders for the organization asked for.
 *
 * Both namespaces are served: the backend rejects anything it does not know
 * with an `Invalid namespace` connect error, and each of these accepts a
 * connection. So a persistent "Offline" indicator is a URL, auth or network
 * problem rather than a missing namespace.
 */
export const ORDER_SOCKET_NAMESPACE: Record<UserType, string> = {
  'super-admin': '/admin/orders',
  organizer: '/organizer/orders',
};

/** The events this module listens for. Both share `OrderSocketMessage`. */
export const ORDER_SOCKET_EVENTS: OrderSocketEventName[] = ['NEW_ORDER', 'ORDER_UPDATE'];

/** Shared so every line about the live feed filters under one search. */
export const ORDER_SOCKET_LOG_PREFIX = '[orders-socket]';

const LOG_PREFIX = ORDER_SOCKET_LOG_PREFIX;

/** Give up rather than hammer a namespace that is not there. */
const RECONNECTION_ATTEMPTS = 10;
const RECONNECTION_DELAY_MS = 1_000;
const RECONNECTION_DELAY_MAX_MS = 10_000;

interface UseOrderSocketArgs {
  userType: UserType;
  organizationId?: string;
  /** Called for every message, already logged. Held by ref — no need to memoise. */
  onEvent?: (message: OrderSocketMessage) => void;
}

interface UseOrderSocketReturn {
  status: OrderSocketStatus;
  isConnected: boolean;
}

export const useOrderSocket = ({ userType, organizationId, onEvent }: UseOrderSocketArgs): UseOrderSocketReturn => {
  // The admin/organizer placing the connection, not the customer on the order.
  //
  // The signed-in user is stored nested, so the id is `basicInfo._id` — the
  // same path every profile screen and the organizer layout read it from.
  // The flat fallbacks are only there for a session saved before that shape.
  const userId = useSelector((state: RootState) => {
    const user = state.userSlice?.user as { basicInfo?: { _id?: string }; _id?: string; id?: string } | null | undefined;
    return user?.basicInfo?._id || user?._id || user?.id;
  });

  const [status, setStatus] = useState<OrderSocketStatus>('idle');

  // One line per transition, so the current state is always the last thing
  // in the console rather than something to be pieced together from events.
  useEffect(() => {
    console.log(`${LOG_PREFIX} status → ${status.toUpperCase()}`);
  }, [status]);

  // Held by ref so a new callback identity on every render does not tear the
  // socket down and build it again.
  const onEventRef = useRef(onEvent);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    // Every one of these is required to address the connection, so there is
    // nothing to connect to until they all arrive. Naming the missing piece
    // matters: this path used to be silent, which reads exactly like a
    // socket that is failing rather than one that has not been asked to
    // start yet.
    if (!SocketUrl || !userId || !organizationId) {
      const missing = [
        !SocketUrl && 'socket URL (NEXT_PUBLIC_SOCKET_URL, or NEXT_PUBLIC_LIVE_URL to derive it from)',
        !userId && 'signed-in user id (userSlice.user.basicInfo._id)',
        !organizationId && 'selected organization',
      ].filter(Boolean);

      console.warn(`${LOG_PREFIX} ⏸ not connecting — waiting for ${missing.join(' + ')}`, {
        socketUrl: SocketUrl || '(empty)',
        userId: userId || '(none)',
        organizationId: organizationId || '(none)',
      });

      setStatus('idle');
      return;
    }

    const namespace = ORDER_SOCKET_NAMESPACE[userType];
    const url = `${SocketUrl}${namespace}`;

    console.log(`${LOG_PREFIX} connecting →`, url, { userId, organizationId, events: ORDER_SOCKET_EVENTS });
    setStatus('connecting');

    // Websocket first so the usual HTTP long-poll handshake is skipped;
    // polling stays as the fallback for networks that block upgrades.
    const socket: Socket = io(url, {
      query: { userId, organizationId },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: RECONNECTION_ATTEMPTS,
      reconnectionDelay: RECONNECTION_DELAY_MS,
      reconnectionDelayMax: RECONNECTION_DELAY_MAX_MS,
    });

    socket.on('connect', () => {
      console.log(`${LOG_PREFIX} ✅ connected`, { id: socket.id, url, organizationId });
      setStatus('connected');
    });

    socket.on('disconnect', (reason) => {
      console.warn(`${LOG_PREFIX} ⚠️ disconnected —`, reason);
      setStatus('disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error(`${LOG_PREFIX} ❌ connection error —`, error?.message || error, { url });
      setStatus('error');
    });

    socket.io.on('reconnect_attempt', (attempt) => {
      console.log(`${LOG_PREFIX} reconnecting… attempt ${attempt} of ${RECONNECTION_ATTEMPTS}`);
      setStatus('connecting');
    });

    socket.io.on('reconnect_failed', () => {
      console.error(`${LOG_PREFIX} gave up after ${RECONNECTION_ATTEMPTS} attempts`, { url });
      setStatus('error');
    });

    ORDER_SOCKET_EVENTS.forEach((eventName) => {
      socket.on(eventName, (message: OrderSocketMessage) => {
        // Logged whole and un-narrowed so the payload can be read straight
        // out of the console against the API contract.
        console.log(`${LOG_PREFIX} 📦 ${eventName}`, message);

        // The server addresses the event, but the envelope is trusted over
        // the channel name only when it actually carries one.
        onEventRef.current?.({ ...message, event: message?.event || eventName });
      });
    });

    // Anything the server emits that this module does not handle yet — cheap
    // to keep, and it is how a newly added backend event gets noticed.
    socket.onAny((eventName: string, ...args: unknown[]) => {
      if ((ORDER_SOCKET_EVENTS as string[]).includes(eventName)) return;
      console.log(`${LOG_PREFIX} (unhandled) ${eventName}`, ...args);
    });

    return () => {
      console.log(`${LOG_PREFIX} closing connection`, { url });
      // `off` before `disconnect` so a late frame cannot land on a handler
      // belonging to a connection this component has already let go of.
      socket.removeAllListeners();
      socket.io.off('reconnect_attempt');
      socket.io.off('reconnect_failed');
      socket.disconnect();
      setStatus('idle');
    };
    // In development React StrictMode mounts effects twice, so expect one
    // connect/close pair before the one that sticks.
  }, [userType, organizationId, userId]);

  return { status, isConnected: status === 'connected' };
};
