import { useEffect, useState } from 'react';
import { socket } from './socketInstance';

export const useSocket = () => {
    const [chatMessages, setChatMessages] = useState([]);
    const [usersOnline, setUsersOnline] = useState(0);
    
    // Estados del Juego sincronizados
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

        socket.on('chatMessage', (msg) => {
            setChatMessages(prev => [...prev, msg]);
        });

        return () => {
            socket.off('gameState');
            socket.off('timerUpdate');
            socket.off('statusUpdate');
            socket.off('cardsUpdate');
            socket.off('gameResult');
            socket.off('chatMessage');
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