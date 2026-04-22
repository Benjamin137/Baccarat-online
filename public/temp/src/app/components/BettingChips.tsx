import { motion } from "motion/react";

interface BettingChipsProps {
  onSelectChip: (value: number) => void;
  selectedChip: number;
}

export function BettingChips({ onSelectChip, selectedChip }: BettingChipsProps) {
  const chips = [
    { value: 1, color: 'bg-white border-gray-400 text-gray-900' },
    { value: 5, color: 'bg-red-600 border-red-800 text-white' },
    { value: 10, color: 'bg-blue-600 border-blue-800 text-white' },
    { value: 25, color: 'bg-green-600 border-green-800 text-white' },
    { value: 100, color: 'bg-black border-gray-600 text-white' },
    { value: 500, color: 'bg-purple-600 border-purple-800 text-white' }
  ];

  return (
    <div className="flex gap-3 flex-wrap justify-center">
      {chips.map((chip) => (
        <motion.button
          key={chip.value}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectChip(chip.value)}
          className={`
            relative w-16 h-16 rounded-full border-4 ${chip.color}
            flex items-center justify-center shadow-lg
            ${selectedChip === chip.value ? 'ring-4 ring-yellow-400' : ''}
          `}
        >
          <div className="absolute inset-0 rounded-full border-4 border-white opacity-20"></div>
          <span className="text-lg font-bold">${chip.value}</span>
        </motion.button>
      ))}
    </div>
  );
}
