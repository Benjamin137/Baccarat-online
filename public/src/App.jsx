import { useState, useEffect } from "react";
import { Card } from "./components/Card.jsx";
import { BettingChips } from "./components/BettingChips.jsx";
import { GameHistory } from "./components/GameHistory.jsx";
import { Chat } from "./components/Chat.jsx";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, RotateCcw } from "lucide-react";
import {useSocket} from './client/useSocket.jsx';


export default function App() {

  const { conectar } = useSocket();


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
        
        {/* HEADER */}
        <header className="bg-gray-800/50 backdrop-blur rounded-lg p-4 flex justify-between items-center shrink-0 border border-white/10">
          <div className="flex items-center gap-4">
            <Trophy className="text-yellow-400" size={32} />
            <div>
              <h1 className="text-white text-2xl md:text-3xl font-bold leading-none uppercase tracking-tighter">Semendick Royal</h1>
              <p className="text-green-400 text-[10px] font-mono">SHOE: {shoe.length} CARDS | R#{roundNumber}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs uppercase tracking-wider">Balance</p>
            <p className="text-yellow-400 text-xl md:text-2xl font-mono font-bold">${balance.toFixed(2)}</p>
          </div>
        </header>

        {/* CUERPO PRINCIPAL */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
          
          <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
            
            {/* TAPETE */}
            <div className="flex-1 bg-green-700/40 border-2 border-green-600/30 rounded-[2.5rem] p-4 flex flex-col justify-around items-center relative overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
              
              {/* Banca */}
              <div className="w-full text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <h2 className="text-red-500/70 text-lg font-black tracking-[0.3em]">BANKER</h2>
                  {bancaCards.length > 0 && (
                    <motion.span initial={{scale:0}} animate={{scale:1}} className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {calculateScore(bancaCards)}
                    </motion.span>
                  )}
                </div>
                <div className="flex gap-4 justify-center min-h-[120px]">
                  <AnimatePresence>
                    {bancaCards.map((card, index) => <Card key={`b-${index}`} {...card} />)}
                  </AnimatePresence>
                </div>
              </div>

              {/* Ganador Overlay */}
              <div className="h-0 flex items-center justify-center z-20">
                <AnimatePresence>
                  {winner && (
                    <motion.div 
                      initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} exit={{scale:0}}
                      className={`px-10 py-4 rounded-2xl text-4xl font-black text-white shadow-2xl rotate-[-5deg] animate-bounce ${
                        winner === 'PUNTO' ? 'bg-blue-600' : winner === 'BANCA' ? 'bg-red-600' : 'bg-green-600'
                      } border-4 border-white`}
                    >
                      ¡{winner} GANA!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Punto */}
              <div className="w-full text-center">
                <div className="flex gap-4 justify-center min-h-[120px] mb-4">
                  <AnimatePresence>
                    {puntoCards.map((card, index) => <Card key={`p-${index}`} {...card} />)}
                  </AnimatePresence>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <h2 className="text-blue-400/70 text-lg font-black tracking-[0.3em]">PLAYER</h2>
                  {puntoCards.length > 0 && (
                    <motion.span initial={{scale:0}} animate={{scale:1}} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {calculateScore(puntoCards)}
                    </motion.span>
                  )}
                </div>
              </div>
            </div>

            {/* PANEL DE APUESTAS */}
            <div className="bg-gray-900/90 rounded-2xl p-6 shrink-0 border border-white/5">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <BettingChips selectedChip={selectedChip} onSelectChip={setSelectedChip} />
                </div>
                
                <div className="flex gap-4">
                  <BetButton label="PUNTO" color="bg-blue-600" amount={puntoBet} onClick={() => placeBet('punto')} active={gameState === 'betting'} />
                  <BetButton label="TIE" color="bg-green-600" amount={tieBet} onClick={() => placeBet('tie')} active={gameState === 'betting'} />
                  <BetButton label="BANCA" color="bg-red-600" amount={bancaBet} onClick={() => placeBet('banca')} active={gameState === 'betting'} />
                </div>

                <div className="w-full md:w-auto">
                  {gameState === 'betting' ? (
                    <button onClick={dealCards} className="w-full px-12 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-xl transition-all active:scale-95 shadow-lg uppercase tracking-tighter">
                      Repartir
                    </button>
                  ) : (
                    <button onClick={resetGame} disabled={gameState === 'dealing'} className="w-full px-12 py-4 bg-white/10 hover:bg-white/20 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-30 uppercase tracking-tighter">
                      <RotateCcw size={20} /> Limpiar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

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

function BetButton({ label, color, amount, onClick, active }) {
  return (
    <button
      onClick={onClick}
      disabled={!active}
      className={`${color} disabled:opacity-50 disabled:grayscale transition-all rounded-xl w-24 h-20 text-white relative flex flex-col items-center justify-center border-b-4 border-black/30 shadow-lg active:border-b-0 active:translate-y-1`}
    >
      <span className="text-[10px] font-black opacity-70 tracking-widest">{label}</span>
      <span className="text-sm font-mono font-bold">${amount}</span>
      {amount > 0 && (
        <motion.div initial={{scale:0}} animate={{scale:1}} className="absolute -top-3 -right-3 bg-yellow-400 text-black text-[10px] font-black w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-900 shadow-xl">
          {amount}
        </motion.div>
      )}
    </button>
  );
}