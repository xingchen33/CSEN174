import {addClass} from 'generalFrontend.js'

export function createCardFrontend(card) {
    /** 
    * @param {Card} card - The card to be visualized
    */

    card_base = document.createElement("div")
    addClass(card_base, "card-base")

    card_contents = document.createElement("div")
    addClass(card_contents, "card-front-contents", "card-item")
    card_base.appendChild(card_contents)

    card_name = document.createElement("div")
    addClass(card_name, "card-name", "card-item")
    card_contents.appendChild(card_name)

    card_image = document.createElement("img")
    card_image.classList.add("card-image", "card-type")
    card_contents.appendChild(card_image)

    card_type = document.createElement("div")
    card_type.classList.add("card-item", "card-type")
    card_contents.appendChild(card_type)

    card_description = document.createElement("div")
    addClass("card_description", "card-description", "card-item")
    card_contents.appendChild(card_description)

    card_energy = document.createElement("div")
    card_energy.classList.add("card-energy", "card-item")
    card_contents.appendChild(card_energy)

    card_back = document.createElement('img')
    addClass(card_back, "card-back", "card-item")
    card_contents.appendChild(card_back)

    customizeCardFrontend(card_base, card)

    updateCardFrontend(card_base, card)

    return card_base;
}

export function customizeCardFrontend(card_base, card){
    return;
}

export function updateCardFrontend(card_base, card) {
    return;
}

export function getCardFrontendItem(card_base,  item){
    let valid_inputs = ["name", "image", "type", "description", "back"]

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