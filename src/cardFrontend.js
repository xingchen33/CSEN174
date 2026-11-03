import {addClass, get_mouse_position, getPosition, setPosition, getDistance, removeClass} from './generalFrontend.js'

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
    addClass(card_image, "card-image", "card-type")
    card_contents.appendChild(card_image)

    let card_type = document.createElement("div")
    addClass(card_type, "card-item", "card-type")
    card_contents.appendChild(card_type)

    let card_description = document.createElement("div")
    addClass(card_description, "card-description", "card-item")
    card_contents.appendChild(card_description)

    let card_energy = document.createElement("div")
    addClass(card_energy, "card-energy", "card-item")
    card_contents.appendChild(card_energy)

    let card_back = document.createElement('img')
    addClass(card_back, "card-back", "card-item")
    card_contents.appendChild(card_back)

    return card_base;
}

export function createCardBlockFrontend(card_base){
    let card_block_base = document.createElement("div")
    addClass(card_block_base, "card-block-base", "card-item")
    card_base.appendChild(card_block_base) 
    return card_block_base
}

export function customizeCardFrontend(card_base, card){
    let cardElements = ["name", "type", "description", "energy"];
    let elementModifications = ["bg-color", "text-color", "b-color"];
    Object.keys(card.customization).forEach(elementName => {
        let elementCustomization = card.customization[elementName];

        if (cardElements.includes(elementName)){
            let element = getCardFrontendItem(card_base, elementName);

            Object.keys(elementCustomization).forEach(modification => {
                let value = elementCustomization[modification];
                if (modification == "bg-color")
                    element.style.backgroundColor = value;
                
                else if (modification == "text-color")
                    element.style.color = value;

                else if (modification == "b-color")
                    element.style.color = value;

                if (elementModifications.includes(modification) == false)
                    throw new Error(`Invalid card modification: ${modification}`);
            })
        }
    });
    return;
}

export function updateCardFrontend(card_base, card) {
    setCardNameFrontend(card_base, card);
    setCardDescriptionFrontend(card_base, card);
    setCardEnergyFrontend(card_base, card);
    return;
}

export function setCardNameFrontend(card_base, card) {
    let card_name = getCardFrontendItem(card_base, "name");
    card_name.innerText = card.name;
}

export function setCardDescriptionFrontend(card_base, card){
    let card_description = getCardFrontendItem(card_base, "description");
    card_description.innerText = card.getDescription();
}

export function setCardEnergyFrontend(card_base, card){
    let card_energy = getCardFrontendItem(card_base, "energy");
    card_energy.innerText = card.getEnergy();
}

export function getCardFrontendItem(card_base,  item){
    let valid_inputs = ["name", "image", "type", "description", "back", "energy"]

    if (item == "base")
        return card_base

    else if (item == "contents")
        return card_base.querySelector(".card-front-contents")

     else if (item == "block")
        return card_base.querySelector(".card-block-base")

    else if (valid_inputs.includes(item))
        return card_base.querySelector(`.card-${item}`)

    throw new Error(`Invalid card element: ${item}`);
}

export function getNearestElementofClass(class_name, coords, excludedElements=[], maxRange=100){
    let elements = document.getElementsByClassName(class_name);
    if (elements.length ==0)
        return null;

    let new_distance = getDistance(getPosition(elements[0]), coords);
    let smallest_distance = new_distance;
    let closestElement = elements[0]
    
    for (let element of elements) {
        if (excludedElements.includes(element) == false){
            new_distance = getDistance(getPosition(element), coords);
            if (smallest_distance <= new_distance){
                smallest_distance = new_distance;
                closestElement = element;
            }
        }
    };

    if (smallest_distance>maxRange)
        return null;

    return closestElement;
}

export function assignSubCard(parentCard, childCard){
    return;
}

export function attach_interaction(card){
    card.onmousedown = card_interaction;
    card.ontouchstart = card_interaction;
}

export function card_interaction(){
    card_drag_and_drop(this)
}

export function card_drag_and_drop(card_base){
    let card_home = getPosition(card_base)
    let initial_click = get_mouse_position()
    let drag_offset = [-3, -10]
    // let drag_offset = [card_home[0] - initial_click[0], card_home[1] - initial_click[1]]

    let card_block = getCardFrontendItem(card_base, "block")
    let card_contents = getCardFrontendItem(card_base, "contents")

    document.onmousemove = card_drag;
    document.ontouchmove = card_drag;
    document.onmouseup = card_drop;
    document.ontouchend = card_drop;

    function card_drag(){
        let current_mouse = get_mouse_position()
        setPosition(card_base, [current_mouse[0]+drag_offset[0], current_mouse[1]+drag_offset[1]])
        addClass(card_contents, "hidden")
        removeClass(card_base, "card-selectable")
        removeClass(card_block, "hidden")
    }

    function card_drop(){
        setPosition(card_base, card_home)

        document.onmousemove = null;
        document.ontouchmove = null;
        document.onmouseup = null;
        document.ontouchend = null;

        addClass(card_block, "hidden")
        addClass(card_base, "card-selectable")
        removeClass(card_contents, "hidden")
        // console.log(getNearestElementofClass("card-base", [0,0]))
    }
}