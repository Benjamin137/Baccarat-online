import { motion } from "motion/react";

const BetButton = ({ label, color, amount, onClick, active }) => {

  const colorConfig = {
    "bg-blue-600": "shadow-blue-900/50 hover:shadow-blue-500/40 ring-blue-400/30",
    "bg-green-600": "shadow-green-900/50 hover:shadow-green-500/40 ring-green-400/30",
    "bg-red-600": "shadow-red-900/50 hover:shadow-red-500/40 ring-red-400/30",
  };

  return (
    <button
      onClick={onClick}
      disabled={!active}
      className={`
        ${color} ${colorConfig[color] || ""}
        disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed
        transition-all duration-200
        rounded-2xl w-full h-24 text-white relative 
        flex flex-col items-center justify-center 
        border-t border-white/20 border-b-4 border-black/40
        shadow-xl ring-1
        active:border-b-0 active:translate-y-1 active:shadow-inner
        group overflow-hidden
      `}
    >
      {/* Efecto de brillo al pasar el mouse */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Etiqueta superior */}
      <span className="text-[11px] font-black opacity-60 tracking-[0.2em] uppercase mb-2">
        {label}
      </span>
      
      {/* Contenedor central de la apuesta */}
      <div className="flex items-center justify-center h-10 w-full relative">
        {amount > 0 ? (
          <motion.div 
            initial={{ scale: 0, y: 10 }} 
            animate={{ scale: 1, y: 0 }} 
            className="bg-yellow-500 text-black text-[12px] font-black w-10 h-10 flex items-center justify-center rounded-full border-2 border-white shadow-[0_4px_10px_rgba(0,0,0,0.5)] z-10"
          >
            {amount}
          </motion.div>
        ) : (
          <span className="text-[10px] font-bold opacity-30 tracking-widest italic">
            NO BET
          </span>
        )}
      </div>

    </button>
  );
};

export default BetButton;