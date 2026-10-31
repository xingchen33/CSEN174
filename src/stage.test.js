import Stage from './stage.js';
import Player from './player.js';
import Enemy from './enemy.js';
import CardDeck from './cardDeck.js';
import SimpleDeck from './simpleDeck.js';
import { CARDLIST } from "./card.js";



test("initializing the stage works", () => {
    card_deck = new CardDeck("fireballer");
    logic_deck = new SimpleDeck("fireballer");
    player = new Player(100, 5, card_deck, logic_deck);
    enemy1 = new Enemy(100, [{"damage": 20}, {"damage": 30}], "Dummy", "./assets/missing.jpg", {})
    enemies = [enemy1];
    curr_round = 1;
    curr_turn = player;
    stage = new Stage(card_deck, player, enemies, curr_round, curr_turn);
    expect(stage.player).toBe(player);
    expect(stage.enemies_list).toEqual(enemies);
    expect(stage.curr_round).toBe(curr_round);
    expect(stage.curr_turn).toBe(curr_turn);
})

test("adding an enemy works", () =>{
    card_deck = new CardDeck("fireballer");
    logic_deck = new SimpleDeck("fireballer");
    player = new Player(100, 5, card_deck, logic_deck);
    enemy1 = new Enemy(100, [{"fireball": 20}, {"fireball": 30}], "E1", "./assets/missing.jpg", {})
    enemies = [enemy1];
    curr_round = 1;
    curr_turn = player;
    stage = new Stage(card_deck, player, enemies, curr_round, curr_turn);
    enemy2 = new Enemy(50, [{"fireball": 10}], "E2", "./assets/missing.jpg", {})
    stage.addEnemy(enemy2);
    expect(stage.enemies_list).toContain(enemy2);
    expect(stage.enemies_list.length).toBe(2);
})

test("attacking and changing turns updates the metadata" , () => {
    
    card_deck = new CardDeck("fireballer");
    logic_deck = new SimpleDeck("fireballer");
    player = new Player(100, 5, card_deck, logic_deck);
    enemy1 = new Enemy(100, [{"damage": 20}, {"damage": 30}], "Dummy", "./assets/missing.jpg", {})
    enemies = [enemy1];
    curr_round = 1;
    curr_turn = player;
    stage = new Stage(card_deck, player, enemies, curr_round, curr_turn);
    const fireball = CARDLIST.pick("Fireball");
    player.currentMove.push({fireball,target: enemy1});    
    player.useMove();
    stage.damage_dealt += 100 - enemy1.health;
    expect(enemy1.health).toBe(enemy1.maxHealth - fireball.damage);
    expect(stage.damage_dealt).toBe(fireball.damage);
    expect(stage.enemies_destroyed).toBe(0);
    stage.nextTurn(player, enemy1);
    expect(stage.curr_turn).toBe(enemy1);

})

