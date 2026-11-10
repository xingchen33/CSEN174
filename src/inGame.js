import { createVisualCardDeck, updateVisualCardDeck } from './deckFrontend.js'
import { generateVisualEntity, setCharacterSide} from './entityFrontend.js'
import CardDeck from './cardDeck.js'
import Player from './player.js'

let action_cards = new CardDeck("fireballer")
let logic_cards = new CardDeck("empty")

let current_player = new Player(1,1, action_cards, logic_cards, [], "./assets/player.png")

export function playerSetup(input_player){
    let player_base = generateVisualEntity(input_player)
    setCharacterSide(player_base, input_player)

    createVisualCardDeck(input_player.cardDeck);
    createVisualCardDeck(input_player.logicDeck);

    updateVisualCardDeck(input_player.cardDeck, "action");
    updateVisualCardDeck(input_player.logicDeck, "logic");
}

playerSetup(current_player)