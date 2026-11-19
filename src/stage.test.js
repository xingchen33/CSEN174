import Stage from "./stage.js";
import Player from "./player.js";
import Enemy from "./enemy.js";
import CardDeck from "./cardDeck.js";
import SimpleDeck from "./simpleDeck.js";
import { CARDLIST } from "./card.js";

test("initializing the stage works", () => {
  card_deck = new CardDeck("basic");
  logic_deck = new SimpleDeck("basic");
  player = new Player(100, 5, card_deck, logic_deck);
  enemy1 = new Enemy(
    100,
    [{ damage: 20 }, { damage: 30 }],
    "Dummy",
    "./assets/missing.jpg",
    {},
  );
  enemies = [enemy1];
  curr_round = 1;
  curr_turn = player;
  stage = new Stage(player, enemies, []);
  expect(stage.player).toBe(player);
  expect(stage.enemies).toEqual(enemies);
  expect(stage.turnCount).toBe(0);
  expect(stage.turn).toBe("player");
});

test("adding an enemy works", () => {
  card_deck = new CardDeck("basic");
  logic_deck = new SimpleDeck("basic");
  player = new Player(100, 5, card_deck, logic_deck);
  enemy1 = new Enemy(
    100,
    [{ fireball: 20 }, { fireball: 30 }],
    "E1",
    "./assets/missing.jpg",
    {},
  );
  enemies = [enemy1];
  curr_round = 1;
  curr_turn = player;
  stage = new Stage(player, enemies, []);
  enemy2 = new Enemy(50, [{ fireball: 10 }], "E2", "./assets/missing.jpg", {});
  stage.addEnemy(enemy2);
  expect(stage.enemies).toContain(enemy2);
  expect(stage.enemies.length).toBe(2);
});

test("attacking and changing turns updates the metadata", () => {
  card_deck = new CardDeck("basic");
  logic_deck = new SimpleDeck("basic");
  player = new Player(100, 5, card_deck, logic_deck);
  enemy1 = new Enemy(
    100,
    [{ damage: 20 }, { damage: 30 }],
    "Dummy",
    "./assets/missing.jpg",
    {},
  );
  enemies = [enemy1];
  curr_round = 1;
  curr_turn = player;
  stage = new Stage(player, enemies, []);
  const fireball = CARDLIST.pick("Fireball");
  player.currentMove.push({type: fireball.type,effects: fireball.effects ,target: enemy1 });
  stage.passTurn();
  stage.damage_dealt += 100 - enemy1.health;
  expect(enemy1.health).toBe(enemy1.maxHealth - fireball.effects.damage);
  expect(stage.stats.damageDone).toBe(fireball.effects.damage);
  expect(stage.enemies.length).toBe(1);
  stage.nextTurn(player, enemy1);
  expect(stage.turn).toBe(enemy1);
});
