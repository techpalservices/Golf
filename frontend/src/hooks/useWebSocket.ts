import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import type { IMessage } from '@stomp/stompjs';
import { useAuthStore } from '@/features/auth/store';

export function useWebSocket() {
    const clientRef = useRef<Client | null>(null);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        if (!user) return; // Only connect when authenticated
        console.log('Connecting to WebSocket for user:', user.firstName);
        const client = new Client({
            brokerURL: 'ws://localhost:8081/ws',
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe('/user/queue/notifications', (message: IMessage) => {
                    const notification = JSON.parse(message.body);
                    // Handle the notification — add to store, show toast, etc.
                    console.log('WebSocket notification:', notification);
                });
            },
            onDisconnect: () => {
                console.log('WebSocket disconnected');
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, [user]);

    return clientRef;
}