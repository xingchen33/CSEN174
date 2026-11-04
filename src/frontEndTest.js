import { CARDLIST } from './card.js'
import { styleCardFrontend, createCardFrontend, updateCardFrontend, attach_interaction, createCardBlockFrontend, setCardImageFrontend} from './cardFrontend.js'
import { createVisualCardDeck } from './deckFrontend.js'
import { setPosition, addClass, removeClass } from './generalFrontend.js'
import CardDeck from './cardDeck.js'


// let cardData = CARDLIST.pick("Fireball")
// let cardFront = createCardFrontend()
// let cardBlock = createCardBlockFrontend(cardFront)

// addClass(cardBlock, "hidden")

// styleCardFrontend(cardFront, cardData)
// document.body.appendChild(cardFront)
// setPosition(cardFront, [50, 10])
// setCardImageFrontend(cardFront, cardData)

// addClass(cardFront, "card-selectable")
// updateCardFrontend(cardFront, cardData)
// attach_interaction(cardFront)

const action_cards = new CardDeck("fireballer")
console.log(action_cards)
createVisualCardDeck(action_cards)