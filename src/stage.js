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
    for(let i = 0; i < actions.length; i++){
      let curr_action = actions[i];
      if(curr_action.target == "allEnemies"){
        if(curr_action.key == "changeAttribute"){
          this.player.attribute = curr_action.value;
        }
        if(curr_action.key == "allEnemiesDamage"){
        for(let j = 0; j < this.enemies.length; j++){
          this.enemies[j].damage(curr_action.value);
          this.stats.damageDone += curr_action.value;
        }
        }
        if(curr_action.key == "damage"){
          let hit = 1
          let damage = curr_action.value;
          if(curr_action.hits != null){
            hit = curr_action.hits;
          }
          for(let j = 0; j < this.enemies.length; j++){
            this.enemies[j].damage(damage * hit);
            this.stats.damageDone += damage * hit;
          }
        }
        if(curr_action.key == "block"){
          this.player.blockPts += curr_action.action.value;
        }
        if(curr_action.key == "damagePerBlock"){
          damage_done = (curr_action.value.amount / curr_action.value.every) * curr_player.block;
          for(let j = 0; j < this.enemies.length; j++){
            this.enemies[j].damage(damage_done);
            this.stats.damageDone += damage_done;
          }
        }
        }
        if(curr_action.target == "enemy"){
          if(curr_action.key == "enemy_attack"){
            this.player.damage(curr_action.value);
            this.stats.damageTaken += curr_action.value;
          }
          if(curr_action.key == "damage"){
            this.curr_action.target.damage(curr_action.value);
            this.stats.damageDone += curr_action.value;
          }
          if(curr_action.key == "enemyDefense"){
            this.curr_action.target.block += curr_action.value;
          }
          if(curr_action.key == "draw"){
            this.player.cardDeck.draw(curr_action.value);
          }
          if(curr_action.key == "enemyPower"){
            this.curr_action.target.power += curr_action.value;
          }
          if(curr_action.key == "heal"){
            this.player.target.heal(curr_action.value);
          }
          if(curr_action.key == "healSelf"){
            this.player.heal(curr_action.value);
          }
          if(curr_action.key == "block"){
            this.player.block += curr_action.value;
          }

        }
        if(curr_action.target == "self"){
          if(curr_action.key == "selfDamage"){
            this.player.damage(curr_action.value);
            this.stats.damageTaken += curr_action.value;
          }
          if(curr_action.key == "playfromTrash"){
            card_attribute = curr_action.value.atrribute;
            card_type = curr_action.value.type;
            for(let j = 0; j < this.player.cardDeck.graveyard.length; j++){
              let card = this.player.cardDeck.graveyard[j];
              if(card.attribute == card_attribute && card.type == card_type){
                this.player.useMove(card);
                break;
              }
          }
        }
          if(curr_action.key == "trash"){
            count = curr_action.value;
            let positions = [];
            for(let j = 0; j < count; j++){
              if(this.player.cardDeck.hand.length > 0){
                positions.push(j);
              }
            }
          }
          if(curr_action.key == "block"){
            this.player.blockPts += curr_action.value;
          }
          if(curr_action.key == "power"){
            this.player.power += curr_action.value;
          }
          if(curr_action.key == "selfDefense"){
            this.player.defense += curr_action.value;
          }
          if(curr_action.key == "changeAttribute"){
            this.player.attribute = curr_action.value;
          }
          if(curr_action.key == "draw"){
            this.player.cardDeck.draw(curr_action.value);
          }
          if(curr_action.key == "nextTurnEnergy"){
            this.player.energy += curr_action.value;
          }
        }
        if(curr_action.target == "all"){
          if(curr_action.key == "changeAttribute"){
            this.player.attribute = curr_action.value;
          }
          if(curr_action.key == "selfDefense"){
            this.player.defense += curr_action.value;
          }
          if(curr_action.key == "enemyDefense"){
            for(let j = 0; j < this.enemies.length; j++){
              this.enemies[j].defense += curr_action.value;
            }
          }

        }
      
    }
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
