import Entity from "./entity.js";

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

      base = Math.max(
        0,
        base + (this.statuses["power"] ?? 0) + (this.statuses["attack"] ?? 0),
      );

      return base;
    }

    return 0;
  }

  useMove(player, enemies) {
    if (!this.nextMove || this.isDead()) {
      return;
    }

    // Pick a non-random attack
    while (this.nextMove.random) {
      this.nextMove = this.moves[Math.floor(Math.random() * this.moves.length)];
    }

    const move = this.nextMove;

    const hits = move.hits ?? 1;
    for (let i = 0; i < hits; i++) {
      let hitDamage = move.damage ?? 0;
      player.damage(hitDamage);
    }

    if (move.heal) {
      this.heal(move.heal);
    }

    if (move.block) {
      this.block += move.block;
    }

    if (move.playerEffects) {
      if (move.playerEffects.power) {
        player.buff("power", move.playerEffects.power);
      }
      if (move.playerEffects.defense) {
        player.buff("defense", move.playerEffects.defense);
      }
    }

    if (move.selfEffects) {
      if (move.selfEffects.power) {
        this.buff("power", move.selfEffects.power);
      }
      if (move.selfEffects.defense) {
        this.buff("defense", move.selfEffects.defense);
      }
    }

    if (move.allEnemies) {
      if (move.allEnemies.power) {
        enemies.forEach((enemy) => {
          enemy.buff("power", move.allEnemies.power);
        });
      }
      if (move.allEnemies.defense) {
        enemies.forEach((enemy) => {
          enemy.buff("defense", move.allEnemies.power);
        });
      }
    }

    if (move.healEnemies) {
      enemies.forEach((enemy) => {
        enemy.heal(move.healEnemies);
      });
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
        { damage: 4 },
        { selfEffects: { defense: -2, power: 2 } },
        { random: true },
        { damage: 3, hits: 2 },
      ],
      "Slime",
      "./assets/slime.png",
      { attribute: "void" },
    ),
    Imp: new Enemy(
      20,
      [
        { playerEffects: { power: -3 } },
        { damage: 3 },
        { selfEffects: { power: 3 } },
        { damage: 3, hits: 2 },
        { random: true },
      ],
      "Imp",
      "./assets/imp.png",
      { attribute: "dark" },
    ),
    Bell: new Enemy(
      35,
      [
        { damage: 6 },
        { damage: 10 },
        { heal: 8 },
        { random: true },
      ],
      "Bell",
      "./assets/bell.png",
      { attribute: "light" },
    ),
    Raven: new Enemy(
      28,
      [
        { damage: 4 },
      ],
      "Raven",
      "./assets/raven.png",
      { attribute: "natural" },
    ),
    Warlock: new Enemy(
      25,
      [
        { allEnemies: { power: 2 } },
        { playerEffects: { power: -2, defense: -2 } },
        { random: true },
        { damage: 2, hits: 8 },
        { damage: 1, hits: 3 },
        { random: true },
      ],
      "Warlock",
      "./assets/warlock.png",
      { attribute: "dark" },
    ),
    Etherbeast: new Enemy(
      55,
      [
        { block: 10 },
        { damage: 10 },
        { random: true },
      ],
      "Ethereal Beast",
      "./assets/etherbeast.png",
      { attribute: "natural" },
    ),
    Experimentsubject: new Enemy(
      28,
      [
        { playerEffects: { power: -3 } },
        { random: true },
        { playerEffects: { defense: -3 } },
        { healEnemies: 4 },
        { random: true },
      ],
      "Experiment Subject",
      "./assets/experimentsubject.png",
      { attribute: "light" },
    ),
  },
};
