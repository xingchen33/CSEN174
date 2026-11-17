import Entity from "./entity.js";

const slimeImage = new URL("../assets/slime.png", import.meta.url).href;

export default class Enemy extends Entity {
  constructor(
    maxHealth,
    moves,
    name,
    image = "./assets/missing.jpg",
    customization = {},
  ) {
    super(maxHealth, image, customization, customization.attribute ?? null);

    this.moves = moves;
    this.name = name;
    this.blockPts = 0;

    this.nextMoveIndex = 0;

    this.getNextMove();
  }

  getNextMove(n = -1) {
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

  // Only gets damage for a single attack
  getAttackDamage() {
    let move = this.nextMove;
    if (move && move.damage) {
      let base = move.damage;

      base = Math.max(0, base + (this.statuses["power"] ?? 0) + (this.statuses["attack"] ?? 0));

      return base;
    }

    return 0;
  }

  useMove(player) {
    if (!this.nextMove || this.isDead()) {
      return;
    }

    // Pick a non-random attack
    while(this.nextMove.random) {
      this.nextMove = this.moves[Math.floor(Math.random() * this.moves.length)];
    }

    const move = this.nextMove;

    const hits = move.hits ?? 1;
    for (let i = 0; i < hits; i++) {
      let hitDamage = move.damage ?? 0;
      player.damage(hitDamage);
    }

    if (move.selfEffects) {
      if (move.selfEffects.power) {
        this.buff("power", move.selfEffects.power);
        this.power += move.selfEffects.power;
      }
      if (move.selfEffects.defense) {
        this.buff("defense", move.selfEffects.defense);
        this.defense += move.selfEffects.defense;
      }
    }
  }

  // TODO you probably need to redo this
  passTurn() {
    this.getNextMove();
  }
}

export const ENEMYLIST = {
  pick: (name) => {
    const enemy = structuredClone(ENEMYLIST.enemies[name]);
    Object.setPrototypeOf(enemy, Enemy.prototype);
    return enemy;
  },
  pickRandom: () => {
    var keys = Object.keys(ENEMYLIST.cards);
    const enemy = ENEMYLIST.cards[keys[(keys.length * Math.random()) << 0]];
    Object.setPrototypeOf(enemy, Enemy.prototype);
    return card;
  },
  // Make sure you add all your enemies to this list!
  enemies: {
    Dummy: new Enemy(100, [{ damage: 20 }, { damage: 30 }], "Dummy"),
    Slime: new Enemy(
      45,
      [
        { damage: 4},
        {selfEffects: { defense: -2, power: 2 }},
        { random: true },
        { damage: 3, hits: 2 },
      ],
      "Slime",
      slimeImage,
      { attribute: "void" },
    ),
    Imp: new Enemy(
      20,
      [
        { damage: 4, selfEffects: { defense: -2, power: 2 } },
        { damage: 3, hits: 2 },
      ],
      "Slime",
      slimeImage,
      { attribute: "void" },
    ),
  },
};
