// useSocket.js
import { io } from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';

const URL = 'http://localhost:3000';

export const useSocket = () => {

    const [chatMessages, setChatMessages] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(URL, {
            autoConnect: false
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('✅ Conectado:', socket.id);
        });

        socket.on('mi_evento', (data) => {
            console.log('🔥 Evento:', data);
        });

        socket.on('chatMessage', (msg) => {
            if (msg.user && msg.message) {
                setChatMessages(prev => [...prev, msg]);
            }
        }); 

        return () => {
            socket.disconnect();
        };

    }, []);

    const conectar = () => socketRef.current.connect();

    const enviarMensaje = (msg) => {
        console.log('Enviando mensaje:', msg);
        socketRef.current.emit('chatMessage', msg);
    };

    return {
        conectar,
        enviarMensaje,
        chatMessages
    };
};