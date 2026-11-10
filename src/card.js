export const DEFAULT_CARD_CUSTOMIZATION = {
  name: {
    "bg-color": "linear-gradient(.90turn, #de7e35, #dec535)",
    "text-color": "#000000",
  },
  type: {
    "bg-color": "linear-gradient(.90turn, #35deab, #35b1de)",
    "text-color": "#000000",
  },
  description: {
    "bg-color": "linear-gradient(.90turn, #de7e35, #dec535)",
    "text-color": "#000000",
  },
  energy: {
    "bg-color": "linear-gradient(.25turn, #af1a8a, #fc036f)",
    "text-color": "linear-gradient(.25turn, #760505, #0c0235)",
  },
  block: {
    "bg-color": "linear-gradient(.90turn, #de7e35, #dec535)",
    "text-color": "#000000",
  },
};

export default class Card {
  /**
   * @param {string} type - The card type ("l" or "s" or "r")
   * @param {number} name - The card name
   * @param {string} description - The card description
   * @param {object} effects - The effects for the card
   * @param {number} energy - The card energy cost
   * @param {object} target - The target of the card
   * @param {object} customization - Customization options for the card (e.g., background color)
   * @param {object} tags - Tags associated with the card
   */  
  static nextCardID = 0;
  constructor (type, name, description, effects, energy, target, conditions, block ,customization={}, tags={}){
    this.type = type
    this.name = name 
    this.description = description
    this.effects = effects
    this.baseEnergy = energy
    this.target = target 
    this.conditions = conditions
    this.block = block;
    this.customization = structuredClone(DEFAULT_CARD_CUSTOMIZATION);
    for (const [element, styles] of Object.entries(customization ?? {})) {
      if (
        styles && typeof styles === "object" && !Array.isArray(styles)
        && this.customization[element] && typeof this.customization[element] === "object"
      ) {
        Object.assign(this.customization[element], styles);
      } else {
        this.customization[element] = styles;
      }
    }
    this.id = ++Card.nextCardID;
    this.tags = tags
  }

  assignID(){
    this.id = ++Card.nextCardID;
  }

  getDamage() {
    let damage = this.effects["damage"];
    if (this.effects["overcharged"]) {
      damage *= 2;
    }

    return damage || null;
  }

  getHeal(){
    let heal = this.effects["heal"] ?? this.effects["healing"];

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
    "Fireball": new Card("s", "Fireball", "Deal 5 damage.", {burn: true, damage: 5}, 1, "enemy", null, null, {
      "front_img": "./assets/fireball.png",
      "name": {"bg-color": "linear-gradient(.90turn, #de7e35, #dec535)", "text-color": "#000000"}, 
      "type": {"bg-color": "linear-gradient(.90turn, #35deab, #35b1de)", "text-color": "#000000"}, 
      "description": {"bg-color": "linear-gradient(.90turn, #de7e35, #dec535)", "text-color": "#000000"}, 
      "energy": {"bg-color": "linear-gradient(.25turn, #af1a8a, #fc036f)", "text-color": "linear-gradient(.25turn, #760505, #0c0235)"},
      "block": {"bg-color": "linear-gradient(.90turn, #de7e35, #dec535)", "text-color": "#000000"}
    }, {attribute: "natural"}),
    "Curse": new Card(
      "r", "Curse", "-2 defense on an enemy.", {enemyDefense: -2}, 1, "enemy", null, null, {}, {attribute: "dark"}
    ),
    "Ether Pupil": new Card("r", "Ether Pupil", "Play a natural card from your hand", {playNatural: 1}, 1, 'a', 'b', 'c',  {
      "name": {"bg-color": "linear-gradient(.90turn, #a935de, #35de6d)", "text-color": "#000000"}, 
      "type": {"bg-color": "linear-gradient(.90turn, #9235de, #de35d0)", "text-color": "#000000"}, 
      "description": {"bg-color": "linear-gradient(.90turn, #a935de, #35de6d)", "text-color": "#000000"}, 
      "energy": {"bg-color": "linear-gradient(.25turn, #af1a8a, #fc036f)", "text-color": "linear-gradient(.25turn, #760505, #0c0235)"}
    }, {attribute: "natural"}),
    "Cure Wound": new Card(
      "s", "Cure Wound", "Heal {heal} HP.", {healing: 6}, 1, "self", null, null, {}, {attribute: "light"}, {
      "front_img": "./assets/curewound.png",
      "name": {"bg-color": "linear-gradient(.90turn, #de7e35, #dec535)", "text-color": "#000000"}, 
      "type": {"bg-color": "linear-gradient(.90turn, #35deab, #35b1de)", "text-color": "#000000"}, 
      "description": {"bg-color": "linear-gradient(.90turn, #de7e35, #dec535)", "text-color": "#000000"}, 
      "energy": {"bg-color": "linear-gradient(.25turn, #af1a8a, #fc036f)", "text-color": "linear-gradient(.25turn, #760505, #0c0235)"},
      "block": {"bg-color": "linear-gradient(.90turn, #de7e35, #dec535)", "text-color": "#000000"}
    }
    ),
    "Mind Shock": new Card(
      "s", "Mind Shock", "Deal 10 damage to 1 enemy.", {damage: 10}, 2, "enemy", null, null, {}, {attribute: "dark"}
    ),
    "Fuel": new Card(
      "s", "Fuel", "Deal 7 damage, draw 1 card.", {damage: 7, draw: 1}, 1, "enemy", null, null, {}, {attribute: "natural"}
    ),
    "Bondage": new Card(
      "r", "Bondage", "-2 power on an enemy.", {enemyPower: -2}, 1, "enemy", null, null, {}, {attribute: "light"}
    ),

    // Dark cards
    "Hell Reborn": new Card(
      "r", "Hell Reborn", "Change your attribute to dark. All enemies lose 3 HP.",
      {changeAttribute: "dark", allEnemiesDamage: 3}, 1, "allEnemies", null, null, {}, {attribute: "dark"}
    ),
    "Demon's Hand": new Card(
      "r", "Demon's Hand", "Lose 8 HP. You can play a dark spell card from your trash.",
      {selfDamage: 8, playFromTrash: {attribute: "dark", type: "s"}}, 2, "self", null, null, {}, {attribute: "dark"}
    ),
    "Feed": new Card(
      "r", "Feed", "Draw 1 card, trash 1 card.",
      {draw: 1, trash: 1}, 0, "self", null, null, {}, {attribute: "dark"}
    ),
    "Transfer Contract": new Card(
      "r", "Transfer Contract", "Gives enemy power +1 and defense -3.",
      {enemyPower: 1, enemyDefense: -3}, 1, "enemy", null, null, {}, {attribute: "dark"}
    ),
    "Seducing Lie": new Card(
      "s", "Seducing Lie", "Gives enemy power +1, deals 12 damage.",
      {enemyPower: 1, damage: 12}, 1, "enemy", null, null, {}, {attribute: "dark"}
    ),
    "Eating Whole": new Card(
      "r", "Eating Whole", "Gain 20 block points. This turn, when attacked, give enemy power -2 and gain power +2.",
      {block: 20, onAttacked: {enemyPower: -2, power: 2}}, 3, "self", null, null, {}, {attribute: "dark"}
    ),

    // Light cards
    "Purification": new Card(
      "r", "Purification", "Change your attribute to light. All your negative buffs lose one layer.",
      {changeAttribute: "light", removeNegativeBuffLayers: 1}, 1, "self", null, null, {}, {attribute: "light"}
    ),
    "Light Rain": new Card(
      "s", "Light Rain", "Deals 2 x 3 damage to all enemies.",
      {damage: 2, hits: 3}, 1, "allEnemies", null, null, {}, {attribute: "light"}
    ),
    "Palms": new Card(
      "r", "Palms", "Gives enemy attack -1, heal 5.",
      {enemyAttack: -1, heal: 5}, 1, "enemy", null, null, {}, {attribute: "light"}
    ),
    "Holy Arrow": new Card(
      "s", "Holy Arrow", "Deals 6 damage. If the enemy has power -, give power -5.",
      {damage: 6, conditionalEnemyPower: {requires: "power-", amount: -5}}, 2, "enemy", null, null, {}, {attribute: "light"}
    ),
    "Holy Water": new Card(
      "r", "Holy Water", "This turn, increase your spell damage by 5 against enemies with power -.",
      {spellDamageBonus: 5, condition: "enemyPowerNegative", duration: "turn"}, 1, "self", null, null, {}, {attribute: "light"}
    ),
    "Love and Rage": new Card(
      "s", "Love and Rage", "Heal 3. For each 1 HP healed this battle, deal 5 damage.",
      {heal: 3, damagePerBattleHealing: 5}, 2, "self", null, null, {}, {attribute: "light"}
    ),

    // Natural cards
    "Breathe Exchange": new Card(
      "r", "Breathe Exchange", "Change your attribute to natural. Draw 2 cards.",
      {changeAttribute: "natural", draw: 2}, 1, "self", null, null, {}, {attribute: "natural"}
    ),
    "Rock Armor": new Card(
      "r", "Rock Armor", "Gain 7 block points.",
      {block: 7}, 1, "self", null, null, {}, {attribute: "natural"}
    ),
    "Golem Strike": new Card(
      "s", "Golem Strike", "Gain 5 block points, deal 5 damage.",
      {block: 5, damage: 5}, 1, "enemy", null, null, {}, {attribute: "natural"}
    ),
    "Explosive Parts": new Card(
      "s", "Explosive Parts", "Gain 4 block points. For each 2 block points you have, deal 3 damage to all enemies.",
      {block: 4, damagePerBlock: {amount: 3, every: 2}}, 2, "allEnemies", null, null, {}, {attribute: "natural"}
    ),
    "Vaporization": new Card(
      "s", "Vaporization", "Deal 8 damage. Give enemy defense -1 and power -1.",
      {damage: 8, enemyDefense: -1, enemyPower: -1}, 2, "enemy", null, null, {}, {attribute: "natural"}
    ),
    "Synchronization": new Card(
      "r", "Synchronization", "Gain attack +2. Draw 1 more card and gain 1 energy next turn.",
      {power: 2, draw: 1, nextTurnEnergy: 1}, 1, "self", null, null, {}, {attribute: "natural"}
    ),

    // Void cards
    "Self-Collapase": new Card(
      "r", "Self-Collapase", "Change your attribute to void. Give yourself and all enemies defense -3.",
      {changeAttribute: "void", selfDefense: -3, allEnemiesDefense: -3}, 1, "all", null, null, {}, {attribute: "void"}
    ),
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
    "Pointer": new Card("l", "Pointer", "Pick a target", {condition: null}, 0, {}, {}),
  }
}

// this may need to be moved
export function addCard(card, input_player, loc="hand"){
  let player_deck = null
  if (card.type == "s" || card.type == "r")
    player_deck = input_player.cardDeck
  else 
    player_deck = input_player.logicDeck
  
  if (loc == "hand")
    player_deck.hand.push(card)
  else if (loc == "current")
    input_player.currentMove.push(card)
  else 
    player_deck.drawPile.push(card)
}

export function removeCard(card, input_player){
  sub_remove(card, input_player.currentMove)

  let next_removal = input_player.cardDeck
  if (card.type == "l"){
      next_removal = input_player.logicDeck
  }

  sub_remove(card, next_removal.hand)
  sub_remove(card, next_removal.drawPile)

  function sub_remove(input_card, input_deck){
    let index = 0
    for (let check_card of input_deck) {
    if (input_card == check_card){
      input_deck.splice(index, 1)
      return card
    }
    ++index;
  };
  }
}

export function get_card_by_id(id, input_player){
  for (const sub_deck of 
    [input_player.currentMove, 
      input_player.cardDeck.hand, 
      input_player.cardDeck.drawPile, 
      input_player.logicDeck.hand, 
      input_player.logicDeck.drawPile]){
    for (const card of sub_deck){
      if (card.id == id)
        return card
    };
  };
}
export function get_card_position_by_id(id, input_player){
  for (const sub_deck of 
    [input_player.currentMove, 
      input_player.cardDeck.hand, 
      input_player.cardDeck.drawPile, 
      input_player.logicDeck.hand, 
      input_player.logicDeck.drawPile]){
        let x = 0;
    for (const card of sub_deck){
      if (card.id == id)
        return x 
      ++x;
    };
  };
}