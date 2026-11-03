export function cutPercentage(input_text){
    return input_text.replaceAll("%","")
}

export function getPosition(htmlElement){
    let htmlGetX = Number(cutPercentage(htmlElement.style.left))
    let htmlGetY = Number(cutPercentage(htmlElement.style.top))
    return [htmlGetX, htmlGetY]; // work on
}

export function setPosition(htmlElement, coords){
    htmlElement.style.left = String(coords[0]) +"%";
    htmlElement.style.top = String(coords[1]) + "%";
}

export function hasClass(htmlElement, classCheck){
    return htmlElement.classList.contains(classCheck);
}

export function removeClass(htmlElement, takeClass){
    htmlElement.classList.remove(takeClass)
}

export function addClass(htmlElement){
    for (var i = 1; i < arguments.length; ++i)
        htmlElement.classList.add(arguments[i])
}

export function getDistance(coords1, coords2){
    let x_distance = coords1[0]-coords2[0]
    let y_distance = coords1[1]-coords2[1]

    return Math.sqrt(x_distance^2 + y_distance^2)
}

export function get_mouse_position (){
    let mouse_x = 100 * Number(event.clientX) / window.innerWidth;  // Horizontal
    let mouse_y = 100 * Number(event.clientY) / window.innerHeight;  // Vertical
    return [mouse_x, mouse_y]
}