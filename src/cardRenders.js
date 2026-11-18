import { CARDLIST } from "./card.js";
import { generateVisualCard } from "./cardFrontend.js";

Object.keys(CARDLIST.cards).forEach(card => {
    let card_base = generateVisualCard(CARDLIST.cards[card])
    document.body.appendChild(card_base)
});