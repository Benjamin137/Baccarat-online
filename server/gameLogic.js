const createDeck = () => {
  const suits = ["hearts", "diamonds", "clubs", "spades"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  let deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ value, suit });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
};

const getCardValue = (card) => {
  if (["10", "J", "Q", "K"].includes(card.value)) return 0;
  if (card.value === "A") return 1;
  return parseInt(card.value);
};

const calculateScore = (cards) => {
  return cards.reduce((sum, card) => sum + getCardValue(card), 0) % 10;
};

const playBaccarat = () => {
  const deck = createDeck();
  let player = [deck.pop(), deck.pop()];
  let banker = [deck.pop(), deck.pop()];

  let pScore = calculateScore(player);
  let bScore = calculateScore(banker);

  // Regla de Naturales
  if (pScore < 8 && bScore < 8) {
    // Regla del Jugador
    let pTerceraCard = null;
    if (pScore <= 5) {
      pTerceraCard = deck.pop();
      player.push(pTerceraCard);
      pScore = calculateScore(player);
    }

    // Regla de la Banca (Depende de si el jugador pidió y qué pidió)
    if (pTerceraCard === null) {
      if (bScore <= 5) banker.push(deck.pop());
    } else {
      const v = pTerceraCard.numericValue;
      if (bScore <= 2) banker.push(deck.pop());
      else if (bScore === 3 && v !== 8) banker.push(deck.pop());
      else if (bScore === 4 && [2,3,4,5,6,7].includes(v)) banker.push(deck.pop());
      else if (bScore === 5 && [4,5,6,7].includes(v)) banker.push(deck.pop());
      else if (bScore === 6 && [6,7].includes(v)) banker.push(deck.pop());
    }
    bScore = calculateScore(banker);
  }

  let winner = "Tie";
  if (pScore > bScore) winner = "Punto";
  else if (bScore > pScore) winner = "Banca";

  return { cards: { player, banker }, winner };
};

module.exports = { playBaccarat };