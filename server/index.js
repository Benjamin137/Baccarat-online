const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const BaccaratGame = require('./gameLogic');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
let history = []; // Guardará los resultados: ['Banca', 'Jugador', 'Empate', ...]
// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

const game = new BaccaratGame();
let players = {};
let bets = {}; // Formato: { socketId: { type: 'Jugador', amount: 100 } }
let gameState = 'WAITING'; // WAITING, PLAYING, RESULTS
let countdown = 15;

// Ciclo principal del juego
setInterval(() => {
    if (gameState === 'WAITING') {
        countdown--;
        io.emit('timer', countdown);

        if (countdown <= 0) {
            gameState = 'PLAYING';
            io.emit('gameState', { state: gameState, message: '¡No más apuestas!' });

            // Jugar la ronda y obtener resultados
            const result = game.playRound();

            setTimeout(() => {
                gameState = 'RESULTS';
                history.push(result.winner); // GUARDAR EN EL HISTORIAL
                if (history.length > 20) history.shift(); // Mantener solo los últimos 20

                io.emit('gameState', {
                    state: gameState,
                    result,
                    bets,
                    history // ENVIAR EL HISTORIAL ACTUALIZADO
                });

                // Reiniciar para la siguiente ronda
                setTimeout(() => {
                    bets = {};
                    countdown = 15;
                    gameState = 'WAITING';
                    io.emit('gameState', { state: gameState, message: 'Hagan sus apuestas' });
                }, 8000); // 8 segundos para ver resultados
            }, 2000); // 2 segundos de "suspenso" repartiendo cartas
        }
    }
}, 1000);

// Función auxiliar para calcular estadísticas de apuestas
function getBettingStats() {
    const totalPlayers = Object.keys(players).length;
    if (totalPlayers === 0) return { playerPct: 0, bankerPct: 0 };

    let playerBets = 0;
    let bankerBets = 0;

    Object.values(bets).forEach(bet => {
        if (bet.type === 'Jugador') playerBets++;
        if (bet.type === 'Banca') bankerBets++;
    });

    return {
        playerPct: Math.round((playerBets / totalPlayers) * 100),
        bankerPct: Math.round((bankerBets / totalPlayers) * 100)
    };
}

// Manejo de conexiones de clientes
io.on('connection', (socket) => {
    console.log('Nuevo jugador conectado:', socket.id);

    // Registro del jugador
    socket.on('join', (username) => {
        players[socket.id] = { username, balance: 1000 };
        socket.emit('joined', players[socket.id]);
        io.emit('playerList', Object.values(players));
        io.emit('statsUpdate', getBettingStats());
    });

    // NUEVO: Manejo del chat de texto
    socket.on('chatMessage', (msg) => {
        const player = players[socket.id];
        if (player && msg.trim() !== '') {
            io.emit('chatMessage', { user: player.username, message: msg });
        }
    });

    // ACTUALIZADO: Manejo de apuestas con validación
    // Actualizar el manejo de 'placeBet' para emitir estadísticas nuevas
    // ACTUALIZADO: Manejo de apuestas con validación
    socket.on('placeBet', (betData) => {
        // 1. Obtener la información del jugador que está haciendo la apuesta
        const player = players[socket.id];

        // 2. Si por alguna razón el jugador no existe, salimos
        if (!player) return;

        // 3. Validar que estemos en tiempo de apuestas
        if (gameState !== 'WAITING') {
            socket.emit('errorMsg', 'No se pueden hacer apuestas en este momento.');
            return;
        }

        // 4. Validar que la apuesta sea un número válido
        if (typeof betData.amount !== 'number' || betData.amount <= 0) {
            socket.emit('errorMsg', 'Cantidad de apuesta inválida.');
            return;
        }

        // 5. Validar que el jugador tenga saldo suficiente
        if (player.balance >= betData.amount) {
            player.balance -= betData.amount; // Descontar el dinero

            // Guardar la apuesta
            bets[socket.id] = { username: player.username, type: betData.type, amount: betData.amount };

            // Actualizar a los clientes
            socket.emit('updateBalance', player.balance);
            io.emit('newBet', bets[socket.id]);

            // Actualizar estadísticas de porcentajes
            io.emit('statsUpdate', getBettingStats());
        } else {
            socket.emit('errorMsg', 'Saldo insuficiente.');
        }
    });
    // Desconexión
    socket.on('disconnect', () => {
        delete players[socket.id];
        delete bets[socket.id];
        io.emit('playerList', Object.values(players));
        console.log('Jugador desconectado:', socket.id);
        io.emit('statsUpdate', getBettingStats());
    });
});

// ... (resto del código igual)

// Escuchar en 0.0.0.0 permite conexiones desde la red local
const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Para acceder desde otro dispositivo usa la IP de tu PC, ej: http://192.168.x.x:${PORT}`);
});