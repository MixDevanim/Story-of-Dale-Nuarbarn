var canvas = document.getElementById('glcanvas');
var gl = canvas.getContext('experimental-webgl', { alpha: false })

var Window = {
    width: canvas.width,
    height: canvas.height,
}