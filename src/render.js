import Card from "./card.js";
import Player from "./player.js";
import Enemy from "./enemy.js";

// burnEffect = new Effect("Burning", "1 Damage over time ", example, 1)
const burnEffect = null
function dmg(q){
    return {
        "name": "Damage",
        "quantity": q
    }
}
const player = new Player()

const LIGHTCOLOR1 = "#f2e6c4"
const LIGHTCOLOR2 = "#f5dd9a"
const NATURALCOLOR1 = "#c1f59a"
const NATURALCOLOR2 = "#9ad96a"
const DARKCOLOR1 = "#cf6ee0"
const DARKCOLOR2 = "#7c3d87"

const cardList = {
    "Fireball": ["l", "Fireball", `{dmg} Damage`,[burnEffect, dmg(6)], 2, {"bg": NATURALCOLOR2, "lbg": NATURALCOLOR1, "cdbg": NATURALCOLOR1}, ["Natural"]],
    "EtherPupil": ["e", "Ether Pupil", "Play a natural card from your hand", [], 1, {"bg": NATURALCOLOR2, "lbg": NATURALCOLOR1, "cdbg": NATURALCOLOR1}, ["Natural"]],
    "CompiledTome": ["e", "CompiledTome", "Each turn, when you reuse a previous function for the first time, +1 energy.", [], 0, {"bg": NATURALCOLOR2, "lbg": NATURALCOLOR1, "cdbg": NATURALCOLOR1}, ["Natural"]],
    "CuredWound": ["e", "Cure Wound", "Combo (2) : Next turn, create a Cure Wound (Ritual) to your hand.", [], 1, {"bg": LIGHTCOLOR2, "lbg": LIGHTCOLOR1, "cdbg": LIGHTCOLOR1}, ["Light"]],
    "SacredMark": ["e", "Sacred Mark", "Each turn, when you heal for the first time, gives all enemy power -2.", [], 1, {"bg": LIGHTCOLOR2, "lbg": LIGHTCOLOR1, "cdbg": LIGHTCOLOR1}, ["Light"]],
    "MindShock": ["e", "Mind Shock", `Deal {dmg} damage to 1 enemy.`, [dmg(6)], 2, {"bg": DARKCOLOR2, "lbg": DARKCOLOR1, "cdbg": DARKCOLOR1}, ["Dark"]],
    "CentipedeSacrifice": ["e", "Centipede Sacrifice", `Each turn, when you receive damage for the first time, gains power +2.`, [], 2, {"bg": DARKCOLOR2, "lbg": DARKCOLOR1, "cdbg": DARKCOLOR1}, ["Dark"]],
}

function makeCard(name){

    return new Card(cardList[name][0], cardList[name][1], cardList[name][2], cardList[name][3], cardList[name][4], cardList[name][5], cardList[name][6])
}

let b1 = document.createElement("button")
b1.addEventListener("click", function(){
    player.addCard(makeCard(Object.keys(cardList)[Math.floor(Math.random()*Object.keys(cardList).length)]), true)
    player.updateAllCardDisplays()
})
document.body.appendChild(b1)
let b2 = document.createElement("button")
b2.addEventListener("click", function(){
    player.addCard(makeCard("Fireball"), true)
    player.updateAllCardDisplays()
})
document.body.appendChild(b2)

let b3 = document.createElement("button")
b3.addEventListener("click", function(){
    player.draw()
})
document.body.appendChild(b3)

let b4 = document.createElement("button")
b4.addEventListener("click", function(){
    player.reviveCards()
})
document.body.appendChild(b4)


const settingsBTN = document.createElement("img")
settingsBTN.classList.add("settingsButton")
settingsBTN.src = "./assets/67.png"
document.body.appendChild(settingsBTN)


function visualizePlayer (player, coords=[10, 30]){
  player.setLocation(coords)
  let vis = document.createElement("img")
  vis.src = player.image
  vis.classList.add("playerImg")
  vis.style.left = String(player.coords[0]) + "%"
  vis.style.top = String(player.coords[1]) + "%"
  document.body.appendChild(vis)
  return vis
}


const myEnemies = [];
const enemy1 = new Enemy();
enemy1.setLocation([60,30]);
