// WORK IN Progress
export class Healthbar {
    constructor (health=67, maxHealth=67, color1="#eb4034", color2="#000000", color3="#ffffff"){
        this.health = health 
        this.max = maxHealth
        this.color1 = color1 
        this.color2 = color2 
        this.color3 = color3
        let vis = this.createVisuals()
        this.empty = vis[0]
        this.fill = vis[1]
        this.display = vis[2]
        this.coords = [0,0]
        this.sprite = null
        this.updateVisual()
    }
    setLocation (coords = [0,0]) {
        this.coords = coords 
        this.empty.style.top = String(coords[1]) + "%"
        this.empty.style.left = String(coords[0]) + "%"
    }  
    attachSprite(sprite){
        this.sprite = sprite
    }
    changeColor1(color1){
        this.fill.style.background = this.color1 
    }
    changeColor2(color2){
        this.empty.style.background = this.color2
    }
    changeColor3(color3){
        this.display.style.color = this.color3 
    }
    updateVisual(){
        this.fill.style.width = String((this.health/this.max)*100) + "%"
        
        this.display.innerText = `${this.health} / ${this.max}`
        console.log(`${this.health} / ${this.max}`)
    }   
    createVisuals(width=10, height=3){
        let empty = document.createElement("div")
        empty.style.background = this.color2
        empty.style.position = "absolute"
        empty.style.width = String(width) + "%"
        empty.style.height = String(height) + "%"

        let fill = document.createElement("div")
        fill.style.background = this.color1 
        fill.style.position = "absolute"
        fill.style.left = "0%"
        fill.style.height = "100%"

        let display = document.createElement("frame")
        display.style.position = "absolute"
        display.style.height = "100%"
        display.style.width = "100%"
        display.style.textAlign = "center"
        display.style.color = this.color3 

        empty.appendChild(fill)
        empty.appendChild(display)
        document.body.appendChild(empty)

        return [empty, fill, display]
    }
}