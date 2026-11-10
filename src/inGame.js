import { attach_cards_to_player, createVisualCardDeck, updateVisualCardDeck } from './deckFrontend.js'
import { generateVisualEntity, setCharacterSide} from './entityFrontend.js'
import CardDeck from './cardDeck.js'
import Player from './player.js'
import Enemy from './enemy.js'

let action_cards = new CardDeck("fireballer")
let logic_cards = new CardDeck("empty")

let current_player = new Player(100, 5, action_cards, logic_cards, [], "./assets/player.png")

current_player.cardDeck.draw(3)

let current_enemy = new Enemy(10, 5, "dude", "./assets/bell.png")

export function playerSetup(input_player){
    let player_base = generateVisualEntity(input_player)
    setCharacterSide(player_base, input_player)

    createVisualCardDeck(input_player.cardDeck);
    createVisualCardDeck(input_player.logicDeck);

    updatePlayerFrontendCards(input_player)

    attach_cards_to_player(input_player.cardDeck, input_player)
    attach_cards_to_player(input_player.logicDeck, input_player)
}

export function updatePlayerFrontendCards(input_player){
    updateVisualCardDeck(input_player.cardDeck, "action");
    updateVisualCardDeck(input_player.logicDeck, "logic");
}

export function enemySetup(input_enemy){
    let enemy_base = generateVisualEntity(input_enemy)
    setCharacterSide(enemy_base, input_enemy)
}

playerSetup(current_player)

enemySetup(current_enemy)