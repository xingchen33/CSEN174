import { generateVisualCard } from "./cardFrontend";

// MAY NEED LARGE CHANGES
export function createVisualCardDeck(input_deck, format=[50,70,20]){
    let myCards = []
    input_deck.hand.forEach(card => {
        let cardFront = generateVisualCard(card)
        myCards.push(cardFront)
    });
    return myCards
}