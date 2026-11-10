import { CARDLIST } from "./card.js";
import SimpleDeck from "./simpleDeck.js";

const CARD_PRESETS = {
  "empty": [],
  "basic": [
    CARDLIST.pick("Fireball"),
    CARDLIST.pick("Curse"),
    CARDLIST.pick("Cure Wound"),
    CARDLIST.pick("Mind Shock"),
    CARDLIST.pick("Fuel"),
    CARDLIST.pick("Bondage"),
  ]
};

export default class CardDeck extends SimpleDeck {
  constructor (preset){
    super("empty");

    // It is POSSIBLE this is more structured cloning than needs to happen
    // "Top" of the deck is drawPile[0]
    this.drawPile = CARD_PRESETS[preset].map((card) => {
      const copy = structuredClone(card);
      Object.setPrototypeOf(copy, Object.getPrototypeOf(card));
      return copy;
    });
    this.hand = [];
    // More recently discarded cards go at the end of the graveyard
    this.graveyard = [];
  }

  refill() {
    this.drawPile.push(...this.graveyard);
    this.graveyard = [];
  }

  // ASK about hand limit mechanics
  /**
   * @param {number} refill - Should the graveyard be shuffled back into the deck?
   */
  draw(n){
    // Normal behavior
    if (n <= this.drawPile.length) {
      this.hand.push(...this.drawPile.slice(0, n));
      this.drawPile = this.drawPile.slice(n);
      return;
    }

    // Draw then, reshuffle deck
    let remaining = n - this.drawPile.length;
    this.hand.push(...this.drawPile);
    this.drawPile = [];
    this.refill();
    this.shuffleDeck();

    // Finish drawing
    if (remaining <= this.drawPile.length) {
      this.hand.push(...this.drawPile.slice(0, remaining));
      this.drawPile = this.drawPile.slice(remaining);
      return;
    }

    this.hand.push(...this.drawPile);
    this.drawPile = [];
    // No cards remaining to draw
  }

  discardHand() {
    this.graveyard.push(...this.hand);
    this.hand = [];
  }

  discard(count, pos) {
    if (count != pos.length) {
      console.log(`Cannot discard ${count} cards at positions: ${pos}`);
      return;
    }

    if (pos.some((e) => e < 0 || e >= this.hand.length)) {
      console.log(`Cannot discard at posisition ${pos} when hand has ${this.hand.length} card(s)`);
      return;
    }

    this.graveyard.push(...this.hand.filter((_, i) => { return pos.includes(i) }));
    this.hand = this.hand.filter((_, i) => { return !pos.includes(i) });
  }
}
