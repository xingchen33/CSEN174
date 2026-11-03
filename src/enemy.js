import Entity from "./entity.js"

export default class Enemy extends Entity {
  constructor (maxHealth, moves, name, image="./assets/missing.jpg", customization={}){
    super(maxHealth, image, customization);

    this.moves = moves;
    this.name = name;

    this.getNextMove();
  }

  getNextMove(n=-1) {
    if (this.isDead()) {
      this.nextMove = null;
      return;
    }

    if (n < 0) {
      // For now: purely random
      this.nextMove = this.moves[Math.floor(Math.random() * this.moves.length)];
      return;
    }

    this.nextMove = this.moves[n];
  }

  // TODO you probably need to redo this
  getAttackDamage() {
    let move = this.nextMove;
    if (move.damage) {
      let base = move.damage;
      if (this.statuses["reckless"]) {
        base *= 2;
      }

      return base;
    }

    return null;
  }

  // TODO you probably need to redo this
  passTurn() {
    this.statusDecay();
    this.getNextMove();
  }
}

export const ENEMYLIST = {
  "pick": (name) => {
    const enemy = structuredClone(ENEMYLIST.enemies[name]);
    Object.setPrototypeOf(enemy, Enemy.prototype);
    return enemy;
  },
  "pickRandom": () => {
    var keys = Object.keys(ENEMYLIST.cards);
    const enemy = ENEMYLIST.cards[keys[keys.length * Math.random() << 0]];
    Object.setPrototypeOf(enemy, Enemy.prototype);
    return card;
  },
  // Make sure you add all your enemies to this list!
  "enemies": {
    "Dummy": new Enemy(100, [{"damage": 20}, {"damage": 30}], "Dummy"),
  }
}
