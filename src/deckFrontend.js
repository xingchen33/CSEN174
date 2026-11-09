import { generateVisualCard, attach_interaction, drawCardVisual, playCardVisual } from "./cardFrontend.js";
import { setPosition } from "./generalFrontend.js";

// MAY NEED LARGE CHANGES
export function createVisualCardDeck(input_deck){
    input_deck.hand.forEach((card, index) => {
        let cardFront = generateVisualCard(card)
        document.body.appendChild(cardFront)
    });
    input_deck.drawPile.forEach(card => {
        let cardFront = generateVisualCard(card)
        document.body.appendChild(cardFront)
    });
}

export function updateVisualCardDeck(input_deck, location){
    let card_hand_location = document.getElementById("logic-card-play-hand");
    let card_draw_location = document.getElementById("logic-card-draw-pile")
    if (location == "action") {
        card_hand_location = document.getElementById("action-card-play-hand");
        card_draw_location = document.getElementById("action-card-draw-pile")
    }
    
    input_deck.hand.forEach((card,index) => {
        let cardFront = document.getElementById(card.id);
        playCardVisual(cardFront)
        attach_interaction(cardFront)
        card_hand_location.appendChild(cardFront)
        if (cardFront.parentElement != document.getElementById("code-zone"))
            setPosition(cardFront, [100*index/(input_deck.hand.length),0])
        cardFront.style.zIndex = index+1
    });
    input_deck.drawPile.forEach(card => {
        let cardFront = document.getElementById(card.id);
        drawCardVisual(cardFront)
        card_draw_location.appendChild(cardFront)
    });
}