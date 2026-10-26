import Player from "./player.js"
import Deck from "./deck.js"

test('damaging/healing works as expected', () => {
  const deck = new Deck("fireballer");
  const player = new Player(100, 5, deck);

  player.damage(20);
  expect(player.health).toBe(80);
  player.heal(15);
  expect(player.health).toBe(95);
});

test('energy depletes when playing cards', () => {
  const deck = new Deck("fireballer");
  const player = new Player(100, 5, deck);

  player.deck.draw(1);
  player.playCard(0);

  expect(player.energy).toBeLessThan(5);
});

test('energy comes back after passing', () => {
  const deck = new Deck("fireballer");
  const player = new Player(100, 5, deck);

  player.deck.draw(1);
  player.playCard(0);
  player.passTurn();

  expect(player.energy).toBe(5);
});

test('playing a card removes it from your hand', () => {
  const deck = new Deck("fireballer");
  const player = new Player(100, 5, deck);

  player.deck.draw(3);
  player.playCard(0);

  expect(player.deck.hand.length).toBe(2);
});

test('failing to play a card does not remove it from your hand', () => {
  const deck = new Deck("fireballer");
  const player = new Player(100, 5, deck);

  player.deck.draw(6);
  for (let i = 0; i < 6; i++) {
    player.playCard(0);
  }

  expect(player.deck.hand.length).toBeGreaterThan(0);
});
