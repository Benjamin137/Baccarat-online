import { useEffect, useState } from "react";
import { GameHistory } from "../components/room/GameHistory.jsx";
import { Chat } from "../components/room/Chat.jsx";
import { useSocket } from "../client/useSocket";
import HeaderRoom from "../components/room/header.jsx";
import Controls from "../components/room/controls.jsx";
import Mesa from "../components/room/mesa.jsx";

export default function Baccarat() {
  const { 
    conectar, usersOnline, puntoCards, bancaCards, 
    timer, gameStatus, winner, history, chatMessages 
  } = useSocket();

  const [balance, setBalance] = useState(1000);
  const [selectedChip, setSelectedChip] = useState(5);
  const [betAmounts, setBetAmounts] = useState({ punto: 0, banca: 0, tie: 0 });

  useEffect(() => {
    conectar();
  }, []);

  // Limpiar apuestas locales cuando empieza una nueva ronda
  useEffect(() => {
    if (gameStatus === 'betting') {
      setBetAmounts({ punto: 0, banca: 0, tie: 0 });
    }
  }, [gameStatus]);

  const placeBet = (type) => {
    if (gameStatus !== 'betting') return;
    if (balance < selectedChip) return;
    
    setBalance(prev => prev - selectedChip);
    setBetAmounts(prev => ({ ...prev, [type]: prev[type] + selectedChip }));
    
    // Aquí podrías emitir al servidor la apuesta si quieres que otros la vean
    // socket.emit('newBet', { type, amount: selectedChip });
  };

  const calculateScore = (cards) => {
    if (!cards.length) return 0;
    // Asumiendo que las cartas del server traen numericValue o valor estándar
    const total = cards.reduce((sum, card) => {
        let val = parseInt(card.value);
        if (isNaN(val)) val = card.value === 'A' ? 1 : 0;
        return sum + val;
    }, 0);
    return total % 10;
  };

  return (
    <div className="h-[100dvh] w-full bg-gradient-to-br from-green-800 via-green-900 to-gray-900 p-2 md:p-4 overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col gap-4">
        
        <HeaderRoom balance={balance} roundNumber={history.length + 1} />

        <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
          <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
            {/* Mesa: Recibe todo por props desde el Hook */}
            <Mesa 
              usersOnline={usersOnline} 
              puntoCards={puntoCards} 
              bancaCards={bancaCards} 
              calculateScore={calculateScore} 
              winner={winner}
              timer={timer} 
              gameStatus={gameStatus}
            />

            <Controls 
              selectedChip={selectedChip} 
              setSelectedChip={setSelectedChip} 
              puntoBet={betAmounts.punto} 
              tieBet={betAmounts.tie} 
              bancaBet={betAmounts.banca} 
              placeBet={placeBet} 
              gameState={gameStatus} 
            />
          </div>

          <div className="flex flex-col gap-4 min-h-0 h-full">
            <div className="flex-1 min-h-0 bg-gray-800/30 rounded-xl border border-white/5">
              <GameHistory history={history} />
            </div>
            <div className="flex-1 min-h-0 bg-gray-800/30 rounded-xl border border-white/5">
              <Chat messages={chatMessages} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}