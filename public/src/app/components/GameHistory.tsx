interface HistoryItem {
  winner: 'PUNTO' | 'BANCA' | 'TIE';
  round: number;
}

interface GameHistoryProps {
  history: HistoryItem[];
}

export function GameHistory({ history }: GameHistoryProps) {
  return (
    <div className="bg-gray-900 rounded-lg p-4 h-full flex flex-col">
      <h3 className="text-white text-lg mb-3">Historial</h3>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-wrap gap-2">
          {history.slice(-30).map((item, index) => (
            <div
              key={index}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold
                ${item.winner === 'PUNTO' ? 'bg-blue-500 text-white' : ''}
                ${item.winner === 'BANCA' ? 'bg-red-500 text-white' : ''}
                ${item.winner === 'TIE' ? 'bg-green-500 text-white' : ''}
              `}
              title={`Ronda ${item.round}: ${item.winner}`}
            >
              {item.winner === 'PUNTO' ? 'P' : item.winner === 'BANCA' ? 'B' : 'T'}
            </div>
          ))}
        </div>
        {history.length === 0 && (
          <p className="text-gray-500 text-sm">No hay historial aún</p>
        )}
      </div>
    </div>
  );
}
