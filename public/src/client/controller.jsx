// socket.js
import { io } from 'socket.io-client';

// ⚠️ Si estás en el mismo equipo usa localhost
// ⚠️ Si usas otro dispositivo en la red, usa la IP de tu PC (ej: 192.168.1.10)
const URL = 'http://localhost:3000';

export const socket = io(URL, {
  autoConnect: false, // puedes dejarlo así si quieres controlar la conexión
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

// 🔌 Conectar manualmente
export const conectarSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

// 🔌 Desconectar
export const desconectarSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// 📡 Eventos de conexión
socket.on('connect', () => {
  console.log('✅ Conectado al servidor:', socket.id);
});

socket.on('disconnect', () => {
  console.log('❌ Desconectado del servidor');
});

// 📩 Evento de prueba desde el server
socket.on('mi_evento', (data) => {
  console.log('🔥 Dato recibido:', data);
});

// 📊 Estadísticas
socket.on('statsUpdate', (stats) => {
  console.log('📊 Estadísticas actualizadas:', stats);

  // ⚠️ Si usas React o algo similar, aquí llamas a tu setter
  // setStats(stats);
});

// 💬 Chat
socket.on('chatMessage', (msg) => {
  console.log('💬 Chat:', msg);
});

// 🎮 Estado del juego
socket.on('gameState', (state) => {
  console.log('🎮 Estado del juego:', state);
});

// ⏱️ Timer
socket.on('timer', (time) => {
  console.log('⏱️ Tiempo restante:', time);
});

// 🎲 Nueva apuesta
socket.on('newBet', (bet) => {
  console.log('🎲 Nueva apuesta:', bet);
});

// 👥 Lista de jugadores
socket.on('playerList', (players) => {
  console.log('👥 Jugadores:', players);
});

// ❌ Errores
socket.on('errorMsg', (msg) => {
  console.error('⚠️ Error:', msg);
});

// 📤 Enviar evento genérico
export const enviarDato = (dato) => {
  socket.emit('mi_evento', dato);
};

// 🎮 Unirse al juego
export const unirse = (username) => {
  socket.emit('join', username);
};

// 🎲 Apostar
export const apostar = (type, amount) => {
  socket.emit('placeBet', { type, amount });
};

// 💬 Enviar mensaje
export const enviarMensaje = (mensaje) => {
  socket.emit('chatMessage', mensaje);
};