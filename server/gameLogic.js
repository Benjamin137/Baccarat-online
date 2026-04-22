// Valores de las cartas en Baccarat
const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function getCardValue(val) {
    if (['10', 'J', 'Q', 'K'].includes(val)) return 0;
    if (val === 'A') return 1;
    return parseInt(val);
}

class BaccaratGame {
    constructor() {
        this.deck = [];
        this.playerHand = [];
        this.bankerHand = [];
        this.createDeck();
    }

    createDeck() {
        this.deck = [];
        for (let suit of SUITS) {
            for (let value of VALUES) {
                this.deck.push({ suit, value, numericValue: getCardValue(value) });
            }
        }
        // Mezclar el mazo (Fisher-Yates)
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    calculateScore(hand) {
        let sum = hand.reduce((acc, card) => acc + card.numericValue, 0);
        return sum % 10; // En Baccarat solo importa el último dígito
    }

    playRound() {
        if (this.deck.length < 10) this.createDeck(); // Barajar si quedan pocas cartas

        // Repartir 2 cartas a cada uno
        this.playerHand = [this.deck.pop(), this.deck.pop()];
        this.bankerHand = [this.deck.pop(), this.deck.pop()];

        let playerScore = this.calculateScore(this.playerHand);
        let bankerScore = this.calculateScore(this.bankerHand);

        // Regla simplificada de la tercera carta: si el jugador tiene <= 5, pide carta
        if (playerScore <= 5) {
            this.playerHand.push(this.deck.pop());
            playerScore = this.calculateScore(this.playerHand);
        }

        // Regla simplificada para la banca: si tiene <= 5, pide carta
        if (bankerScore <= 5) {
            this.bankerHand.push(this.deck.pop());
            bankerScore = this.calculateScore(this.bankerHand);
        }

        // Determinar ganador
        let result = 'Empate';
        if (playerScore > bankerScore) result = 'Jugador';
        else if (bankerScore > playerScore) result = 'Banca';

        return {
            playerHand: this.playerHand,
            bankerHand: this.bankerHand,
            playerScore,
            bankerScore,
            winner: result
        };
    }
}

module.exports = BaccaratGame;