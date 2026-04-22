import { useState } from "react";
import { Send } from "lucide-react";

interface Message {
  id: number;
  user: string;
  text: string;
  timestamp: Date;
}

interface ChatProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
}

export function Chat({ messages, onSendMessage }: ChatProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 h-full flex flex-col">
      <h3 className="text-white text-lg mb-3">Chat</h3>
      <div className="flex-1 overflow-y-auto mb-3 space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-gray-800 rounded p-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-yellow-400 text-sm font-bold">{msg.user}</span>
              <span className="text-gray-500 text-xs">
                {msg.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <p className="text-white text-sm">{msg.text}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-gray-500 text-sm">No hay mensajes aún</p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-gray-800 text-white rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 flex items-center gap-2"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
