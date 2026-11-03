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

  // TODO this should use enemy or player attacks, and check for wins/losses
  nextTurn() {

    // TODO Use attacks

    // TODO Clear enemies

    // TODO Update stats

    // TODO Check wins / losses
    // Check for win before loss, so that you can live on 0HP if it works out that way

    // TODO Set up for next round
    this.curr_round += 1

    // Switch turn from player to enemy and vice versa
    this.turn = this.turn == "player" ? "enemy" : "player";
  }
}
