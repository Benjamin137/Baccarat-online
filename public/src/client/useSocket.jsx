import { useEffect, useState } from 'react';
import { socket } from './socketInstance';

export const useSocket = () => {

    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {

        socket.on('chatMessage', (msg) => {
            if (msg.user && msg.message) {
                setChatMessages(prev => [...prev, msg]);
            }
        });

        return () => {
            socket.off('chatMessage');
        };

    }, []);

    const conectar = () => {
        if (!socket.connected) {
            socket.connect();
        }
    };

    return {
        conectar,
        socket,
        chatMessages
    };
};