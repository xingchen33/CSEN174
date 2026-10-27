export default class Card {
  /**
   * @param {string} type - The card type ("l" or "s" or "r")
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

// Make sure you add all your card stuff to these lists!
export const CARDLIST = {
  "pick": (name) => { 
    const card = structuredClone(CARDLIST.cards[name]);
    Object.setPrototypeOf(card, Card.prototype);
    return card;
  },
  "cards": {
    "Fireball": new Card("s", "Fireball", "Deal 6 damage", {burn: true, damage: 6}, 1, {}, {natural: true}),
    "Ether Pupil": new Card("r", "Ether Pupil", "Play a natural card from your hand", {playNatural: 1}, 1, {}, {natural: true}),
    "Cure Wound": new Card("s", "Cure Wound", "Heal 6 HP", {healing: 6}, 1, {}, {}),
  }
}

export const LOGICLIST = {
  "pick": (name) => { 
    const card = structuredClone(LOGICLIST.cards[name]);
    Object.setPrototypeOf(card, Card.prototype);
    return card;
  },
  "cards": {
    "If": new Card("l", "If", "Execute actions FOR FREE if a condition is met", {condition: null}, 0, {}, {}),
    "While": new Card("l", "While", "Execute actions FOR FREE while a condition is met. Don't go infinite!", {condition: null}, 0, {}, {}),
  }
}
