import Player from "./player.js"
import SimpleDeck from "./simpleDeck.js";
import CardDeck from "./cardDeck.js";

test('damaging/healing works as expected', () => {
  const card_deck = new CardDeck("fireballer");
  const logic_deck = new SimpleDeck("fireballer")
  const player = new Player(100, 5, card_deck, logic_deck);

  player.damage(20);
  expect(player.health).toBe(80);
  player.heal(15);
  expect(player.health).toBe(95);
});

test('energy depletes when playing cards', () => {
  const card_deck = new CardDeck("fireballer");
  const logic_deck = new SimpleDeck("fireballer")
  const player = new Player(100, 5, card_deck, logic_deck);

  player.cardDeck.draw(1);
  player.playCard(0);

  expect(player.energy).toBeLessThan(5);
});

test('energy comes back after passing', () => {
  const card_deck = new CardDeck("fireballer");
  const logic_deck = new SimpleDeck("fireballer")
  const player = new Player(100, 5, card_deck, logic_deck);

  player.cardDeck.draw(1);
  player.playCard(0);
  player.passTurn();

  expect(player.energy).toBe(5);
});

test('playing a card removes it from your hand', () => {
  const card_deck = new CardDeck("fireballer");
  const logic_deck = new SimpleDeck("fireballer")
  const player = new Player(100, 5, card_deck, logic_deck);

  player.cardDeck.draw(3);
  player.playCard(0);

  expect(player.cardDeck.hand.length).toBe(2);
});

test('failing to play a card does not remove it from your hand', () => {
  const card_deck = new CardDeck("fireballer");
  const logic_deck = new SimpleDeck("fireballer")
  const player = new Player(100, 5, card_deck, logic_deck);

  player.cardDeck.draw(6);
  for (let i = 0; i < 6; i++) {
    player.playCard(0);
  }

  expect(player.cardDeck.hand.length).toBeGreaterThan(0);
});


