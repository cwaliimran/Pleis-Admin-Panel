'use client';

import { SocketUrl } from '@/constant/constant';
import type { RootState } from '@/store/store';
import type { SystemLogEntry, SystemLogSource } from '@/store/Reducer/system-logs-api';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { io, type Socket } from 'socket.io-client';

export type SystemLogsSocketStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';

export interface SystemLogSocketEvent {
  source: SystemLogSource;
  surface?: string | null;
  entry: SystemLogEntry;
  timestamp: number;
}

const LOG_PREFIX = '[system-logs-socket]';
const NAMESPACE = '/admin/logs';
const RECONNECTION_ATTEMPTS = 10;
const RECONNECTION_DELAY_MS = 1_000;
const RECONNECTION_DELAY_MAX_MS = 10_000;

interface UseSystemLogsSocketArgs {
  enabled?: boolean;
  sources?: SystemLogSource[];
  /** When set, only access events for these surfaces are subscribed. */
  surfaces?: string[];
  onEvent?: (event: SystemLogSocketEvent) => void;
}

interface UseSystemLogsSocketReturn {
  status: SystemLogsSocketStatus;
  isConnected: boolean;
}

export const useSystemLogsSocket = ({
  enabled = true,
  sources = ['access', 'app', 'error'],
  surfaces,
  onEvent,
}: UseSystemLogsSocketArgs): UseSystemLogsSocketReturn => {
  const token = useSelector((state: RootState) => {
    const user = state.userSlice?.user as { token?: string } | null | undefined;
    return user?.token;
  });

  const [status, setStatus] = useState<SystemLogsSocketStatus>('idle');
  const onEventRef = useRef(onEvent);
  const sourcesKey = sources.join(',');
  const surfacesKey = (surfaces || []).join(',');

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    if (!enabled) {
      setStatus('idle');
      return;
    }

    if (!SocketUrl || !token) {
      console.warn(`${LOG_PREFIX} ⏸ not connecting — waiting for`, {
        socketUrl: SocketUrl || '(empty)',
        token: token ? 'present' : '(none)',
      });
      setStatus('idle');
      return;
    }

    const url = `${SocketUrl}${NAMESPACE}`;
    console.log(`${LOG_PREFIX} connecting →`, url, { sources, surfaces });
    setStatus('connecting');

    const socket: Socket = io(url, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: RECONNECTION_ATTEMPTS,
      reconnectionDelay: RECONNECTION_DELAY_MS,
      reconnectionDelayMax: RECONNECTION_DELAY_MAX_MS,
    });

    const subscribePayload = () => {
      const payload: { sources: SystemLogSource[]; surfaces?: string[] } = { sources };
      if (surfaces && surfaces.length) payload.surfaces = surfaces;
      socket.emit('subscribe', payload);
    };

    socket.on('connect', () => {
      console.log(`${LOG_PREFIX} ✅ connected`, { id: socket.id });
      setStatus('connected');
      subscribePayload();
    });

    socket.on('subscribed', (payload) => {
      console.log(`${LOG_PREFIX} subscribed`, payload);
    });

    socket.on('LOG_EVENT', (message: SystemLogSocketEvent) => {
      if (!message?.source || !message?.entry) return;
      onEventRef.current?.(message);
    });

    socket.on('disconnect', (reason) => {
      console.warn(`${LOG_PREFIX} ⚠️ disconnected —`, reason);
      setStatus('disconnected');
    });

    socket.on('connect_error', (error) => {
      console.warn(`${LOG_PREFIX} ⚠️ connection error —`, error?.message || error);
      setStatus('error');
    });

    socket.io.on('reconnect_attempt', (attempt) => {
      console.log(`${LOG_PREFIX} reconnecting… attempt ${attempt}`);
      setStatus('connecting');
    });

    socket.io.on('reconnect_failed', () => {
      console.warn(`${LOG_PREFIX} gave up after ${RECONNECTION_ATTEMPTS} attempts`);
      setStatus('error');
    });

    return () => {
      console.log(`${LOG_PREFIX} closing connection`, { url });
      socket.removeAllListeners();
      socket.io.off('reconnect_attempt');
      socket.io.off('reconnect_failed');
      socket.disconnect();
      setStatus('idle');
    };
  }, [enabled, token, sourcesKey, surfacesKey]);

  return { status, isConnected: status === 'connected' };
};
