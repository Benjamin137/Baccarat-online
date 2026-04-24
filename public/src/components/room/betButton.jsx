import { motion, AnimatePresence } from "motion/react";



const BetButton = ({ label, color, amount, onClick, active }) => {
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

export default BetButton;