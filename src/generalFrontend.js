export function getPosition(htmlElement){
    return [htmlElement.style.left, htmlElement.style.top];
}

export function setPosition(htmlElement, coords){
    htmlElement.style.left = coords[0];
    htmlElement.style.top = coords[1];
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