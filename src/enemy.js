import Entity from "./entity.js"

const slimeImage = new URL("../assets/slime.png", import.meta.url).href;

export default class Enemy extends Entity {
  constructor (maxHealth, moves, name, image="./assets/missing.jpg", customization={}){
    super(maxHealth, image, customization, customization.attribute ?? null);

    this.moves = moves;
    this.name = name;
    this.blockPts = 0;

    this.power = 0;
    this.defense = 0;
    this.nextMoveIndex = 0;

    this.getNextMove();
  }

  getNextMove(n=-1) {
    if (this.isDead()) {
      this.nextMove = null;
      return;
    }

    if (n < 0) {
      this.nextMove = this.moves[this.nextMoveIndex];
      this.nextMoveIndex++;
      this.nextMoveIndex %= this.moves.length;
      return;
    }

    this.nextMove = this.moves[n];
  }

  getAttackDamage() {
    let move = this.nextMove;
    if (move && move.damage) {
      let base = move.damage;

      // TEST power
      base = max(0, base + this.statuses["power"] ?? 0);

      if (this.statuses["reckless"]) {
        base *= 2;
      }

      return base * (move.hits ?? 1);
    }

    return 0;
  }

  // This passes a Player even though it maybe shouldn't
  useMove(player) {
    if (!this.nextMove || this.isDead()) {
      return;
    }

    const move = this.nextMove;

    if (move.selfEffects) {
      this.power += move.selfEffects.power ?? 0;
      this.defense += move.selfEffects.defense ?? 0;
    }

    const damage = move.damage ?? 0;
    const hits = move.hits ?? 1;
    for (let i = 0; i < hits; i++) {
      let hitDamage = damage;
      if (this.statuses["reckless"]) {
        hitDamage *= 2;
      }
      player.damage(hitDamage);
    }
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
    "Slime": new Enemy(
      45,
      [
        {damage: 4, selfEffects: {defense: -2, power: 2}},
        {damage: 3, hits: 2},
      ],
      "Slime",
      slimeImage,
      {attribute: "void"},
    ),
  }
}
