import SimpleDeck from "./simpleDeck.js";

test('decks should be made with the right card counts', () => {
  const deck1 = new SimpleDeck("fireballer");
  expect(deck1.drawPile.length).toBe(6);

  const deck2 = new SimpleDeck("empty");
  expect(deck2.drawPile.length).toBe(0);
});

test('modifying a card should only change that card (not others of the same name)', () => {
  let deck = new SimpleDeck("fireballer");
  deck.drawPile[0].customization["overcharged"] = true;

  let ocCount = deck.drawPile.reduce((count, card) => count + (card.customization.overcharged === true ? 1 : 0), 0);
  expect(ocCount).toBe(1);
});

test('drawing decreases drawPile size + increases hand size', () => {
  let deck = new SimpleDeck("fireballer");
  deck.draw(2);

  expect(deck.drawPile.length).toBe(4);
  expect(deck.hand.length).toBe(2);
});

test('discarding decreases hand size and increases graveyard size', () => {
  let deck = new SimpleDeck("fireballer");
  deck.draw(3);
  deck.discard(2, [0,2]);

  expect(deck.hand.length).toBe(1);
  expect(deck.graveyard.length).toBe(2);
});

test('drawing from a deck which doesn\'t have enough cards works okay', () => {
  const deck = new SimpleDeck("empty");
  deck.draw(3);

  expect(deck.hand.length).toBe(0);
  expect(deck.drawPile.length).toBe(0);
  expect(deck.graveyard.length).toBe(0);
});

test('drawing from a deck which would usually have enough cards reshuffles', () => {
  let deck = new SimpleDeck("fireballer");
  deck.draw(4);
  deck.discard(3, [0,1,2]);
  deck.draw(3);

  expect(deck.hand.length).toBe(4);
  expect(deck.drawPile.length).toBe(2);
  expect(deck.graveyard.length).toBe(0);
});

test('energy of cards is gettable', () => {
  let deck = new SimpleDeck("fireballer");
  expect(deck.drawPile[0].getEnergy()).not.toBe(undefined);
});
