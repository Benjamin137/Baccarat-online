import BetButton from "./betButton";
import { BettingChips } from "./BettingChips";

const Controls = ({
    selectedChip,
    setSelectedChip,
    puntoBet,
    tieBet,
    bancaBet,
    placeBet,
    gameState
}) => {
    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Contenedor Principal con efecto Glassmorphism */}
            <div className="bg-gray-900/80 backdrop-blur-md rounded-[2rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden">

                {/* Decoración sutil de fondo */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />

                <div className="flex flex-col items-center gap-8">

                    {/* SECCIÓN DE FICHAS */}
                    <div className="relative py-2 px-6 bg-black/20 rounded-full border border-white/5 shadow-inner">
                        <BettingChips selectedChip={selectedChip} onSelectChip={setSelectedChip} />
                    </div>

                    {/* SECCIÓN DE BOTONES DE APUESTA */}
                    {/* SECCIÓN DE BOTONES DE APUESTA */}
                    <div className="flex flex-row justify-between gap-4 w-full max-w-6xl">

                        {/* Punto */}
                        <div className="flex-[2] flex">
                            <BetButton
                                label="Punto"
                                color="bg-blue-600"
                                amount={puntoBet}
                                onClick={() => placeBet('punto')}
                                active={gameState === 'betting'}
                            />
                        </div>

                        {/* TIE */}
                        <div className="flex-1 flex">
                            <BetButton
                                label="Tie"
                                color="bg-green-600"
                                amount={tieBet}
                                onClick={() => placeBet('tie')}
                                active={gameState === 'betting'}
                            />
                        </div>

                        {/* Banca */}
                        <div className="flex-[2] flex">
                            <BetButton
                                label="Banca"
                                color="bg-red-600"
                                amount={bancaBet}
                                onClick={() => placeBet('banca')}
                                active={gameState === 'betting'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Controls;