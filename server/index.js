const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { playBaccarat } = require("./gameLogic");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});


let usersOnline = [];

let gameState = {
  status: "betting", // betting, dealing, result
  timer: 15,
  cards: { punto: [], banca: [] },
  winner: null,
  history: []
};

function startGameLoop() {
  // 1. Fase de Apuestas
  gameState.status = "betting";
  gameState.timer = 15;
  gameState.cards = { punto: [], banca: [] };
  gameState.winner = null;
  io.emit("gameState", gameState);

  const interval = setInterval(() => {
    gameState.timer--;
    io.emit("timerUpdate", gameState.timer);

    if (gameState.timer <= 0) {
      clearInterval(interval);
      resolveGame();
    }
  }, 1000);
}

async function resolveGame() {
  gameState.status = "dealing";
  io.emit("statusUpdate", "dealing");

  const result = playBaccarat(); 
  
  const finalPunto = result.cards.player; // Puede tener 2 o 3 cartas
  const finalBanca = result.cards.banker; // Puede tener 2 o 3 cartas

  // Limpiamos cartas actuales para el inicio de la animación
  gameState.cards.punto = [];
  gameState.cards.banca = [];

  // Determinamos el máximo de cartas repartidas para el loop
  const maxCards = Math.max(finalPunto.length, finalBanca.length);

  for (let i = 0; i < maxCards; i++) {
    // Repartir al Punto si tiene carta en esta posición
    if (finalPunto[i]) {
      gameState.cards.punto.push(finalPunto[i]);
      io.emit("cardsUpdate", gameState.cards);
      await new Promise(r => setTimeout(r, 800));
    }
    
    // Repartir a la Banca si tiene carta en esta posición
    if (finalBanca[i]) {
      gameState.cards.banca.push(finalBanca[i]);
      io.emit("cardsUpdate", gameState.cards);
      await new Promise(r => setTimeout(r, 800));
    }
  }

  // Fin del reparto, mostramos resultado
  gameState.status = "result";
  gameState.winner = result.winner;
  gameState.history.unshift({ winner: result.winner, id: Date.now() });
  
  io.emit("gameResult", { 
    winner: gameState.winner, 
    history: gameState.history 
  });

  setTimeout(startGameLoop, 5000);
}

io.on("connection", (socket) => {
  socket.emit("gameState", gameState);
  usersOnline.push(socket.id);
  io.emit("usersOnline", usersOnline.length);  
  
  socket.on("chatMessage", (msg) => {
    io.emit("chatMessage", { user: socket.id.substr(0, 5), message: msg });
  });

  socket.on("disconnect", () => {
    usersOnline = usersOnline.filter((id) => id !== socket.id);
    io.emit("usersOnline", usersOnline.length);

  });
});

startGameLoop();
server.listen(3000, () => console.log("Dealer Baccarat en puerto 3001"));