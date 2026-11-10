import { createVisualCardDeck, updateVisualCardDeck } from './deckFrontend.js'
import CardDeck from './cardDeck.js'
import Player from './player.js'

let action_cards = new CardDeck("fireballer")
let logic_cards = new CardDeck("empty")

let current_player = new Player(1,1, action_cards, logic_cards, [])


createVisualCardDeck(current_player.cardDeck)
createVisualCardDeck(current_player.logicDeck)

updateVisualCardDeck(current_player.cardDeck, "action")
updateVisualCardDeck(current_player.logicDeck, "logic")