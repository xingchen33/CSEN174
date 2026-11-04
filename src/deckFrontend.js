import { generateVisualCard } from "./cardFrontend.js";
import { addClass } from "./generalFrontend.js";

// MAY NEED LARGE CHANGES
export function createVisualCardDeck(input_deck, format=[50,70,20]){
    let myCards = []
    input_deck.hand.forEach(card => {
        let cardFront = generateVisualCard(card)
        addClass(cardFront, "card-selectable")
        myCards.push(cardFront)
        document.body.appendChild(cardFront)
    });
    input_deck.drawPile.forEach(card => {
        let cardFront = generateVisualCard(card)
        console.log(cardFront)
        addClass(cardFront, "flipped")
        myCards.push(cardFront)
        document.body.appendChild(cardFront)
    });
    return myCards
}