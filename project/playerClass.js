class Player {
    /** 
     * @param {*} image - player's image icon
     */
    constructor (image="pacman.jpeg"){
        this.LogicCards = new CardGroup("hand",{"spread": 20, "h": 5, "w": 20, "origin": [30,69]})  // holds the logic cards in hand
        this.EffectCards = new CardGroup("hand",{"spread": 20, "h": 5, "w": 20, "origin": [70,69]}) // holds the effect cards in hand
        this.drawPile = new CardGroup("pile", {"origin": [1,69]})           // draw pile, holds cards to be drawn
        this.discardPile = new CardGroup("pile", {"origin": [85, 69]})      // discard pile, holds discarded cards
        this.image = image              // src for img element of the character
        this.vis = this.visualize()     // the img element of the character
        this.coords = [0, 0]

        /* Healthbar is WORK IN PROGRESS */ 
        this.healthbar = new Healthbar(0,100)
        this.healthbar.attachSprite(this)
        this.healthbar.setLocation([10, 60])

    }

    addCard (card,drawPile=false){
        /*
        This method adds a card to either the draw pile, effect cards pile, or logic cards pile.
        */
        card.player = this                  // sets the card for player access
        if (drawPile==true){                // checks if card is to be sent to draw pile
            this.drawPile.addCard(card)     // send card to draw pile
            return
        }
        if (card.type == "l"){              // check if logic card
            this.LogicCards.addCard(card)   // add to logic card pile
        }           
        else {                              // all other cards
            this.EffectCards.addCard(card)  // go to effect cards pile
        }
    }
    addCards(cards, drawPile=false){
        /*
        Add many cards at once
        */
        cards.forEach(card => { 
            this.addCard(card, drawPile)
        });
    }

    draw() {
        /* 
        Draw card from draw pile
        */
        if (this.drawPile.cards.length == 0)    // check if any cards to draw
            return
        let card = this.drawPile.cards.pop()    // take card from draw pile
        this.addCard(card)                      // add card to correct hand

        /*
        Animation for drawing card 
        */
        let endpoint = [0,0]                    // default end for card moving animation

        if (card.type == "e"){                  // find target end for card moving animation
            endpoint = this.EffectCards.origin  // move to effect cards pile
        }
        if (card.type == "l"){
            endpoint = this.LogicCards.origin   // move to logic cards pile
        }
        card.card.style.zIndex = 10000          // move card to visual front
        card.moveAnimation(new Animation({"coords": endpoint, "time": 1, "onEnd": function(){}}))   // play animation
    }
    reviveCards(){
        /*
        Move all cards from discard pile to the draw pile
        */
        let discardCount = this.discardPile.cards.length    // get number of cards in discard pile
        for (let i =0; i<discardCount; i++){                // iterate through all cards in discard pile
            let card = this.discardPile.cards.pop()         // remove card from discard pile
            card.backToDraw()                               // move card to draw pile (animation)
            this.addCard(card,true)                         // add card to draw pile
        };
    }
    setLocation(coords=[10, 30]){
        /*
        set location for player img element to be moved to
        */
        this.coords = coords
        return 
    }
    visualize(coords=[10, 30]){
        /* 
        create and place img element on screen
        */
        this.setLocation(coords)                // set location for img to be made
        /*
        create img element
        */
        let vis = document.createElement("img") 
        vis.src = this.image
        vis.classList.add("playerImg")
        /* 
        place img element
        */
        vis.style.left = String(this.coords[0]) + "%"
        vis.style.top = String(this.coords[1]) + "%"
        document.body.appendChild(vis)
        
        return vis
    }
    updateAllCardDisplays(){
        /*
        collect all discarded cards and place in discard pile
        */
        [this.EffectCards, this.LogicCards, this.drawPile].forEach((pile) => {
            this.discardPile.addCards(pile.discarded())
        });
        
        /*
        update all card groups
        */
        [this.EffectCards, this.LogicCards, this.discardPile, this.drawPile].forEach((pile)=>{
            pile.updateDisplay()
        })
    }
}
