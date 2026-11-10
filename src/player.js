import Entity from "./entity.js"
export default class Player extends Entity {
  /** 
   * @param {*} image - player's image icon
   * @param {int} maxHealth
   * @param {int} maxEnergy
   * @param {CardDeck} cardDeck - player's playable cards
   * @param {SimpleDeck} logicDeck - player's logic cards
   */
  // ASK do players start at max health, or whatever health they ended last stage with?
  constructor (maxHealth, maxEnergy, cardDeck, logicDeck, items, image="./assets/missing.jpg"){
    super(maxHealth, image);

    this.maxEnergy = maxEnergy;
    this.energy = maxEnergy;

    this.cardDeck = cardDeck;
    this.logicDeck = logicDeck;
    this.items = items;

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

  // TEST like REALLY REALLY TEST
  // Should return the list of places that one could put a card of the specified type
  // Valid types: statement, ritual, target
  // Returns an object showing the type (target / statement / condition) of the element and the indexing required to change that element (for arrays, the index which it will occupy)
  getValidPositions(type, current=this.currentMove, indexset=[]) {
    let positions = [];
    for (let i = 0; i < current.length; i++) {
      let e = current[i];

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

      if (e.type == "logic" && e.block != null) {
        // If this was a logic statement, we recurse and prepend the index of this 
        positions.push(...this.getValidPositions(type, e.block, [...indexset, i]));
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
  // TODO this is also very important
  
  evaluateCard(card, location) {
    // Can't cast something that costs too much energy
    if (card.getEnergy() > this.energy) {
      return false;
    }
    //checks on the location
    if(location == null || location.index == null || location.index.length == 0) {
      return false;
    }
    //turning the card into the dictionary
    let dict_to_insert = {};
    dict_to_insert.type = card.type;
    dict_to_insert.target = card.target;
    dict_to_insert.effects = card.effects;
    dict_to_insert.condition = card.conditions;
    dict_to_insert.block = card.block;
    //base case
    if(location.index.length == 1){
      let insert = location.index[0];
      if(location.type == "statement"){
        //check the index is valid
        if(insert < 0 || insert > this.currentMove.length){
          return false;
        }
        else{
          //shift all the statements
          for(let i = this.currentMove.length; i > insert; i--){
            this.currentMove[i] = this.currentMove[i-1];
          }
          //add the statement in the right position
          this.currentMove[insert] = dict_to_insert;
        }
      }
      else if(location.type == "target"){
          //if you want change the target for a condition
          if(insert == "condition"){
            //make sure the condition exists
            if(this.currentMove.condition == null){
              return false;
            }
            else{
              //change the target for the condition
              this.currentMove.target = card.target;
            }
          }
          else{
            //make sure the target exists
            if(this.currentMove[insert] == null || this.currentMove[insert].target == null){
              return false;
            }
            else{
              this.currentMove[insert].target = card.target;
            }
          }
      }
        
      else if(location.type == "condition"){
            //make sure the condition exists
            if(this.currentMove[insert] == null || this.currentMove[insert].condition == null){
              return false;
            }
            //change the condition
            else{
              this.currentMove[insert].condition = card.conditions;
            }
      }
      //if the location.type is not valid
      else{
        return false;
      }
      //subtract the energy
      this.energy -= card.getEnergy();
      return true;
    }
    else{
      //recursive case
      let first_index = location.index[0];
      if(this.currentMove[first_index] == null){
        return false;
      }
      let root = this.currentMove;
      let next = root[first_index];
      //check if we are adding a statement in an if/while block
      if(next.block != null){
        this.currentMove = next.block;

      }
      else{
        this.currentMove = next;
      }
      //come up with the new location
      let new_location_index = [];
      for(let i = 1; i < location.index.length; i++){
        new_location_index.push(location.index[i]);
      }
      let new_location = {type: location.type, index: new_location_index};
      //call the function recursively on the new function
      let final_result = this.evaluateCard(card, new_location);
      //set the current move back to the root
      this.currentMove = root;
      return final_result
    }
 
  }

  useMove(selectedMove=this.currentMove) {
    // TODO this is the core of the game
    
    // Iterate through all elements of the current move
    for (let i = 0; i < selectedMove.length; i++) {

      let move = selectedMove[i];
      // If the statement is a logic block, check condition
      if (move.type == "If") {
        
      }
      else if (move.type == "While") {
        
      }
      else {
        let effects = move.effects;
        if ("damage" in effects) {
          move.target.damage(effects["damage"]);
        }

        if ("healing" in effects) {
          move.target.heal(effects["healing"]);
        }
      }
    }
  }

  passTurn() {
    this.statusDecay();
    this.useMove();

    this.energy = this.maxEnergy;
  }
}

export const ITEMLIST = {
  "pick": (name) => {
    return structuredClone(ITEMLIST.items[name]);
  },
  "pickRandom": () => {
    var keys = Object.keys(ITEMLIST.items);
    const item = ITEMLIST.items[keys[keys.length * Math.random() << 0]];
    return item;
  },
  "items": {
    "Rubber Duck": { name: "Rubber Duck" },
  }
};
