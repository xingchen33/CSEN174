import Run from "./run.js";
import Stage from "./stage.js";
import Player from './player.js';
import CardDeck from './cardDeck.js';
import Enemy from './enemy.js';
import SimpleDeck from './simpleDeck.js';

test('adding a stage works as expected', () => {
    const run = new Run([]);
    card_deck = new CardDeck("fireballer");
    logic_deck = new SimpleDeck("fireballer");
    player = new Player(100, 5, card_deck, logic_deck);
    enemy1 = new Enemy(100, [{"fireball": 20}, {"fireball": 30}], "E1", "./assets/missing.jpg", {})
    enemies = [enemy1];
    curr_round = 1;
    curr_turn = player;
    stage = new Stage(card_deck, player, enemies, curr_round, curr_turn);
    run.addStage(stage);
    expect(run.stages_list).toContain(stage);
    expect(run.stages_list.length).toBe(1);








});