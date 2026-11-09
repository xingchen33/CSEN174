import { createVisualCardDeck, updateVisualCardDeck } from './deckFrontend.js'
import CardDeck from './cardDeck.js'

const action_cards = new CardDeck("fireballer")

action_cards.draw(3)

createVisualCardDeck(action_cards)

updateVisualCardDeck(action_cards, "action")
