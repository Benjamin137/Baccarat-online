const socket = io();

// Elementos del DOM
const loginScreen = document.getElementById('login-screen');
const gameScreen = document.getElementById('game-screen');
const statusMsg = document.getElementById('status-msg');
const timerEl = document.getElementById('timer');
const myNameEl = document.getElementById('myName');
const myBalanceEl = document.getElementById('myBalance');
const betsList = document.getElementById('bets-list');

function joinGame() {
    const username = document.getElementById('username').value;
    if (username.trim() === '') return alert('Ingresa un nombre');

    socket.emit('join', username);
    loginScreen.style.display = 'none';
    gameScreen.style.display = 'grid';
}
// ... (código superior igual)

// ACTUALIZADO: Leer cantidad del input
function placeBet(type) {
    const amountInput = document.getElementById('betAmount').value;
    const amount = parseInt(amountInput);

    if (isNaN(amount) || amount <= 0) {
        return alert('Por favor, ingresa una cantidad válida mayor a 0.');
    }

    socket.emit('placeBet', { type, amount: amount });
}

// ... (funciones de renderizado y eventos de socket iguales)

// NUEVO: Funciones de Chat
function sendMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (msg !== '') {
        socket.emit('chatMessage', msg);
        input.value = ''; // Limpiar el input
    }
}

// Permitir enviar mensaje con la tecla Enter
document.getElementById('chat-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Recibir mensaje de chat
socket.on('chatMessage', (data) => {
    const chatBox = document.getElementById('chat-messages');
    chatBox.innerHTML += `<div><strong>${data.user}:</strong> ${data.message}</div>`;
    // Hacer scroll automático hacia abajo
    chatBox.scrollTop = chatBox.scrollHeight;
});

// ... (resto de los socket.on iguales)
function updateRoadmap(history) {
    const container = document.getElementById('roadmap');
    container.innerHTML = '';

    history.forEach(res => {
        const dot = document.createElement('div');
        dot.className = `history-dot dot-${res.toLowerCase()}`;
        dot.innerText = res[0]; // 'J', 'B' o 'E'
        container.appendChild(dot);
    });
}
// Renderizar cartas
function renderCards(containerId, cards) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    cards.forEach(card => {
        const div = document.createElement('div');
        div.className = `card ${['♥', '♦'].includes(card.suit) ? 'red' : ''}`;
        div.innerText = `${card.value}${card.suit}`;
        container.appendChild(div);
    });
}

// --- Eventos de Socket.io ---
socket.on('statsUpdate', (stats) => {
    document.getElementById('bar-player').style.width = stats.playerPct + '%';
    document.getElementById('txt-player-pct').innerText = stats.playerPct + '%';

    document.getElementById('bar-banker').style.width = stats.bankerPct + '%';
    document.getElementById('txt-banker-pct').innerText = stats.bankerPct + '%';
});

socket.on('joined', (player) => {
    myNameEl.innerText = player.username;
    myBalanceEl.innerText = player.balance;
});

socket.on('updateBalance', (balance) => {
    myBalanceEl.innerText = balance;
});

socket.on('timer', (time) => {
    timerEl.innerText = time;
});

socket.on('playerList', (players) => {
    const list = document.getElementById('players-list');
    list.innerHTML = '';
    players.forEach(p => {
        list.innerHTML += `<li>${p.username} - $${p.balance}</li>`;
    });
});


socket.on('newBet', (bet) => {
    betsList.innerHTML += `<li>${bet.username} apostó $${bet.amount} a ${bet.type}</li>`;
});

socket.on('gameState', (data) => {
    statusMsg.innerText = data.message || `Estado: ${data.state}`;

    if (data.state === 'WAITING') {
        // Limpiar mesa
        document.getElementById('player-cards').innerHTML = '';
        document.getElementById('banker-cards').innerHTML = '';
        document.getElementById('player-score').innerText = '0';
        document.getElementById('banker-score').innerText = '0';
        betsList.innerHTML = '';
    }
    else if (data.state === 'RESULTS') {
        const { result } = data;

        // Mostrar cartas y puntajes
        renderCards('player-cards', result.playerHand);
        renderCards('banker-cards', result.bankerHand);
        document.getElementById('player-score').innerText = result.playerScore;
        document.getElementById('banker-score').innerText = result.bankerScore;

        statusMsg.innerText = `¡Gana ${result.winner}!`;
    }
});
socket.on('gameState', (data) => {
    // ... (lógica anterior de repartir cartas y mensajes)

    if (data.state === 'RESULTS') {
        // ... (renderizar cartas)
        if (data.history) {
            updateRoadmap(data.history);
        }
    }

    if (data.state === 'WAITING') {
        // Al empezar nueva ronda, las estadísticas de apuestas se limpian en el servidor
        // pero podemos resetear las barras visualmente si queremos
    }
});
socket.on('errorMsg', (msg) => {
    alert(msg);
});