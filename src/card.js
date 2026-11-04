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

  getHeal(){
    let heal = this.effects["heal"];

    return heal || null;
  }

  getEnergy() {
    let energy = this.baseEnergy;
    if (this.effects["overcharged"]) {
      energy *= 2;
    }

    return energy;
  }

  getDescription(){
    let polishedDescription = this.description;
    polishedDescription = polishedDescription.replaceAll("{dmg}", String(this.getDamage()));
    polishedDescription = polishedDescription.replaceAll("{nrg}", String(this.getEnergy()));
    polishedDescription = polishedDescription.replaceAll("{heal}", String(this.getHeal()));

    return polishedDescription
  }

  getImage(side="front_img"){
    if (Object.keys(this.customization).includes(side))
      return this.customization[side]
    return "../assets/missing.jpg"
  }
}

// Make sure you add all your card stuff to these lists!
export const CARDLIST = {
  "pick": (name) => { 
    const card = structuredClone(CARDLIST.cards[name]);
    Object.setPrototypeOf(card, Card.prototype);
    return card;
  },
  "pickRandom": () => {
    // https://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
    var keys = Object.keys(CARDLIST.cards);
    const card = CARDLIST.cards[keys[keys.length * Math.random() << 0]];
    Object.setPrototypeOf(card, Card.prototype);
    return card;
  },
  "cards": {
    "Fireball": new Card("s", "Fireball", "Deal 6 damage", {burn: true, damage: 6}, 1, {
      "front_img": "../assets/1.webp",
      "name": {"bg-color": "linear-gradient(.90turn, #de7e35, #dec535)", "text-color": "#000000"}, 
      "type": {"bg-color": "linear-gradient(.90turn, #35deab, #35b1de)", "text-color": "#000000"}, 
      "description": {"bg-color": "linear-gradient(.90turn, #de7e35, #dec535)", "text-color": "#000000", }, 
      "energy": {"bg-color": "linear-gradient(.25turn, #af1a8a, #fc036f)", "text-color": "linear-gradient(.25turn, #760505, #0c0235)"}
    }, {natural: true}),
    "Ether Pupil": new Card("r", "Ether Pupil", "Play a natural card from your hand", {playNatural: 1}, 1, {
      "name": {"bg-color": "linear-gradient(.90turn, #a935de, #35de6d)", "text-color": "#000000"}, 
      "type": {"bg-color": "linear-gradient(.90turn, #9235de, #de35d0)", "text-color": "#000000"}, 
      "description": {"bg-color": "linear-gradient(.90turn, #a935de, #35de6d)", "text-color": "#000000", }, 
      "energy": {"bg-color": "linear-gradient(.25turn, #af1a8a, #fc036f)", "text-color": "linear-gradient(.25turn, #760505, #0c0235)"}
    }, {natural: true}),
    "Cure Wound": new Card("s", "Cure Wound", "Heal {heal} HP", {healing: 6}, 1, {}, {}),
  }
}

export const LOGICLIST = {
  "pick": (name) => { 
    const card = structuredClone(LOGICLIST.cards[name]);
    Object.setPrototypeOf(card, Card.prototype);
    return card;
  },
  "pickRandom": () => {
    var keys = Object.keys(LOGICLIST.cards);
    const card = LOGICLIST.cards[keys[keys.length * Math.random() << 0]];
    Object.setPrototypeOf(card, Card.prototype);
    return card;
  },
  "cards": {
    "If": new Card("l", "If", "Execute actions FOR FREE if a condition is met", {condition: null}, 0, {}, {}),
    "While": new Card("l", "While", "Execute actions FOR FREE while a condition is met. Don't go infinite!", {condition: null}, 0, {}, {}),
  }
}
