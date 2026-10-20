export class CardGroup {
    constructor (type, visuals={"spread": 40, "h": 5, "w": 20, "origin": [50,70]}){
        this.type = type 
        this.cards = []
        this.origin = [0,0]
        this.visuals = visuals
        // if (this.type== "hand")
        this.origin = this.visuals.origin
        // console.log(this.origin)
    }
    addCards(cards){ 
        cards.forEach((card) => {
            this.addCard(card)
        });
    }
    addCard(card){
        this.cards.push(card)
        // this.updateDisplay()
    }
    discarded(){
        let discardedCards = []
        this.cards.forEach((card) => {
            if (card.discarded){
                this.cards.splice(this.cards.indexOf(card),1)
                discardedCards.push(card)
            }
        });
        return discardedCards
    }

    updateDisplay(){
        let vh = this.visuals["h"]
        let hw = this.visuals["w"]
        let n = this.cards.length
        let sw = screen.width
        if (this.type == "hand"){
            this.cards.forEach((card, index) => {
                card.selectable = true
                card.card.classList.remove("flipped")

                let cardWidth = 100*card.card.offsetWidth/sw
                let xChange = -Math.cos(Math.PI*((index+1)/(n+1)))*(hw - cardWidth/2) - cardWidth/2

                // let xChange = (index+1)/(n+1)*hw-hw
                // console.log(index, this.origin[0]+xChange)

                let yChange = Math.sin(Math.PI*((index+1)/(n+1)))*vh
                card.setLocation(this.origin[0]+xChange, this.origin[1]-yChange)
                card.card.style.zIndex =index
            });
        }
        if (this.type == "pile"){
            this.cards.forEach((card, index) => {
                card.selectable = false
                card.card.classList.add("flipped")
                card.card.style.zIndex = -index
                card.setLocation(this.origin[0], this.origin[1])
            });
        }
    }
    takeTop(){
        return this.cards.pop()
    }
}
