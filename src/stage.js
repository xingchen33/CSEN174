
import Player from "./player.js"
import Enemey from "./enemy.js"
import Card from './card.js'
import Enemy from "./enemy.js";


export default class Stage {
  player = new Player();
  enemies_list = [];
  constructor (cards, curr_player, enemies_list, curr_round ,curr_turn, damage_dealt = 0, hp_delta = 0, enemies_destroyed = 0){
    this.cards = cards;
    this.player = curr_player;
    this.enemies_list = enemies_list;
    this.curr_round = curr_round;
    this.curr_turn = curr_turn;
    this.damage_dealt = damage_dealt;
    this.hp_delta = hp_delta;
    this.enemies_destroyed = enemies_destroyed;
    this.start_health = this.player.health;
    this.start_energy = this.player.energy;    
  }
  addEnemy(enemy){
    if(!(enemy instanceof Enemy)){
      throw new Error("Not an enemy");
    }
    this.enemies_list.push(enemy);
  }

  
  changeTurn(player){
    this.curr_turn = player;
  }

  playerDamageTaken(){
    return this.start_health - this.player.health;
  }

  playerEnergyUsed(){
    return this.start_energy - this.player.energy;
  }

  nextTurn(p1, p2){
    this.curr_round += 1
    this.changeTurn(p2)
    this.damage_dealt += p1.getAttackDamage();
    this.hp_delta = this.playerDamageTaken();
    this.energy_used = this.playerEnergyUsed();
    for(const i in this.enemies_list){
      if(this.enemies_list[i].isDead()){
        this.enemies_destroyed += 1;
    }
  }
  
  }


  

  
    



  


}












