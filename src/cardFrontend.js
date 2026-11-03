import {addClass} from './generalFrontend.js'

export function createCardFrontend() {
    /** 
    * @param {Card} card - The card to be visualized
    */

    let card_base = document.createElement("div")
    addClass(card_base, "card-base")

    let card_contents = document.createElement("div")
    addClass(card_contents, "card-front-contents", "card-item")
    card_base.appendChild(card_contents)

    let card_name = document.createElement("div")
    addClass(card_name, "card-name", "card-item")
    card_contents.appendChild(card_name)

    let card_image = document.createElement("img")
    card_image.classList.add("card-image", "card-type")
    card_contents.appendChild(card_image)

    let card_type = document.createElement("div")
    card_type.classList.add("card-item", "card-type")
    card_contents.appendChild(card_type)

    let card_description = document.createElement("div")
    addClass(card_description, "card-description", "card-item")
    card_contents.appendChild(card_description)

    let card_energy = document.createElement("div")
    card_energy.classList.add("card-energy", "card-item")
    card_contents.appendChild(card_energy)

    let card_back = document.createElement('img')
    addClass(card_back, "card-back", "card-item")
    card_contents.appendChild(card_back)

    return card_base;
}

export function customizeCardFrontend(card_base, card){
    let cardElements = ["name", "type", "description", "energy"]
    let elementModifications = ["bg-color", "text-color", "b-color"]

    Object.keys(card.customization).forEach(elementName => {
        let elementCustomization = card.customization[elementName]

        if (cardElements.includes(elementName)){
            let element = getCardFrontendItem(card_base, elementName)

            Object.keys(elementCustomization).forEach(modification => {
                let value = elementCustomization[modification]
                if (modification == "bg-color")
                    element.style.backgroundColor = value
                
                else if (modification == "text-color")
                    element.style.color = value

                else if (modification == "b-color")
                    element.style.color = value

                if (elementModifications.includes(modification) == false)
                    throw new Error(`Invalid card modification: ${modification}`);
            })
        }
    });
    return;
}

export function updateCardFrontend(card_base, card) {
    return;
}

export function getCardFrontendItem(card_base,  item){
    let valid_inputs = ["name", "image", "type", "description", "back", "energy"]

    if (item == "base")
        return card_base

    else if (item == "contents")
        return card_base.querySelector(".card-front-contents")

    else if (valid_inputs.includes(item))
        return card_base.querySelector(`.card-${item}`)

    throw new Error(`Invalid card element: ${item}`);
}

export function getNearestCard(coords, maxRange=100){
    return;
}

export function assignSubCard(parentCard, childCard){
    return;
}