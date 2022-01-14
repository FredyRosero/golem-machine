function centerOfHtmlBox (el) {
    let centerX = Math.round(el.offsetLeft + el.offsetWidth / 2);
    let centerY = Math.round(el.offsetTop + el.offsetHeight / 2);
    return {x: centerX, y:centerY}
}

function centerOfBox() {

}