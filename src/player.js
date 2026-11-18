import Entity from "./entity.js";
export default class Player extends Entity {
  /**
   * @param {*} image - player's image icon
   * @param {int} maxHealth
   * @param {int} maxEnergy
   * @param {CardDeck} cardDeck - player's playable cards
   * @param {SimpleDeck} logicDeck - player's logic cards
   */
  // ASK do players start at max health, or whatever health they ended last stage with?
  constructor(
    maxHealth = 50,
    maxEnergy = 3,
    cardDeck,
    logicDeck,
    startingSpellCount = 3,
    startingLogicCount = 3,
    items = {},
    image = "./assets/player.png",
    attribute = "natural",
  ) {
    super(maxHealth, image, {}, attribute);

    this.maxEnergy = maxEnergy;
    this.energy = maxEnergy;

    this.startingLogicCount = startingLogicCount;
    this.startingSpellCount = startingSpellCount;

    this.cardDeck = cardDeck;
    cardDeck.shuffleDeck();
    this.logicDeck = logicDeck;
    this.extraDraws = 0;
    logicDeck.shuffleDeck();

    this.cardDeck.draw(this.startingSpellCount);
    this.logicDeck.draw(this.startingLogicCount);

    this.items = items;

    // This is an array of objects, some of which are objects
    // Spells have targets
    // Logic cards have conditions and subarrays
    this.currentMove = [];
    this.previousMoves = [];
    this.lastPlayError = null;
  }

  playCard(pos, target = null, location = null, deck = this.cardDeck) {
    this.lastPlayError = null;
    let playing = deck?.hand[pos];
    if (!playing) {
      this.lastPlayError = "That card is no longer in your hand.";
      return false;
    }

    const originalTarget = playing.target;
    const placingCounter = location?.type === "condition";
    const counterNeedsTarget =
      placingCounter && playing.counters?.requiresTarget === true;
    if (target !== null) {
      playing.target = target;
    }

    const requiresTarget =
      !placingCounter &&
      !["self", "all", "allEnemies"].includes(playing.target) &&
      (playing.target === "enemy" ||
        playing.target === "a" ||
        playing.target === "player" ||
        playing.target === "ally" ||
        playing.effects?.damage != null);
    if (
      requiresTarget &&
      (typeof playing.target !== "object" || playing.target === null)
    ) {
      this.lastPlayError = "This card needs a valid target.";
      playing.target = originalTarget;
      return false;
    }
    if (counterNeedsTarget && (target == null || typeof target !== "object")) {
      this.lastPlayError = "This counter needs a valid target.";
      playing.target = originalTarget;
      return false;
    }

    const positionType =
      { s: "statement", r: "ritual", l: "statement" }[playing.type] ??
      playing.type;
    const selectedLocation =
      location ?? this.getValidPositions(positionType)[0];
    if (playing.getEnergy() > this.energy) {
      this.lastPlayError = `You need ${playing.getEnergy()} energy, but only have ${this.energy}.`;
      playing.target = originalTarget;
      return false;
    }
    if (!selectedLocation) {
      this.lastPlayError = "There is no valid position for this card.";
      playing.target = originalTarget;
      return false;
    }
    if (this.evaluateCard(playing, selectedLocation)) {
      deck.discard(1, [pos]);
      return true;
    }

    // Target selection must be transactional. A failed play should not leave
    // the card permanently pointed at the attempted target.
    playing.target = originalTarget;
    this.lastPlayError = "That card cannot be placed in the selected position.";
    return false;
  }

  isLogicMove(move) {
    return (
      move != null &&
      (move.type === "l" ||
        move.type === "logic" ||
        move.name === "If" ||
        move.name === "While" ||
        move.name === "Pointer")
    );
  }

  // TEST like REALLY REALLY TEST
  // Should return the list of places that one could put a card of the specified type
  // Valid types: statement, ritual, target
  // Returns an object showing the type (target / statement / condition) of the element and the indexing required to change that element (for arrays, the index which it will occupy)
  getValidPositions(type, current = this.currentMove, indexset = []) {
    let positions = [];
    if (!Array.isArray(current)) {
      return positions;
    }

    for (let i = 0; i < current.length; i++) {
      let e = current[i];
      if (e == null || typeof e !== "object") {
        continue;
      }

      // Anything with a "target" can have that overridden
      // Anything with a condition can have that condition's target overridden
      if (type == "target") {
        if ("target" in e || (this.isLogicMove(e) && e.condition != null)) {
          positions.push({ type: "target", index: [...indexset, i] });
        }
      }

      // You can put a statement at any index
      if (type == "statement" || type == "ritual") {
        positions.push({ type: "statement", index: [...indexset, i] });
      }

      // Any logic block has a condition
      if (type == "ritual" && this.isLogicMove(e)) {
        positions.push({ type: "condition", index: [...indexset, i] });
      }

      if (this.isLogicMove(e) && Array.isArray(e.block)) {
        // If this was a logic statement, we recurse and prepend the index of this
        positions.push(
          ...this.getValidPositions(type, e.block, [...indexset, i]),
        );
      }
    }

    // Statements can go at the end of things
    if (type == "statement" || type == "ritual") {
      positions.push({
        type: "statement",
        index: [...indexset, current.length],
      });
    }

    return positions;
  }

  // Adding a card to a move
  // "location" is an index set return from getValidPositions
  evaluateCard(card, location) {
    // Can't cast something that costs too much energy
    if (card.getEnergy() > this.energy) {
      return false;
    }
    //checks on the location
    if (
      location == null ||
      !["statement", "target", "condition"].includes(location.type) ||
      !Array.isArray(location.index) ||
      location.index.length === 0
    ) {
      return false;
    }

    const dictToInsert = {
      name: card.name,
      description: card.getDescription(),
      type: card.type,
      target: card.target,
      // Keep targets as entity references, but don't share mutable effect data.
      effects: structuredClone(card.effects),
      condition: structuredClone(card.conditions),
      block: card.block == null ? card.block : structuredClone(card.block),
    };

    // Walk through logic blocks without temporarily replacing currentMove.
    let destination = this.currentMove;
    for (let i = 0; i < location.index.length - 1; i++) {
      const index = location.index[i];
      if (
        !Array.isArray(destination) ||
        !Number.isInteger(index) ||
        !this.isLogicMove(destination[index]) ||
        !Array.isArray(destination[index].block)
      ) {
        return false;
      }
      destination = destination[index].block;
    }

    const index = location.index[location.index.length - 1];
    if (!Array.isArray(destination) || !Number.isInteger(index)) {
      return false;
    }

    if (location.type === "statement") {
      if (index < 0 || index > destination.length) {
        return false;
      }
      destination.splice(index, 0, dictToInsert);
    } else if (location.type === "target") {
      if (
        destination[index] == null ||
        (!("target" in destination[index]) &&
          !(this.isLogicMove(destination[index]) &&
            destination[index].condition != null))
      ) {
        return false;
      }
      destination[index].target = card.target;
    } else if (location.type === "condition") {
      if (
        destination[index] == null ||
        !this.isLogicMove(destination[index]) ||
        !("condition" in destination[index])
      ) {
        return false;
      }
      if (card.counters == null) {
        return false;
      }

      const counter = structuredClone(card.counters);
      if (counter.requiresTarget) {
        counter.target = card.target;
      }
      destination[index].condition = counter;
    }

    this.energy -= card.getEnergy();
    return true;
  }

  evaluateCondition(condition, target) {
    if (condition == "power-" || condition == "enemyPowerNegative") {
      if (target == null) {
        return false;
      }
      return target.power < 0;
    }
    return false;
  }

  useMove(selectedMove = this.currentMove) {
    // Iterate through all elements of the current move
    let steps_of_effects = [];

    for (let i = 0; i < selectedMove.length; i++) {
      let move = selectedMove[i];

      // If the statement is a logic block, check condition
      if (
        this.isLogicMove(move) &&
        (move.name == "If" || move.name == "While")
      ) {
        let condition = move.condition;

        if (condition != null) {
          let condition_satisfied = this.evaluateCondition(
            condition,
            move.target,
          );

          if (condition_satisfied) {
            let steps = this.useMove(move.block);

            for (let j = 0; j < steps.length; j++) {
              steps_of_effects.push(steps[j]);
            }
          }
        }
      } else {
        let effects = move.effects;
        let keys = Object.keys(effects);
        for (let j = 0; j < keys.length; j++) {
          let key = keys[j];
          let value = effects[key];

          if (key.startsWith("conditional")) {
            let condition_satisfied = this.evaluateCondition(
              value.requires,
              move.target,
            );

            if (condition_satisfied) {
              let effect_name = key.replace("conditional", "");
              effect_name =
                effect_name.charAt(0).toLowerCase() + effect_name.slice(1);

              steps_of_effects.push({
                key: effect_name,
                value: value.amount,
                target: move.target,
                type: move.type,
              });
            }
          } else if (key != "condition" && key != "duration") {
            steps_of_effects.push({
              key: key,
              value: value,
              target: move.target,
              hits: effects.hits,
              duration: effects.duration,
              condition: effects.condition,
              type: move.type,
            });
          }
        }
      }
    }

    return steps_of_effects;
  }

  passTurn() {
    this.previousMoves.push(this.currentMove);
    this.currentMove = [];

    this.block = 0;

    this.logicDeck.reshuffleAll();
    this.logicDeck.draw(this.startingLogicCount);

    this.cardDeck.discardHand();
    this.cardDeck.draw(this.startingSpellCount + this.extraDraws);

    this.energy = this.maxEnergy;
  }
}

export const ITEMLIST = {
  pick: (name) => {
    return structuredClone(ITEMLIST.items[name]);
  },
  pickRandom: () => {
    var keys = Object.keys(ITEMLIST.items);
    const item = ITEMLIST.items[keys[(keys.length * Math.random()) << 0]];
    return item;
  },
  items: {
    "Rubber Duck": { name: "Rubber Duck" },
  },
};
