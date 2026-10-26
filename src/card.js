export default class Card {
  /**
   * @param {string} type - The card type ("l" or "e")
   * @param {number} name - The card name
   * @param {string} description - The card description
   * @param {object} effects - The effects for the card
   * @param {number} energy - The card energy cost
   * @param {object} customization - Customization options for the card (e.g., background color)
   * @param {object} tags - Tags associated with the card
   */
  constructor (type, name, description, effects, energy, customization={}, tags={}){
    this.type = type
    this.name = name 
    this.description = description
    this.effects = effects
    this.baseEnergy = energy 
    this.customization = customization

    this.tags = this.tags
  }

  getDamage() {
    let damage = this.effects["damage"];
    if (this.effects["overcharged"]) {
      damage *= 2;
    }

    return damage || null;
  }

  getEnergy() {
    let energy = this.baseEnergy;
    if (this.effects["overcharged"]) {
      energy *= 2;
    }

    return energy;
  }
}

export const CARDLIST = {
  "pick": (name) => { 
    const card = structuredClone(CARDLIST.cards[name]);
    Object.setPrototypeOf(card, Card.prototype);
    return card;
  },
  // Make sure you add all your card stuff to this list!
  "cards": {
    "Fireball": new Card("l", "Fireball", "{dmg} Damage", {burn: true, damage: 2}, 2, {}, {natural: true}),
    "Ether Pupil": new Card("e", "Ether Pupil", "Play a natural card from your hand", {playNatural: 1}, 1, {}, {natural: true}),
  }
}
