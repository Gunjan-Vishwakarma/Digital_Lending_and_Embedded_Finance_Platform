import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { addNotification } from '../store/slices/notificationSlice';
import { getAccessToken } from '../services/api';
import type { NotificationPayload } from '../types/api';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

export const useWebSocket = (userId: string | undefined) => {
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(() => {
    if (!userId) return;

    const token = getAccessToken();
    if (!token) return;

    const socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    socket.on('connect', () => {
      console.log('[WS] Connected');
    });

    socket.on(`notification:${userId}`, (data: NotificationPayload) => {
      dispatch(addNotification(data));
    });

    socket.on('disconnect', (reason) => {
      console.log('[WS] Disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
      console.error('[WS] Connection error:', err.message);
    });

    socketRef.current = socket;
  }, [userId, dispatch]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { socket: socketRef.current, reconnect: connect };
};
