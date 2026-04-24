import { Trophy} from "lucide-react";




const HeaderRoom = ({shoe, roundNumber, balance}) => {
    return (
        <header className="bg-gray-800/50 backdrop-blur rounded-lg p-4 flex justify-between items-center shrink-0 border border-white/10">
            <div className="flex items-center gap-4">
                <Trophy className="text-yellow-400" size={32} />
                <div>
                    <h1 className="text-white text-2xl md:text-3xl font-bold leading-none uppercase tracking-tighter">Semendick Royal</h1>
                    <p className="text-green-400 text-[10px] font-mono">SHOE: {shoe.length} CARDS | R#{roundNumber}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-gray-400 text-xs uppercase tracking-wider">Balance</p>
                <p className="text-yellow-400 text-xl md:text-2xl font-mono font-bold">${balance.toFixed(2)}</p>
            </div>
        </header>
    )
}


export default HeaderRoom;