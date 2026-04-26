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
let currentBets = [];

let gameState = {
  status: "betting",
  timer: 15,
  cards: { punto: [], banca: [] },
  winner: null,
  history: []
};

function startGameLoop() {
  gameState.status = "betting";
  gameState.timer = 15;
  gameState.cards = { punto: [], banca: [] };
  gameState.winner = null;
  currentBets = []; 
  
  io.emit("gameState", gameState);
  console.log("Nueva ronda: Esperando apuestas...");

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
  
  const finalPunto = result.cards.player;
  const finalBanca = result.cards.banker;

  gameState.cards.punto = [];
  gameState.cards.banca = [];

  const maxCards = Math.max(finalPunto.length, finalBanca.length);

  for (let i = 0; i < maxCards; i++) {
    if (finalPunto[i]) {
      gameState.cards.punto.push(finalPunto[i]);
      io.emit("cardsUpdate", gameState.cards);
      await new Promise(r => setTimeout(r, 800));
    }
    
    if (finalBanca[i]) {
      gameState.cards.banca.push(finalBanca[i]);
      io.emit("cardsUpdate", gameState.cards);
      await new Promise(r => setTimeout(r, 800));
    }
  }

  gameState.status = "result";
  gameState.winner = result.winner;
  gameState.history.unshift({ winner: result.winner, id: Date.now() });
  
  io.emit("gameResult", { 
    winner: gameState.winner, 
    history: gameState.history 
  });

  processPayouts(result.winner);

  // Esperar 5 segundos antes de la siguiente ronda
  setTimeout(() => {
    startGameLoop();
  }, 5000);
}

function processPayouts(winner) {
  currentBets.forEach(bet => {
    let payout = 0;
    let isWinner = bet.betType === winner;
    let isRefund = false;

    if (isWinner) {
      // Caso: El usuario acertó su apuesta
      if (winner === "Punto") payout = bet.amount * 2;       // Paga 1:1 + devolución
      if (winner === "Banca") payout = bet.amount * 1.95;    // Paga 0.95:1 + devolución
      if (winner === "Tie") payout = bet.amount * 9;         // Paga 8:1 + devolución
    } 
    else if (winner === "Tie" && (bet.betType === "Punto" || bet.betType === "Banca")) {
      payout = bet.amount; 
      isRefund = true;
    }

    // Enviamos el resultado al socket correspondiente
    io.to(bet.socketId).emit("betResult", {
      won: isWinner,
      refund: isRefund,
      payout: payout,
      betType: bet.betType,
      amount: bet.amount,
      winner: winner 
    });
  });
}

io.on("connection", (socket) => {
  socket.emit("gameState", gameState);
  usersOnline.push(socket.id);
  io.emit("usersOnline", usersOnline.length);  
  
  socket.on("placeBet", (data) => {
    if (gameState.status === "betting") {
      currentBets.push({
        socketId: socket.id,
        amount: data.amount,
        betType: data.betType
      });
      console.log(`Apuesta recibida: ${socket.id} apostó ${data.amount} a ${data.betType}`);
      socket.emit("betAccepted", { status: "success", bet: data });
    } else {
      socket.emit("betError", { message: "Apuestas cerradas" });
    }
  });

  socket.on("chatMessage", (msg) => {
    io.emit("chatMessage", { user: socket.id.substr(0, 5), message: msg });
  });

  socket.on("disconnect", () => {
    usersOnline = usersOnline.filter((id) => id !== socket.id);
    io.emit("usersOnline", usersOnline.length);
  });
});

startGameLoop();

server.listen(3000, () => console.log("Servidor Baccarat corriendo en puerto 3000"));