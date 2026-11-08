import { hasClass } from "./generalFrontend"

function generateVisualCharacter(input_character){
    let character_base = createCharacterFrontend(input_character)
    updateHealthFrontend(character_base, input_character)
    return character_base
}

function createCharacterFrontend(input_character){
    let character_base = document.createElement("div")
    let character_image = document.createElement("img")

    if (input_character instanceof Player){
        character_base.classList.add("player-base")
        character_image.classList.add("player-image")
    }
    else if (input_character instanceof Enemy){
        character_base.classList.add("enemy-base")
        character_image.classList.add("enemy-image")
    }
    
    character_base.appendChild(character_image)

    let character_empty_health = document.createElement("div")
    character_empty_health.classList.add("health-bar-base")
    character_base.appendChild(character_empty_health)

    let character_fill_health = document.createElement("div")
    character_fill_health.classList.add("health-bar-fill")
    character_empty_health.appendChild(character_fill_health)

    let character_health_label = document.createElement("p")
    character_health_label.classList.add("health-bar-label")
    character_empty_health.appendChild(character_health_label)

    return character_base
}

function updateHealthFrontend(character_base, input_character){
    let character_empty_health = getCharacterFrontendItem(character_base, "healthEmpty")
    let character_health_label = getCharacterFrontendItem(character_base, "healthLabel")

    character_empty_health.style.width = String(input_character.health/input_character.maxHealth) +"%"
    character_health_label.innerText = `${input_character.health} / ${input_character.maxHealth}`
}

export function getCharacterFrontendItem(character_base,  item){
    let valid_inputs = ["base", "image", "healthFill", "healthEmpty", "healthLabel"]

    if (item == "base")
        return character_base

    else if (item == "image"){
        if (hasClass(character_base, ".enemy-base"))
            return character_base.querySelector(".enemy-image")
        else if (hasClass(character_base, ".player-base"))
            return character_base.querySelector(".player-image")
    }
    else if (item == "healthFill")
        return character_base.querySelector(".health-bar-base")

    else if (item == "healthEmpty")
        return character_base.querySelector(".health-bar-base").querySelector(".health-bar-empty")
    
    else if (item == "healthEmpty")
        return character_base.querySelector(".health-bar-base").querySelector(".health-bar-label")
    

    throw new Error(`Invalid element: ${item}`);
}