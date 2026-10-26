import Entity from "./entity.js"
export default class Player extends Entity {
  /** 
   * @param {*} image - player's image icon
   * @param {*} maxEnergy - player's maximum energy
   */
  constructor (maxHealth, maxEnergy, deck, image="./assets/pacman.jpeg"){
    super(maxHealth, image);

    this.maxEnergy = maxEnergy;
    this.energy = maxEnergy;
    this.deck = deck;
    this.currentMove = [];
  }

  playCard(pos) {
    let playing = this.deck.hand[pos];
    if (this.evaluateCard(playing)) {
      this.deck.discard(1, [pos]);
    }
  }

  evaluateCard(card) {
    if (card.getEnergy() > this.energy) {
      return false;
    }

    this.energy -= card.getEnergy();

    return true;
  }

  useMove() {
    // TODO this is the core of the game
  }

  passTurn() {
    this.statusDecay();
    this.useMove()

    this.energy = this.maxEnergy;
  }
}
