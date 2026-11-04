import { generateVisualCard, attach_interaction, drawCardVisual } from "./cardFrontend.js";
import { addClass, setPosition } from "./generalFrontend.js";

// MAY NEED LARGE CHANGES
export function createVisualCardDeck(input_deck, hand=[50,60,20], draw=[60,60]){
    let myCards = []
    input_deck.hand.forEach((card, index) => {
        let cardFront = generateVisualCard(card)
        myCards.push(cardFront)
        document.body.appendChild(cardFront)
        setPosition(cardFront, [hand[0]+(index*hand[2]/input_deck.hand.length), hand[1]])
        attach_interaction(cardFront)
    });
    input_deck.drawPile.forEach(card => {
        let cardFront = generateVisualCard(card)
        drawCardVisual(cardFront)
        myCards.push(cardFront)
        document.body.appendChild(cardFront)
        setPosition(cardFront, draw)
    });
    return myCards
}
