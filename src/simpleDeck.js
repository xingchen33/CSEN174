import { LOGICLIST } from "./card.js";

const LOGIC_PRESETS = {
  "empty": [],
  "fireballer": [
    LOGICLIST.pick("If"),
    LOGICLIST.pick("If"),
    LOGICLIST.pick("While"),
  ]
};

export default class SimpleDeck {
  /**
   * @param {number} preset - Which of the deck presets to use
   */
  constructor (preset){
    this.preset = preset;

    // It is POSSIBLE this is more structured cloning than needs to happen
    // "Top" of the deck is drawPile[0]
    this.drawPile = LOGIC_PRESETS[preset].map((card) => {
      const copy = structuredClone(card);
      Object.setPrototypeOf(copy, Object.getPrototypeOf(card));
      return copy;
    });
    this.hand = [];
  }

  shuffleDeck() {

    // Source - https://stackoverflow.com/a/12646864
    // Posted by Laurens Holst, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-10-24, License - CC BY-SA 4.0
    for (let i = this.drawPile.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.drawPile[i], this.drawPile[j]] = [this.drawPile[j], this.drawPile[i]];
    }
  }

  // TODO Ask about hand limit mechanics
  draw(n){
    // Normal behavior
    if (n <= this.drawPile.length) {
      this.hand.push(...this.drawPile.slice(0, n));
      this.drawPile = this.drawPile.slice(n);
      return;
    }
    
    // Draw everything you can
    this.hand.push(...this.drawPile);
    this.drawPile = [];
  }

  discard(count, pos) {
    if (count != pos.length) {
      console.log(`Cannot discard ${count} cards at positions: ${pos}`);
      return;
    }

    if (pos.every((e) => {e < this.hand.length})) {
      console.log(`Cannot discard at posisition ${pos} when hand has ${this.hand.length} card(s)`);
      return;
    }

    this.drawPile.push(...this.hand.filter((_, i) => { return pos.includes(i) }));
    this.hand = this.hand.filter((_, i) => { return !pos.includes(i) });
  }
}
