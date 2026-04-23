import { useEffect, useState } from 'react';
import { socket } from './socketInstance';

export const useSocket = () => {

    const [chatMessages, setChatMessages] = useState([]);
    const [usersOnline, setUsersOnline] = useState(0);

    useEffect(() => {

        socket.on('chatMessage', (msg) => {
            if (msg.user && msg.message) {
                setChatMessages(prev => [...prev, msg]);
            }
        });


        socket.on('usersOnline', (count) => {
            setUsersOnline(count);
        });

        return () => {
            socket.off('chatMessage');
            socket.off('usersOnline');
        };

    }, []);

    const conectar = () => {
        if (!socket.connected) {
            socket.connect();
        }
    };

    const sendMessageChat = (message) => {
        if (message.trim() !== '') {
            socket.emit('chatMessage', message);
        }
    };



    return {
        conectar,
        socket,
        chatMessages,
        sendMessageChat,
        usersOnline
    };
};