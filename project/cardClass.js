STANDARDANIMATIONRATE = 24

export class Card {
    constructor (type, name, description, effects, energy, customization={}, tags={}){
        this.type = type
        this.name = name 
        this.description = description
        this.effects = effects
        this.energy = energy 
        this.customization = customization
        this.cardPos = [0,0]
        this.discarded = false
        this.player = null
        // this.effects.forEach((effect) => {
        //     console.log(effect)
        // })
        this.tags = this.tags
        this.card = this.show()
        this.card.addEventListener("click", ()=>{
            if (this.selectable){ // EXAMPLE FUNCTION
                // if (this.card.classList.contains("flipped")){
                //     this.card.classList.remove("flipped")
                // }
                // else {
                //     this.card.classList.add("flipped")
                // }
                this.discard();
            }
        })

        this.rotation = 0
        
        this.selectable = true

        this.updateCardVisual()
    }

    backToDraw(){
        this.discarded = false
        this.card.style.zIndex = 100000
        this.moveAnimation(
            new Animation(
                {
                    "coords": this.player.drawPile.origin, 
                    "time": 1.5,
                    "onEnd": this.player.updateAllCardDisplays // not working
                }))
    }

    discard(){
        // may want to add a cooldown
        this.discarded = true
        this.card.style.zIndex = 100000
        this.moveAnimation(
            new Animation(
                {
                    "coords": this.player.discardPile.origin, 
                    "time": 1.5,
                    "onEnd": this.player.updateAllCardDisplays // not working
                }))
        // this.player.updateAllCardDisplays()
    }

    updateCardVisual(){
        if (this.player == null){
            this.hidden()
            return
        }
        this.shown()
        if (this.selectable == true)
            this.card.classList.add("cardSelectable")
        else 
            this.card.classList.remove("cardSelectable")

        
        if (this.getActualEnergy() == 0)
            this.hideEnergy()
        // else 
        //     this.showEnergy()

        // this.card.style.transform = "rotate(" + String(this.rotation) + "deg)"

        this.card.style.left = String(this.cardPos[0]) + "%"
        this.card.style.top = String(this.cardPos[1]) + "%"

    }

    show(){
        return visualize(this)
    }
    getActualDamage(){
        return "placeholder"
    }

    getActualEnergy(){
        return this.energy // just here for now, we can modify later of course
    }
    setLocation(x,y){
        this.cardPos[0] = x
        this.cardPos[1] = y
        this.updateCardVisual()
    }
    shiftLocation(shift=[0,0]){
        this.cardPos[0] += shift[0]
        this.cardPos[1] += shift[1]
        this.updateCardVisual()
    }
    getLocation(){
        return this.cardPos
    }
    
    setRotation(r){
        this.rotation = r
        this.updateCardVisual()
    }
    adjustRotation(n){
        this.rotation += n
        this.updateCardVisual()
    }
    getRotation(){
        return this.rotation
    }
    hideEnergy(){
        this.card.cNRG.style.display= "none";
    }
    showEnergy(){
        this.card.cNRG.style.display= "block";
    }
    moveAnimation(destinations){
        return
        
    }
    moveAnimation(destination){
        let initialCoords = this.getLocation()
        let frames = destination.time*STANDARDANIMATIONRATE
        let stepSize = [
            (destination.coords[0] - initialCoords[0])/frames,
            (destination.coords[1] - initialCoords[1])/frames
        ]
        this.animationFrame(stepSize, destination.onEnd, frames)
    }
    animationFrame(change, onEnd, framesRemaining){
        if (framesRemaining == 0){
            // onEnd()
            this.player.updateAllCardDisplays()
            return
        }
        this.shiftLocation(change)
        setTimeout(() => {this.animationFrame(change, onEnd, framesRemaining-1)}, 100/STANDARDANIMATIONRATE);
        return
    }
    
    hidden(){
        this.card.style.display = "none"
    }
    shown(){
        this.card.style.display = "block"
    }
}

     
export function visualize(selected_card){
    cardBase = document.createElement("div")
    cardBase.classList.add("cardBase")
    cardBase.style.position = "absolute"
    // cardBase.style.transformOrigin = "0 0"

    cardContents = document.createElement("div")
    cardContents.classList.add("cardContents","cardItem")
    if (Object.hasOwn(selected_card.customization, "bg")){
        cardContents.style.background = selected_card.customization["bg"]
    }

    cardBack = document.createElement('img')
    cardBack.src = "pokemon.png"
    cardBack.classList.add("cardBack", "cardItem")
    
    cardName = document.createElement("div")
    cardName.classList.add("cardName","cardItem")
    cardName.innerText = selected_card.name
    if (Object.hasOwn(selected_card.customization, "lbg")){
        cardName.style.background = selected_card.customization["lbg"]
    }

    cardDesc = document.createElement("div")
    cardDesc.classList.add("cardDesc","cardItem")
    cardDesc.innerText = selected_card.description
    if (Object.hasOwn(selected_card.customization, "cdbg")){
        cardDesc.style.background = selected_card.customization["cdbg"]
    }

    cardEnergy = document.createElement("div")
    cardEnergy.classList.add("cardNRG", "cardItem")
    cardEnergy.innerText = selected_card.getActualEnergy()
    if (Object.hasOwn(selected_card.customization, "nrgbg")){
        cardEnergy.style.background = selected_card.customization["nrgbg"]
    }

    document.body.appendChild(cardBase)
    cardBase.appendChild(cardContents)
    cardBase.cBack = (cardBack)
    cardBase.appendChild(cardBack)

    cardBase.cName = cardName
    cardContents.appendChild(cardName)
    cardBase.cDesc = cardDesc
    cardContents.appendChild(cardDesc)
    cardBase.cNRG = cardEnergy
    cardContents.appendChild(cardEnergy)

    return cardBase
}
    