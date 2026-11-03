import { CARDLIST } from './card.js'
import { customizeCardFrontend, createCardFrontend } from './cardFrontend.js'
import { setPosition } from './generalFrontend.js'


let cardData = CARDLIST.pick("Fireball")
let cardFront = createCardFrontend()
customizeCardFrontend(cardFront, cardData)
setPosition(cardFront, [10, 10])