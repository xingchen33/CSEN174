export function cutPercentage(input_text){
    return input_text.replaceAll("%","")
}

export function getPosition(htmlElement){
    let htmlGetX = Number(cutPercentage(htmlElement.style.left))
    let htmlGetY = Number(cutPercentage(htmlElement.style.top))

    console.log([htmlGetX, htmlGetY])
    return [htmlGetX, htmlGetY]; // work on
}
export function getWidth(htmlElement){
    return Number(cutPercentage(htmlElement.style.width))
}

export function getHeight(htmlElement){
    return Number(cutPercentage(htmlElement.style.height))
}

export function setPosition(htmlElement, coords){
    htmlElement.style.left = String(coords[0]) +"%";
    htmlElement.style.top = String(coords[1]) + "%";
}

export function hasClass(htmlElement, classCheck){
    return htmlElement.classList.contains(classCheck);
}

export function removeClass(htmlElement){
    for (var i = 1; i < arguments.length; ++i)
        htmlElement.classList.remove(arguments[i])
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

export function fromElement(htmlElement, coords){
    let element_coords = getPosition(htmlElement)
    let element_width = getWidth(htmlElement)
    let element_height = getHeight(htmlElement)

    console.log(element_coords[0], coords[0], element_coords[0]+element_width)
    console.log(element_coords[1], coords[1], element_coords[1]+element_height)

    if (element_coords[0]<coords[0] && coords[0]<element_coords[0]+element_width){
        if (element_coords[1]<coords[1] && coords[1]<element_coords[1]+element_height)
            return 0
    }
    else{
        let element_center = [element_coords[0]+element_width*0.5, element_coords[1]+element_height*0.5]
        return getDistance(element_center, coords)
    }
}