import { createVisualCardDeck } from './deckFrontend.js'
import CardDeck from './cardDeck.js'

const action_cards = new CardDeck("fireballer")
const logic_cards = new CardDeck("fireballer")

action_cards.draw(5)
logic_cards.draw(7)

createVisualCardDeck(action_cards)
createVisualCardDeck(logic_cards,[20,60,10], [5,60])