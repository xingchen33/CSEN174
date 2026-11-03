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

  // Architecturally, might need to completely change all of this to make it work with frontend
  nextTurn() {
    for (const enemy in enemies) {
      enemy.useMove(player);
    }

    this.player.useMove();

    this.enemies = this.enemies.filter((e) => { return !e.isDead(); });

    // TODO Update stats (as stretch)

    // Check for loss before win

    if (this.player.isDead()) {
      return "loss";
    } else if (this.enemies.length == 0) {
      return "win"; 
    }

    // Set up for next round
    this.curr_round += 1;
    this.player.passTurn();
    this.enemies.forEach((enemy) => enemy.passTurn());

    // Switch turn from player to enemy and vice versa
    this.turn = this.turn == "player" ? "enemy" : "player";
  }
}
