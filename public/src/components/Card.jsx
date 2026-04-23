import { motion } from "motion/react";

export function Card({ suit, value, faceDown = false }) {
  const suitSymbols = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠'
  };

  const isRed = suit === 'hearts' || suit === 'diamonds';

  if (faceDown) {
    return (
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 0 }}
        className="relative w-16 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg border-2 border-blue-900 flex items-center justify-center"
      >
        <div className="text-white text-2xl">🂠</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0, rotateY: 180 }}
      animate={{ scale: 1, rotateY: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-16 h-24 bg-white rounded-lg border-2 border-gray-300 shadow-lg flex flex-col items-center justify-between p-2"
    >
      <div className={`text-xl ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        {value}
      </div>
      <div className={`text-3xl ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        {suitSymbols[suit]}
      </div>
      <div className={`text-xl ${isRed ? 'text-red-600' : 'text-gray-900'} rotate-180`}>
        {value}
      </div>
    </motion.div>
  );
}