function getPosition(htmlElement){
    return [htmlElement.style.left, htmlElement.style.top];
}

function setPosition(htmlElement, coords){
    htmlElement.style.left = coords[0];
    htmlElement.style.top = coords[1];
}

function hasClass(htmlElement, classCheck){
    return htmlElement.classList.contains(classCheck);
}

function removeClass(htmlElement, takeClass){
    htmlElement.classList.remove(takeClass)
}

function addClass(htmlElement, newClass){
    htmlElement.classList.add(newClass)
}