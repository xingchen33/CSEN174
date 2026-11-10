import { hasClass } from "./generalFrontend.js"
import Player from "./player.js"
import Enemy from "./enemy.js"

export function generateVisualEntity(input_character){
    let character_base = createCharacterFrontend(input_character)
    updateHealthFrontend(character_base, input_character)
    return character_base
}

export function createCharacterFrontend(input_character){
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

    character_image.src = input_character.image
    
    character_base.appendChild(character_image)

    let character_base_health = document.createElement("div")
    character_base_health.classList.add("health-bar-base")
    character_base.appendChild(character_base_health)
    
    let character_fill_health = document.createElement("div")
    character_fill_health.classList.add("health-bar-fill")
    character_base_health.appendChild(character_fill_health)

    let character_health_label = document.createElement("p")
    character_health_label.classList.add("health-bar-label")
    character_base_health.appendChild(character_health_label)

    return character_base
}

export function updateHealthFrontend(character_base, input_character){
    let character_fill_health = getCharacterFrontendItem(character_base, "healthFill")
    let character_health_label = getCharacterFrontendItem(character_base, "healthLabel")
    
    character_fill_health.style.width = String(100*input_character.health/input_character.maxHealth) +"%"
    character_health_label.innerText = `${input_character.health} / ${input_character.maxHealth}`
}

export function getCharacterFrontendItem(character_base,  item){
    let valid_inputs = ["base", "image", "healthBase", "healthFill", "healthLabel"]

    if (item == "base")
        return character_base

    else if (item == "image"){
        if (hasClass(character_base, ".enemy-base"))
            return character_base.querySelector(".enemy-image")
        else if (hasClass(character_base, ".player-base"))
            return character_base.querySelector(".player-image")
    }
    else if (item == "healthBase")
        return character_base.querySelector(".health-bar-base")

    else if (item == "healthFill")
        return character_base.querySelector(".health-bar-base").querySelector(".health-bar-fill")
    
    else if (item == "healthLabel")
        return character_base.querySelector(".health-bar-base").querySelector(".health-bar-label")
    

    throw new Error(`Invalid element: ${item}`);
}

export function setCharacterSide(character_base, input_character){
    if (input_character instanceof Player){
        let player_container = document.getElementById("player-container");
        player_container.appendChild(character_base)
    }

    else if (input_character instanceof Enemy){
        let enemy_container = document.getElementById("enemy-container");
        enemy_container.appendChild(character_base)
    }
}