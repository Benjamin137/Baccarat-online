import { useState } from "react";
import { Card } from "./components/Card.jsx";
import { BettingChips } from "./components/BettingChips.jsx";
import { GameHistory } from "./components/GameHistory.jsx";
import { Chat } from "./components/Chat.jsx";
import { motion } from "motion/react";
import { Trophy, RotateCcw } from "lucide-react";

export default function App() {
  const [balance, setBalance] = useState(1000);
  const [selectedChip, setSelectedChip] = useState(5);
  const [puntoBet, setPuntoBet] = useState(0);
  const [bancaBet, setBancaBet] = useState(0);
  const [tieBet, setTieBet] = useState(0);
  const [puntoCards, setPuntoCards] = useState([]);
  const [bancaCards, setBancaCards] = useState([]);
  const [gameState, setGameState] = useState('betting'); // 'betting' | 'dealing' | 'result'
  const [winner, setWinner] = useState(null);
  const [history, setHistory] = useState([]);
  const [messages, setMessages] = useState([
    { id: 1, user: 'Sistema', text: '¡Bienvenido al Baccarat!', timestamp: new Date() }
  ]);
  const [roundNumber, setRoundNumber] = useState(1);

  const createDeck = () => {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck = [];

    for (const suit of suits) {
      for (let i = 0; i < values.length; i++) {
        const value = values[i];
        let numericValue = i + 1;
        if (numericValue > 9) numericValue = 0;
        deck.push({ suit, value, numericValue });
      }
    }
    return deck;
  };

  const shuffleDeck = (deck) => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const calculateScore = (cards) => {
    const total = cards.reduce((sum, card) => sum + card.numericValue, 0);
    return total % 10;
  };

  const placeBet = (type) => {
    if (gameState !== 'betting') return;
    if (balance < selectedChip) return;

    setBalance(balance - selectedChip);

    if (type === 'punto') setPuntoBet(puntoBet + selectedChip);
    if (type === 'banca') setBancaBet(bancaBet + selectedChip);
    if (type === 'tie') setTieBet(tieBet + selectedChip);
  };

  const dealCards = () => {
    if (puntoBet === 0 && bancaBet === 0 && tieBet === 0) {
      setMessages([...messages, {
        id: messages.length + 1,
        user: 'Sistema',
        text: '¡Debes hacer una apuesta primero!',
        timestamp: new Date()
      }]);
      return;
    }

    setGameState('dealing');
    const deck = shuffleDeck(createDeck());

    const puntoHand = [deck[0], deck[2]];
    const bancaHand = [deck[1], deck[3]];

    setPuntoCards(puntoHand);
    setBancaCards(bancaHand);

    setTimeout(() => {
      const puntoScore = calculateScore(puntoHand);
      const bancaScore = calculateScore(bancaHand);

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
        winnings = (tieBet * 8) + puntoBet + bancaBet;
      }

      setWinner(gameWinner);
      setBalance(prevBalance => prevBalance + winnings);
      setGameState('result');

      setHistory([...history, { winner: gameWinner, round: roundNumber }]);
      setMessages(prevMessages => [...prevMessages, {
        id: prevMessages.length + 1,
        user: 'Sistema',
        text: `¡${gameWinner} gana! Punto: ${puntoScore} - Banca: ${bancaScore}`,
        timestamp: new Date()
      }]);
    }, 1500);
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
    setMessages([...messages, {
      id: messages.length + 1,
      user: 'Jugador',
      text,
      timestamp: new Date()
    }]);
  };

  return (
    // CONTENEDOR RAIZ: 100dvh exactos, sin overflow
    <div className="h-[100dvh] w-full bg-gradient-to-br from-green-800 via-green-900 to-gray-900 p-2 md:p-4 overflow-hidden flex flex-col">
      
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col gap-4">
        
        {/* HEADER: Altura fija automática */}
        <header className="bg-gray-800/50 backdrop-blur rounded-lg p-4 flex justify-between items-center shrink-0 border border-white/10">
          <div className="flex items-center gap-4">
            <Trophy className="text-yellow-400" size={32} />
            <div>
              <h1 className="text-white text-2xl md:text-3xl font-bold leading-none">Baccarat</h1>
              <p className="text-gray-400 text-xs">Ronda #{roundNumber}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs uppercase tracking-wider">Balance</p>
            <p className="text-yellow-400 text-xl md:text-2xl font-bold">${balance.toFixed(2)}</p>
          </div>
        </header>

        {/* CUERPO PRINCIPAL: flex-1 para ocupar el resto del 100dvh */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
          
          {/* SECCIÓN JUEGO (Izquierda) */}
          <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
            
            {/* TAPETE: Se ajusta al espacio disponible */}
            <div className="flex-1 bg-green-700/50 border-2 border-green-600/30 rounded-xl p-4 flex flex-col justify-around items-center relative overflow-hidden">
              
              {/* Banca */}
              <div className="w-full text-center">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <h2 className="text-white/50 text-lg font-bold tracking-widest">BANCA</h2>
                  {bancaCards.length > 0 && (
                    <span className="bg-yellow-400 text-black px-2 py-0.5 rounded text-sm font-bold">
                      {calculateScore(bancaCards)}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 justify-center h-24 md:h-32">
                  {bancaCards.map((card, index) => <Card key={index} {...card} />)}
                </div>
              </div>

              {/* Punto */}
              <div className="w-full text-center">
                <div className="flex gap-2 justify-center h-24 md:h-32 mb-2">
                  {puntoCards.map((card, index) => <Card key={index} {...card} />)}
                </div>
                <div className="flex items-center justify-center gap-4">
                  <h2 className="text-white/50 text-lg font-bold tracking-widest">PUNTO</h2>
                  {puntoCards.length > 0 && (
                    <span className="bg-yellow-400 text-black px-2 py-0.5 rounded text-sm font-bold">
                      {calculateScore(puntoCards)}
                    </span>
                  )}
                </div>
              </div>

              {/* Ganador Overlay */}
              {winner && (
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10"
                >
                  <div className={`px-8 py-4 rounded-xl text-3xl font-black text-white shadow-2xl shadow-black/50 ${
                    winner === 'PUNTO' ? 'bg-blue-600' : winner === 'BANCA' ? 'bg-red-600' : 'bg-green-600'
                  }`}>
                    ¡{winner} GANA!
                  </div>
                </motion.div>
              )}
            </div>

            {/* PANEL DE APUESTAS: Altura fija compacta */}
            <div className="bg-gray-800/80 rounded-xl p-4 shrink-0">
              <div className="flex flex-col justify-between items-center gap-4">
                <div className="">
                  <p className="text-white/60 text-xs mb-2 ml-1">Ficha seleccionada</p>
                  <BettingChips selectedChip={selectedChip} onSelectChip={setSelectedChip} />
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <BetButton label="PUNTO" color="bg-blue-600" amount={puntoBet} onClick={() => placeBet('punto')} active={gameState === 'betting'} />
                  <BetButton label="EMPATE" color="bg-green-600" amount={tieBet} onClick={() => placeBet('tie')} active={gameState === 'betting'} />
                  <BetButton label="BANCA" color="bg-red-600" amount={bancaBet} onClick={() => placeBet('banca')} active={gameState === 'betting'} />
                </div>

                <div className="">
                  {gameState === 'betting' ? (
                    <button onClick={dealCards} className="w-full h-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg py-3 transition-all active:scale-95">
                      REPARTIR
                    </button>
                  ) : (
                    <button onClick={resetGame} className="w-full h-full bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg py-3 transition-all flex items-center justify-center gap-2">
                      <RotateCcw size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR (Derecha) */}
          <div className="flex flex-col gap-4 min-h-0 h-full">
            <div className="flex-1 min-h-0 bg-gray-800/30 rounded-xl overflow-hidden border border-white/5">
              <GameHistory history={history} />
            </div>
            <div className="flex-1 min-h-0 bg-gray-800/30 rounded-xl overflow-hidden border border-white/5">
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
      className={`${color} disabled:opacity-50 disabled:grayscale transition-all rounded-lg p-2 text-white relative flex flex-col items-center justify-center min-h-[60px]`}
    >
      <span className="text-xs font-bold opacity-80">{label}</span>
      {amount > 0 && (
        <span className="absolute -top-2 -right-1 bg-yellow-400 text-black text-[10px] font-black px-1.5 rounded-full shadow-lg">
          ${amount}
        </span>
      )}
    </button>
  );
}