import Entity from "./entity.js"
export default class Player extends Entity {
  /** 
   * @param {*} image - player's image icon
   * @param {int} maxHealth
   * @param {int} maxEnergy
   * @param {CardDeck} cardDeck - player's playable cards
   * @param {SimpleDeck} logicDeck - player's logic cards
   */
  constructor (maxHealth, maxEnergy, cardDeck, logicDeck, image="./assets/pacman.jpeg"){
    super(maxHealth, image);

    this.maxEnergy = maxEnergy;
    this.energy = maxEnergy;

    this.cardDeck = cardDeck;
    this.logicDeck = logicDeck;

    // This is an array of objects, some of which are objects
    // Spells have targets
    // Logic cards have conditions and subarrays
    this.currentMove = [];
  }

  playCard(pos) {
    let playing = this.cardDeck.hand[pos];
    let location = this.getValidPositions(playing.type);
    if (this.evaluateCard(playing, location)) {
      this.cardDeck.discard(1, [pos]);
    }
  }

  // Should return the list of places that one could put a card of the specified type
  // Valid types: statement, ritual, target
  // Returns an object showing the type (target / statement / condition) of the element and the indexing required to change that element (for arrays, the index which it will occupy)
  getValidPositions(type, current=this.currentMove, indexset=[]) {
    let positions = [];
    for (let i = 0; i < current.length; i++) {
      let e = this.currentMove[i];

      // Anything with a "target" can have that overridden
      // Anything with a condition can have that condition's target overridden
      if (type == "target") {
        if ("target" in e) {
          positions.push({type: "target", index: [...indexset, i]});
        }
        else if (e.condition != null) {
          positions.push({type: "target", index: [...indexset, i, "condition"]});
        }
      }

      // You can put a statement at any index
      if (type == "statement" || type == "ritual") {
        positions.push({type: "statement", index: [...indexset, i]});
      }

      // Any logic block has a condition
      if (type == "ritual") {
        positions.push({type: "condition", index: [...indexset, i]});
      }

      if (e.type == "logic") {
        // If this was a logic statement, we recurse and prepend the index of this 
        positions.push(...this.getValidPositions(type, e, [...indexset, i]));
      }
    }

    // Statements can go at the end of things
    if (type == "statement" || type == "ritual") {
      positions.push({type: "statement", index: [...indexset, current.length]})
    }
    
    return positions;
  }

  // Adding a card to a move
  // "location" is an index set return from getValidPositions
  evaluateCard(card, location) {
    // Can't case something that costs too much energy
    if (card.getEnergy() > this.energy) {
      return false;
    }

    // Placing a statement just shifts everything down
    if (location.type == "statement") {
      
    }
    // Targets just override the property
    else if (location.type == "target") {
      
    }
    // Targets just override the property
    else if (location.type == "condition") {
      
    }

    this.energy -= card.getEnergy();

    return true;
  }

  useMove() {
    // TODO this is the core of the game
    // "currentMove" is an array of objects
  }

  passTurn() {
    this.statusDecay();
    this.useMove()

    this.energy = this.maxEnergy;
  }
}
