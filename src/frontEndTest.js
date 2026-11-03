import { CARDLIST } from './card.js'
import { customizeCardFrontend, createCardFrontend, updateCardFrontend, attach_interaction, createCardBlockFrontend, setCardImageFrontend} from './cardFrontend.js'
import { setPosition, addClass, removeClass } from './generalFrontend.js'


let cardData = CARDLIST.pick("Fireball")
let cardFront = createCardFrontend()
let cardBlock = createCardBlockFrontend(cardFront)

addClass(cardBlock, "hidden")

customizeCardFrontend(cardFront, cardData)
document.body.appendChild(cardFront)
setPosition(cardFront, [50, 10])
setCardImageFrontend(cardFront, cardData)

addClass(cardFront, "card-selectable")
updateCardFrontend(cardFront, cardData)
attach_interaction(cardFront)