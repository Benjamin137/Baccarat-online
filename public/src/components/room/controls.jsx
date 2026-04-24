import BetButton from "./betButton";
import { BettingChips } from "./BettingChips";
import { RotateCcw } from "lucide-react";





const Controls = ({ selectedChip, setSelectedChip, puntoBet, tieBet, bancaBet, placeBet, gameState, dealCards, resetGame }) => {
    return (
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
    )
}


export default Controls;