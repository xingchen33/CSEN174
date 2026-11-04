import { createVisualCardDeck } from './deckFrontend.js'
import CardDeck from './cardDeck.js'

const action_cards = new CardDeck("fireballer")

action_cards.draw(5)
createVisualCardDeck(action_cards)