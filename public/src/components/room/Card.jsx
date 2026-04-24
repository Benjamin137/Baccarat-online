import { motion } from "motion/react";

// --- Componente de Carta Mejorado ---
export function Card({ suit, value, index }) {
  const suitSymbols = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };
  const isRed = suit === 'hearts' || suit === 'diamonds';

  return (
    <motion.div
      initial={{ opacity: 0, y: -100, rotateY: 180, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        ease: "easeOut",
        // Retraso extra basado en su posición de reparto
        delay: index * 0.1 
      }}
      className="relative w-16 h-24 md:w-20 md:h-28 bg-white rounded-lg border-2 border-gray-300 shadow-2xl flex flex-col items-center justify-between p-2"
    >
      <div className={`w-full text-left font-bold ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        {value}
      </div>
      <div className={`text-4xl ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        {suitSymbols[suit]}
      </div>
      <div className={`w-full text-right font-bold rotate-180 ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        {value}
      </div>
    </motion.div>
  );
}