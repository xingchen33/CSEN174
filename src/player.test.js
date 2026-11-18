import Player from "./player.js";
import SimpleDeck from "./simpleDeck.js";
import CardDeck from "./cardDeck.js";

const target = { damage() {} };

test("damaging/healing works as expected", () => {
  const card_deck = new CardDeck("basic");
  const logic_deck = new SimpleDeck("basic");
  const player = new Player(100, 5, card_deck, logic_deck);

  player.damage(20);
  expect(player.health).toBe(80);
  player.heal(15);
  expect(player.health).toBe(95);
});

test("energy depletes when playing cards", () => {
  const card_deck = new CardDeck("basic");
  const logic_deck = new SimpleDeck("basic");
  const player = new Player(100, 5, card_deck, logic_deck);
  result = player.playCard(0, target);
  expect(result).toBe(true);
  expect(player.energy).toBeLessThan(5);

});

test("energy comes back after passing", () => {
  const card_deck = new CardDeck("basic");
  const logic_deck = new SimpleDeck("basic");
  const player = new Player(100, 5, card_deck, logic_deck);

  player.cardDeck.draw(1);

  player.playCard(0, target);
  player.passTurn();

  expect(player.energy).toBe(5);
});

test("playing a card removes it from your hand", () => {
  const card_deck = new CardDeck("basic");
  const logic_deck = new SimpleDeck("basic");
  const player = new Player(100, 5, card_deck, logic_deck);
  const initialHandSize = player.cardDeck.hand.length;

  const result = player.playCard(0, target);

  expect(result).toBe(true);
  expect(player.cardDeck.hand.length).toBe(initialHandSize - 1);
});

test("failing to play a card does not remove it from your hand", () => {
  const card_deck = new CardDeck("basic");
  const logic_deck = new SimpleDeck("basic");
  const player = new Player(100, 5, card_deck, logic_deck);

  player.cardDeck.draw(6);
  for (let i = 0; i < 6; i++) {
    player.playCard(0);
  }

  expect(player.cardDeck.hand.length).toBeGreaterThan(0);
});

//testing evaluate card
test('evaluateCard works as expected', () => {
  const card_deck = new CardDeck("basic");
  const logic_deck = new SimpleDeck("basic");
  const player = new Player(100, 5, card_deck, logic_deck);
  const card1 = player.cardDeck.hand[0];
  const locations = player.getValidPositions("statement", player.currentMove, []);
  player.evaluateCard(card1, locations[0]);
  expect(player.energy).toBeLessThan(5);
  const card_deck_2 = new CardDeck("basic");
  const logic_deck_2 = new SimpleDeck("basic");
  const player2 = new Player(100, 10, card_deck_2, logic_deck_2);
  const card2 = player2.logicDeck.hand[0];
  const locations_2 = player2.getValidPositions("ritual", player2.currentMove, indexset = []);
  player2.evaluateCard(card2, locations_2[0]);
  expect(player2.energy).toBe(10);
});

