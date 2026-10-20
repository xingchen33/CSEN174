class Enemy {
    constructor (image="shadow.webp"){
        this.image = image 
        this.vis = this.visualize()
        this.coords = [0,0]
    }
    visualize(){
        let enemySprite = document.createElement("img")
        enemySprite.src = this.image 
        enemySprite.classList.add("enemySprite")
        document.body.appendChild(enemySprite)
        return enemySprite
    }
    setLocation(coords){
        this.coords = coords
        this.vis.style.left = String(this.coords[0]) + "%"
        this.vis.style.top = String(this.coords[1]) + "%"
    }
}
