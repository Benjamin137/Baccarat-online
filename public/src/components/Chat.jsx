import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

export function Chat({ messages = [], onSendMessage }) {
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  // Auto-scroll al último mensaje cada vez que llegan nuevos
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    /* h-full para llenar el contenedor padre y min-h-0 para evitar el desborde en flex */
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg flex flex-col h-full min-h-0 border border-white/5">
      
      {/* Título Fijo */}
      <div className="p-3 border-b border-white/5 shrink-0">
        <h3 className="text-white text-sm font-bold uppercase tracking-wider">Chat en vivo</h3>
      </div>

      {/* Área de Mensajes Scrolleable */}
      {/* flex-1 y min-h-0 son CRUCIALES aquí para que el scroll funcione */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scroll-smooth min-h-0"
      >
        {messages.map((msg) => (
          <div key={msg.id} className="group">
            <div className="flex items-baseline gap-2 mb-1">
              <span className={`text-xs font-bold ${msg.user === 'Sistema' ? 'text-yellow-500' : 'text-blue-400'}`}>
                {msg.user}
              </span>
              <span className="text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="bg-gray-800/80 rounded-tr-lg rounded-br-lg rounded-bl-lg p-2 border-l-2 border-white/10">
              <p className="text-gray-200 text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 text-xs italic">No hay mensajes en la mesa...</p>
          </div>
        )}
      </div>

      {/* Input Fijo al final */}
      <div className="p-3 bg-gray-900 shrink-0 border-t border-white/5">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe al crupier..."
            className="flex-1 bg-gray-800 text-white rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-yellow-500/50 placeholder:text-gray-600 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:grayscale text-black rounded-md px-3 py-2 transition-all active:scale-95"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}