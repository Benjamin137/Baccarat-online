import { useEffect, useState } from 'react';
import { socket } from './socketInstance';

export const useSocket = () => {
    const [chatMessages, setChatMessages] = useState([]);
    const [usersOnline, setUsersOnline] = useState(0);
    
    const [puntoCards, setPuntoCards] = useState([]);
    const [bancaCards, setBancaCards] = useState([]);
    const [timer, setTimer] = useState(0);
    const [gameStatus, setGameStatus] = useState('betting');
    const [winner, setWinner] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        socket.on('gameState', (state) => {
            setGameStatus(state.status);
            setTimer(state.timer);
            setPuntoCards(state.cards.punto);
            setBancaCards(state.cards.banca);
            setWinner(state.winner);
            setHistory(state.history);
        });

        socket.on('usersOnline', (count) => setUsersOnline(count));

        socket.on('timerUpdate', (t) => setTimer(t));
        
        socket.on('statusUpdate', (status) => setGameStatus(status));

        socket.on('cardsUpdate', (cards) => {
            setPuntoCards(cards.punto);
            setBancaCards(cards.banca);
        });

        socket.on('gameResult', (data) => {
            setWinner(data.winner);
            setHistory(data.history);
            setGameStatus('result');
        });

        socket.on('betResult', (data) => {
            console.log("Resultado de apuesta recibido:", data);
        });

        socket.on('betAccepted', (data) => {
            console.log("Apuesta confirmada en servidor:", data);
        });

        socket.on('betError', (err) => {
            console.error("Error en apuesta:", err.message);
        });

        socket.on('chatMessage', (msg) => {
            setChatMessages(prev => [...prev, msg]);
        });

        return () => {
            socket.off('gameState');
            socket.off('usersOnline');
            socket.off('timerUpdate');
            socket.off('statusUpdate');
            socket.off('cardsUpdate');
            socket.off('gameResult');
            socket.off('chatMessage');
            socket.off('betResult');
            socket.off('betAccepted');
            socket.off('betError');
        };
    }, []);

    const conectar = () => { if (!socket.connected) socket.connect(); };

    return {
        conectar,
        socket,
        chatMessages,
        usersOnline,
        puntoCards,
        bancaCards,
        timer,
        gameStatus,
        winner,
        history
    };
};