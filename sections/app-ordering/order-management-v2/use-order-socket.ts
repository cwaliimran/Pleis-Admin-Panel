'use client';

import { SocketUrl } from '@/constant/constant';
import type { RootState } from '@/store/store';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { io, type Socket } from 'socket.io-client';
import type { OrderSocketEventName, OrderSocketMessage, OrderSocketStatus, UserType } from './types';

// Owns the Socket.IO connection and nothing else — it does not touch the
// RTK Query cache, map wire shapes, or render.

/**
 * Per role, scoped further by the query params — the server only pushes
 * orders for the organization asked for. Both namespaces are known to be
 * served, so a persistent "Offline" is a URL, auth or network problem.
 */
export const ORDER_SOCKET_NAMESPACE: Record<UserType, string> = {
  'super-admin': '/admin/orders',
  organizer: '/organizer/orders',
};

export const ORDER_SOCKET_EVENTS: OrderSocketEventName[] = ['NEW_ORDER', 'ORDER_UPDATE'];

export const ORDER_SOCKET_LOG_PREFIX = '[orders-socket]';

const LOG_PREFIX = ORDER_SOCKET_LOG_PREFIX;

/** Give up rather than hammer a namespace that is not there. */
const RECONNECTION_ATTEMPTS = 10;
const RECONNECTION_DELAY_MS = 1_000;
const RECONNECTION_DELAY_MAX_MS = 10_000;

interface UseOrderSocketArgs {
  userType: UserType;
  organizationId?: string;
  /** Held by ref — no need to memoise. */
  onEvent?: (message: OrderSocketMessage) => void;
}

interface UseOrderSocketReturn {
  status: OrderSocketStatus;
  isConnected: boolean;
}

export const useOrderSocket = ({ userType, organizationId, onEvent }: UseOrderSocketArgs): UseOrderSocketReturn => {
  // The admin/organizer placing the connection, not the customer on the
  // order. The flat fallbacks are for sessions saved before the nested shape.
  const userId = useSelector((state: RootState) => {
    const user = state.userSlice?.user as { basicInfo?: { _id?: string }; _id?: string; id?: string } | null | undefined;
    return user?.basicInfo?._id || user?._id || user?.id;
  });

  const [status, setStatus] = useState<OrderSocketStatus>('idle');

  useEffect(() => {
    console.log(`${LOG_PREFIX} status → ${status.toUpperCase()}`);
  }, [status]);

  // Held by ref so a new callback identity does not tear the socket down.
  const onEventRef = useRef(onEvent);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    // All three are required to address the connection. The warning names
    // the missing piece — silence here reads like a failing socket rather
    // than one that has not been asked to start yet.
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

    // Websocket first; polling stays as the fallback for networks that
    // block upgrades.
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

    // `warn`, not `error`: socket.io retries on its own and the header's
    // "Offline" indicator already reports it, so this is a recoverable
    // condition. `console.error` would also throw the Next dev overlay over
    // the whole screen every time a websocket blipped.
    socket.on('connect_error', (error) => {
      console.warn(`${LOG_PREFIX} ⚠️ connection error —`, error?.message || error, { url });
      setStatus('error');
    });

    socket.io.on('reconnect_attempt', (attempt) => {
      console.log(`${LOG_PREFIX} reconnecting… attempt ${attempt} of ${RECONNECTION_ATTEMPTS}`);
      setStatus('connecting');
    });

    socket.io.on('reconnect_failed', () => {
      console.warn(`${LOG_PREFIX} gave up after ${RECONNECTION_ATTEMPTS} attempts`, { url });
      setStatus('error');
    });

    ORDER_SOCKET_EVENTS.forEach((eventName) => {
      socket.on(eventName, (message: OrderSocketMessage) => {
        console.log(`${LOG_PREFIX} 📦 ${eventName}`, message);

        // The envelope is trusted over the channel name, when it carries one.
        onEventRef.current?.({ ...message, event: message?.event || eventName });
      });
    });

    // How a newly added backend event gets noticed.
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
    // StrictMode mounts effects twice in dev — expect one connect/close pair
    // before the one that sticks.
  }, [userType, organizationId, userId]);

  return { status, isConnected: status === 'connected' };
};
