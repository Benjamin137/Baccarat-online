import { useState } from "react";
import { Card } from "./components/Card";
import { BettingChips } from "./components/BettingChips";
import { GameHistory } from "./components/GameHistory";
import { Chat } from "./components/Chat";
import { motion } from "motion/react";
import { Trophy, RotateCcw } from "lucide-react";

interface CardType {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  value: string;
  numericValue: number;
}

interface HistoryItem {
  winner: 'PUNTO' | 'BANCA' | 'TIE';
  round: number;
}

interface Message {
  id: number;
  user: string;
  text: string;
  timestamp: Date;
}

export default function App() {
  const [balance, setBalance] = useState(1000);
  const [selectedChip, setSelectedChip] = useState(5);
  const [puntoBet, setPuntoBet] = useState(0);
  const [bancaBet, setBancaBet] = useState(0);
  const [tieBet, setTieBet] = useState(0);
  const [puntoCards, setPuntoCards] = useState<CardType[]>([]);
  const [bancaCards, setBancaCards] = useState<CardType[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'dealing' | 'result'>('betting');
  const [winner, setWinner] = useState<'PUNTO' | 'BANCA' | 'TIE' | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, user: 'Sistema', text: '¡Bienvenido al Baccarat!', timestamp: new Date() }
  ]);
  const [roundNumber, setRoundNumber] = useState(1);

  const createDeck = (): CardType[] => {
    const suits: ('hearts' | 'diamonds' | 'clubs' | 'spades')[] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck: CardType[] = [];

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

  const shuffleDeck = (deck: CardType[]): CardType[] => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const calculateScore = (cards: CardType[]): number => {
    const total = cards.reduce((sum, card) => sum + card.numericValue, 0);
    return total % 10;
  };

  const placeBet = (type: 'punto' | 'banca' | 'tie') => {
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

      let gameWinner: 'PUNTO' | 'BANCA' | 'TIE';
      let winnings = 0;

      if (puntoScore > bancaScore) {
        gameWinner = 'PUNTO';
        winnings = puntoBet * 2;
      } else if (bancaScore > puntoScore) {
        gameWinner = 'BANCA';
        winnings = bancaBet * 1.95;
      } else {
        gameWinner = 'TIE';
        winnings = tieBet * 8 + puntoBet + bancaBet;
      }

      setWinner(gameWinner);
      setBalance(balance + winnings);
      setGameState('result');

      setHistory([...history, { winner: gameWinner, round: roundNumber }]);
      setMessages([...messages, {
        id: messages.length + 1,
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

  const handleSendMessage = (text: string) => {
    setMessages([...messages, {
      id: messages.length + 1,
      user: 'Jugador',
      text,
      timestamp: new Date()
    }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-900 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-4 mb-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Trophy className="text-yellow-400" size={32} />
            <div>
              <h1 className="text-white text-3xl font-bold">Baccarat</h1>
              <p className="text-gray-400 text-sm">Ronda #{roundNumber}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Balance</p>
            <p className="text-yellow-400 text-2xl font-bold">${balance}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-green-700 rounded-lg p-6 min-h-96">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white text-xl font-bold">BANCA</h2>
                  <div className="text-yellow-400 text-2xl font-bold">
                    {bancaCards.length > 0 && calculateScore(bancaCards)}
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  {bancaCards.map((card, index) => (
                    <Card key={index} {...card} />
                  ))}
                </div>
              </div>

              <div className="my-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white text-xl font-bold">PUNTO</h2>
                  <div className="text-yellow-400 text-2xl font-bold">
                    {puntoCards.length > 0 && calculateScore(puntoCards)}
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  {puntoCards.map((card, index) => (
                    <Card key={index} {...card} />
                  ))}
                </div>
              </div>

              {winner && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center mb-4"
                >
                  <div className={`
                    inline-block px-8 py-4 rounded-lg text-2xl font-bold
                    ${winner === 'PUNTO' ? 'bg-blue-500' : ''}
                    ${winner === 'BANCA' ? 'bg-red-500' : ''}
                    ${winner === 'TIE' ? 'bg-green-500' : ''}
                    text-white
                  `}>
                    ¡{winner} GANA!
                  </div>
                </motion.div>
              )}
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-white text-lg mb-4">Selecciona tu ficha</h3>
              <BettingChips selectedChip={selectedChip} onSelectChip={setSelectedChip} />

              <div className="grid grid-cols-3 gap-4 mt-6">
                <button
                  onClick={() => placeBet('punto')}
                  disabled={gameState !== 'betting'}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg p-4 transition"
                >
                  <div className="text-xl font-bold">PUNTO</div>
                  <div className="text-sm">Paga 1:1</div>
                  {puntoBet > 0 && <div className="text-yellow-400 mt-2">${puntoBet}</div>}
                </button>

                <button
                  onClick={() => placeBet('tie')}
                  disabled={gameState !== 'betting'}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg p-4 transition"
                >
                  <div className="text-xl font-bold">EMPATE</div>
                  <div className="text-sm">Paga 8:1</div>
                  {tieBet > 0 && <div className="text-yellow-400 mt-2">${tieBet}</div>}
                </button>

                <button
                  onClick={() => placeBet('banca')}
                  disabled={gameState !== 'betting'}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg p-4 transition"
                >
                  <div className="text-xl font-bold">BANCA</div>
                  <div className="text-sm">Paga 0.95:1</div>
                  {bancaBet > 0 && <div className="text-yellow-400 mt-2">${bancaBet}</div>}
                </button>
              </div>

              <div className="flex gap-4 mt-6">
                {gameState === 'betting' && (
                  <button
                    onClick={dealCards}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg py-4 text-xl font-bold transition"
                  >
                    REPARTIR CARTAS
                  </button>
                )}

                {gameState === 'result' && (
                  <button
                    onClick={resetGame}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-lg py-4 text-xl font-bold transition flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={24} />
                    NUEVA RONDA
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 h-[800px]">
            <div className="flex-1">
              <GameHistory history={history} />
            </div>
            <div className="flex-1">
              <Chat messages={messages} onSendMessage={handleSendMessage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}