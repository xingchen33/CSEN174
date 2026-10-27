import Player from "./player.js"
import CardDeck from "./simpleDeck.js"

test('with an empty main attack, only statements should be playable', () => {
  const deck = new CardDeck("fireballer");
  const player = new Player(100, 5, deck);

  player.damage(20);
  expect(player.health).toBe(80);
  player.heal(15);
  expect(player.health).toBe(95);
});
