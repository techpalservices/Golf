import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import type { IMessage } from '@stomp/stompjs';
import { useAuthStore } from '@/features/auth/store';
import {toast} from "sonner";
import {queryClient} from "@/lib/queryClient.ts";
import type {InfiniteData} from "@tanstack/react-query";

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
                    queryClient.setQueryData<InfiniteData<Notification[]>>(
                        ['notifications'],
                        (old) => old
                            ? { ...old, pages: [[notification, ...old.pages[0]], ...old.pages.slice(1)] }
                            : old
                    );
                    // 2. Badge count
                    queryClient.setQueryData<number>(
                        ['notifications', 'unread-count'],
                        (old) => (old ?? 0) + 1
                    );
                    // 3. Popup — this is the toast you asked about earlier
                    toast.info(notification.title, { description: notification.message });
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