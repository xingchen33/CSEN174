class Card {
    /**
   * @param {string} type - The card type ("l" or "e")
   * @param {number} name - The card name
   * @param {string} description - The card description
   * @param {array} effects - The effects for the card
   * @param {number} energy - The card energy cost
   * @param {object} customization - Customization options for the card (e.g., background color)
   * @param {object} tags - Tags associated with the card
   */
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

        this.rotation = 0           // rotation of card's visuals
        
        this.selectable = true      // card can be selected by player
    }

    backToDraw(){
        /* 
        Animation to move card back to the draw pile
        * also set this.discarded to false so card is collected from discard pile 
        */
        this.discarded = false          // remove from discarded pile
        /*
        Run animation
        */
        this.moveAnimation(             
            new Animation(
                {
                    "coords": this.player.drawPile.origin, 
                    "time": 1.5,
                    "onEnd": this.player.updateAllCardDisplays // not working
                }))
    }

    discard(){
        /*
        Animation to move card to the discard pile
        * also set this.discarded to true so collected to place in discard pil
        */
        this.discarded = true           // add to discard pile
        /*
        Run animation
        */
        this.moveAnimation(
            new Animation(
                {
                    "coords": this.player.discardPile.origin, 
                    "time": 1.5,
                    "onEnd": this.player.updateAllCardDisplays // not working
                }))
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
    }
    shiftLocation(shift=[0,0]){
        this.cardPos[0] += shift[0]
        this.cardPos[1] += shift[1]
    }
    getLocation(){
        return this.cardPos
    }
    
    setRotation(r){
        this.rotation = r
    }
    adjustRotation(n){
        this.rotation += n
    }
    getRotation(){
        return this.rotation
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
}    

module.exports = Card;
