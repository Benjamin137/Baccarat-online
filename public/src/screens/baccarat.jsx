import { useState, useEffect } from "react";
import { GameHistory } from "../components/room/GameHistory.jsx";
import { Chat } from "../components/room/Chat.jsx";
import { useSocket } from "../client/useSocket";
import HeaderRoom from "../components/room/header.jsx";
import Controls from "../components/room/controls.jsx";
import Mesa from "../components/room/mesa.jsx";


export default function Baccarat() {

  const { conectar, usersOnline } = useSocket();


  // Estados de Juego
  const [balance, setBalance] = useState(1000);
  const [selectedChip, setSelectedChip] = useState(5);
  const [puntoBet, setPuntoBet] = useState(0);
  const [bancaBet, setBancaBet] = useState(0);
  const [tieBet, setTieBet] = useState(0);
  const [puntoCards, setPuntoCards] = useState([]);
  const [bancaCards, setBancaCards] = useState([]);
  const [gameState, setGameState] = useState('betting'); 
  const [winner, setWinner] = useState(null);
  const [history, setHistory] = useState([]);
  const [messages, setMessages] = useState([
    { id: 1, user: 'Sistema', text: 'Mazo de 6 barajas listo.', timestamp: new Date() }
  ]);
  const [roundNumber, setRoundNumber] = useState(1);
  const [shoe, setShoe] = useState([]); // El "Sabot" de 6 barajas

  // --- LÓGICA DE CASINO (6 Barajas) ---
  const initShoe = () => {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let newShoe = [];
    
    for (let s = 0; s < 6; s++) { // 6 barajas
      for (const suit of suits) {
        for (let i = 0; i < values.length; i++) {
          let numericValue = i + 1;
          if (numericValue >= 10) numericValue = 0; // 10, J, Q, K valen 0
          if (values[i] === 'A') numericValue = 1;
          newShoe.push({ suit, value: values[i], numericValue });
        }
      }
    }
    return shuffleDeck(newShoe);
  };

  const shuffleDeck = (deck) => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Cargar mazo inicial
  useEffect(() => {
    setShoe(initShoe());
      conectar(); // Conectar al socket al montar el componente
  }, []);

  const calculateScore = (cards) => {
    const total = cards.reduce((sum, card) => sum + card.numericValue, 0);
    return total % 10;
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const placeBet = (type) => {
    if (gameState !== 'betting') return;
    if (balance < selectedChip) return;
    setBalance(balance - selectedChip);
    if (type === 'punto') setPuntoBet(puntoBet + selectedChip);
    if (type === 'banca') setBancaBet(bancaBet + selectedChip);
    if (type === 'tie') setTieBet(tieBet + selectedChip);
  };

  // --- REPARTO ASÍNCRONO (UNA POR UNA) ---
  const dealCards = async () => {
    if (puntoBet === 0 && bancaBet === 0 && tieBet === 0) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        user: 'Sistema',
        text: '¡Debes hacer una apuesta primero!',
        timestamp: new Date()
      }]);
      return;
    }

    setGameState('dealing');
    
    // Si el mazo está bajo, barajamos uno nuevo
    let currentShoe = shoe.length < 10 ? initShoe() : [...shoe];

    const p1 = currentShoe.pop();
    const b1 = currentShoe.pop();
    const p2 = currentShoe.pop();
    const b2 = currentShoe.pop();

    // Secuencia de reparto pausada
    setPuntoCards([p1]);
    await sleep(800);
    setBancaCards([b1]);
    await sleep(800);
    setPuntoCards([p1, p2]);
    await sleep(800);
    setBancaCards([b1, b2]);
    await sleep(1000); // Pausa dramática antes del resultado

    const puntoScore = calculateScore([p1, p2]);
    const bancaScore = calculateScore([b1, b2]);

    let gameWinner;
    let winnings = 0;

    if (puntoScore > bancaScore) {
      gameWinner = 'PUNTO';
      winnings = puntoBet * 2;
    } else if (bancaScore > puntoScore) {
      gameWinner = 'BANCA';
      winnings = bancaBet * 1.95;
    } else {
      gameWinner = 'TIE';
      winnings = (tieBet * 9); 
    }

    setWinner(gameWinner);
    setBalance(prev => prev + winnings);
    setShoe(currentShoe);
    setGameState('result');
    setHistory(prev => [{ winner: gameWinner, round: roundNumber }, ...prev]);
    setMessages(prev => [...prev, {
      id: Date.now(),
      user: 'Sistema',
      text: `¡${gameWinner} gana! Punto: ${puntoScore} - Banca: ${bancaScore}`,
      timestamp: new Date()
    }]);
  };

  const resetGame = () => {
    setPuntoCards([]);
    setBancaCards([]);
    setPuntoBet(0);
    setBancaBet(0);
    setTieBet(0);
    setGameState('betting');
    setWinner(null);
    setRoundNumber(roundNumber + 1);
  };

  const handleSendMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      user: 'Jugador',
      text,
      timestamp: new Date()
    }]);
  };

  return (
    <div className="h-[100dvh] w-full bg-gradient-to-br from-green-800 via-green-900 to-gray-900 p-2 md:p-4 overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col gap-4">
        
       <HeaderRoom shoe={shoe} roundNumber={roundNumber} balance={balance} />

        {/* Sala */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
          <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
            {/* Mesa */}
            <Mesa usersOnline={usersOnline} puntoCards={puntoCards} bancaCards={bancaCards} calculateScore={calculateScore} winner={winner} />
            {/* PANEL DE APUESTAS */}
            <Controls selectedChip={selectedChip} setSelectedChip={setSelectedChip} puntoBet={puntoBet} tieBet={tieBet} bancaBet={bancaBet} placeBet={placeBet} gameState={gameState} dealCards={dealCards} resetGame={resetGame} />
            </div >


          {/* SIDEBAR */}
          <div className="flex flex-col gap-4 min-h-0 h-full">
            <div className="flex-1 min-h-0 bg-gray-800/30 rounded-xl overflow-hidden border border-white/5 shadow-xl">
              <GameHistory history={history} />
            </div>
            <div className="flex-1 min-h-0 bg-gray-800/30 rounded-xl overflow-hidden border border-white/5 shadow-xl">
              <Chat messages={messages} onSendMessage={handleSendMessage} />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

