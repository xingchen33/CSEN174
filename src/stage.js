export default class Stage {
  constructor (player, enemies, rewards) {
    this.player = player;
    this.enemies = enemies;
    this.rewards = rewards;

    this.turnCount = 0;
    this.turn = "player";

    // TODO this should match the stats object in run
    this.stats = {
      damageDone: 0,
      damageTaken: 0,
      cardsPlayed: 0,
    };
  }

  // Mostly for debug purposes
  addEnemy(enemy){
    this.enemies.push(enemy);
  }

  passTurn() {
    let actions = this.player.useMove();
    this.enemies = this.enemies.filter((enemy) => !enemy.isDead());

    if (this.enemies.length === 0) {
      return "win";
    }

    this.enemies.forEach((enemy) => enemy.useMove(this.player));
    if (this.player.isDead()) {
      return "loss";
    }

    this.player.passTurn();
    this.enemies.forEach((enemy) => enemy.passTurn());
    this.turnCount += 1;
    this.turn = "player";
    return "continue";
  }

  nextTurn() {
    return this.passTurn();
  }
}
