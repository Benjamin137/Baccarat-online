import { motion, AnimatePresence } from "motion/react";
import { Card } from "./Card.jsx";

const Mesa = ({ usersOnline, bancaCards, puntoCards, winner, calculateScore, timer, gameStatus }) => {
  return (
    <div className="flex-1 bg-green-700/40 border-2 border-green-600/30 rounded-[2.5rem] p-4 flex flex-col justify-around items-center relative overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
      
      {/* Timer de Apuestas "Impregnado" en la mesa */}
      <AnimatePresence>
        {gameStatus === "betting" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0"
          >
            <span className="text-[12rem] font-black text-white/10 leading-none select-none tracking-tighter">
              {timer}
            </span>
            <span className="text-white/10 font-bold tracking-[0.5em] uppercase -mt-4 select-none">
              Place your bets
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contador de usuarios en línea */}
      <div className="absolute top-4 right-4 bg-gray-800/50 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-30">
        <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
        {`En línea: ${usersOnline}`}
      </div>

      {/* Banca */}
      <div className="w-full text-center z-10">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h2 className="text-red-500/70 text-lg font-black tracking-[0.3em]">BANKER</h2>
          {bancaCards.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold"
            >
              {calculateScore(bancaCards)}
            </motion.span>
          )}
        </div>
        <div className="flex gap-4 justify-center min-h-[120px]">
          <AnimatePresence mode="popLayout">
            {bancaCards.map((card, index) => (
              <Card 
                key={`banca-${card.suit}-${card.value}-${index}`} 
                suit={card.suit} 
                value={card.value} 
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Ganador Overlay */}
      <div className="h-0 flex items-center justify-center z-20">
        <AnimatePresence>
          {winner && (
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              className={`px-10 py-4 rounded-2xl text-4xl font-black text-white shadow-2xl rotate-[-5deg] animate-bounce ${
                winner === 'Punto' || winner === 'Player' 
                  ? 'bg-blue-600' 
                  : winner === 'Banca' || winner === 'Banker' 
                    ? 'bg-red-600' 
                    : 'bg-green-600'
              } border-4 border-white`}
            >
              ¡{winner.toUpperCase()} GANA!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Punto */}
      <div className="w-full text-center z-10">
        <div className="flex gap-4 justify-center min-h-[120px] mb-4">
          <AnimatePresence mode="popLayout">
            {puntoCards.map((card, index) => (
              <Card 
                key={`punto-${card.suit}-${card.value}-${index}`} 
                suit={card.suit} 
                value={card.value} 
              />
            ))}
          </AnimatePresence>
        </div>
        <div className="flex items-center justify-center gap-4">
          <h2 className="text-blue-400/70 text-lg font-black tracking-[0.3em]">PLAYER</h2>
          {puntoCards.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold"
            >
              {calculateScore(puntoCards)}
            </motion.span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mesa;