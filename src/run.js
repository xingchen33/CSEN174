// Keeps track of all the stages and certain metadata(i.e. damage dealt across all stages)
import Stage from "./stage.js"
import Player, { ITEMLIST } from "./player.js"
import { CARDLIST } from "./card.js";
import SimpleDeck from "./simpleDeck.js"
import CardDeck from "./cardDeck.js"
import { ENEMYLIST } from "./enemy.js"

export default class Run {
  /**
   * @param {string} logicPreset - Which logic deck to use
   * @param {string} cardPreset - Which card deck to use
   * @param {integer} difficulty - Which difficulty setting to use
   */
  constructor(logicPreset, cardPreset, difficulty) {
    // In case we want to display this info anywhere
    this.presets = { logic: logicPreset, card: cardPreset };

    // You can go crazy here, but I'm thinking this'll work as a simple health mult (/2 so 2 diff is normal),
    // with maybe some enemy spawning changes as a stretch
    this.difficulty = difficulty;

    this.playerInfo = {
      logicDeck: new SimpleDeck(logicPreset),
      cardDeck: new CardDeck(cardPreset),
      maxHealth: 50,
      maxEnergy: 3,
      items: {},
    };

    // TODO fill out this with any stats you'd like
    this.stats = {
      damageDone: 0,
      damageTaken: 0,
      cardsPlayed: 0,
    };

    this.stages = [];
  }

  generateRandomRewards(enemies) {
    // Reward guidelines: one reward per enemy, chance of item or card
    let rewards = [];
    for (const _ of enemies) {
      let reward;
      // ASK this probably should change, just prototyping here
      if (Math.random() > 0.8) {
        reward = {"item": ITEMLIST.pickRandom()};
      }
      else {
        reward = {"card": CARDLIST.pickRandom()};
      }

      rewards.push(reward);
    }

    return rewards;
  }

  // TEST
  createNextStage() {
    let player = new Player(
      this.playerInfo.maxHealth,
      this.playerInfo.maxEnergy,
      this.playerInfo.cardDeck,
      this.playerInfo.logicDeck,
      this.playerInfo.items,
    );

    // ASK any ideas about how enemy generation should work?
    let enemyCount = (Math.random() * this.difficulty) + this.stages.length / 2;
    enemyCount = Math.max(1, Math.min(5, Math.floor(enemyCount)));
    let enemies = [];
    for (let i = 0; i < enemyCount; i++) {
      enemies.push(ENEMYLIST.pick("Slime"));
    }

    let rewards = this.generateRandomRewards(enemies);

    let nextStage = new Stage(player, enemies, rewards);
    this.stages.push(nextStage);
    return nextStage;
  }

  // Mostly(?) for debug purposes
  setNextStage(stage) {
    this.stages.push(stage);
  }

  // TEST
  updateStats(increment, replace = {}) {
    for (const prop in increment) {
      if (prop in this.stats) {
        this.stats[prop] += increment[prop];
      }
      else {
        this.stats[prop] = increment[prop];
      }
    }

    for (const prop in replace) {
        this.stats[prop] = replace[prop];
    }
  }

  getCurrentStage() {
    if (this.stages.length == 0) {
      return null;
    }

    return this.stages[this.stages.length - 1];
  }

  nextTurn() {
    let stage = this.getCurrentStage();
    let result = stage.nextTurn();
    if (result == "win") {
      let rewards = this.getCurrentStage().rewards;
      return rewards;
    } else if (result == "loss") {
      return "loss";
    }
  }
}
