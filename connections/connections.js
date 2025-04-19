import {getAllUsers, getUserData } from '../firebase.js';


function drawCircle(ctx, x, y, radius, stroke, fill, strokeWidth) {
    ctx.beginPath()
    ctx.arc(x , y, radius, 0, 2 * Math.PI, false)
    if (fill) {
        ctx.fillStyle = fill
        ctx.fill()
    }
    if (stroke) {
        ctx.lineWidth = strokeWidth
        ctx.strokeStyle = stroke
        ctx.stroke()
    }
}

function drawLine(ctx, x1, y1, x2, y2, color){
    ctx.strokeStyle = color
    ctx.fillStyle = color

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.stroke();
}

function drawTriangle(ctx, x1, y1, x2, y2, x3, y3, color){
    var path=new Path2D();

    ctx.strokeStyle = color
    path.moveTo(x1,y1);
    path.lineTo(x2,y2);
    path.lineTo(x3,y3);
    ctx.fill(path);
}

function addToDict(dict, key){
    if (dict.get(key) != null)
        dict.set(key, dict.get(key) + 1)
    else
        dict.set(key, 1)
}

let names = new Map();
let freq = new Map();
let uniqueNames = []
let circles = new Map();

let width;
let height;
handleResize();

const circleSize = 2;

let selected = "";
let network = new Map();

window.onload = function(){
    init();
}

let canvas;
const colors = ["rgb(0 30 236)", "rgb(0 250 200)", "rgb(160 0 253)", "rgb(210 0 0)", "rgb(250 150 0)", "rgb(220 220 0)"]
const unhighlighted = "rgba(0,0,0,0.4)"


async function loadDB() {
    const users = await getAllUsers();
    const promises = users.map(user => {
        return getUserData(user).then(links => {
            names.set(user, links);
        });
    });
    await Promise.all(promises); // ✅ Wait for all inner getUserData calls
}


function init(){
    canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    handleResize()

    canvas.width = width;
    canvas.height = height;

    loadDB().then(() => {

        names.forEach((value, key) => {
            addToDict(freq, key)
            value.forEach(n => addToDict(freq, n));
        });


        let max = 1;
        freq.forEach((value, key) => {
            uniqueNames.push(key)
            max = Math.max(max, value)
        });

        let deg = Math.PI * 2 / uniqueNames.length;
        let dist = (4 * max) / (Math.sqrt(2 * (1 - Math.cos(2 * Math.PI / uniqueNames.length)))) * circleSize

        for (let i = 0; i < uniqueNames.length; i++) {
            let c = [width / 2 + dist * Math.cos(deg * i), height / 2 + dist * Math.sin(deg * i), circleSize * freq.get(uniqueNames[i])];
            circles.set(uniqueNames[i], c);
        }

        update(ctx)
    });
}

function update(ctx){

    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
    }

    if (scrolls != 0){
        let zoom = Math.pow(zoomInMult, scrolls);

        let xPadding = (1 - 1/zoom) * (width / scale) * (mouseX / width);
        let yPadding = (1 - 1/zoom) * (height/scale) * (mouseY / height);

        scale *= zoom;

        xOffset += xPadding;
        yOffset += yPadding;

    }
    scrolls = 0;

    render(ctx);

    requestAnimationFrame(() => update(ctx));

}


function render(ctx){
    ctx.clearRect(0, 0, width, height);

    names.forEach((value, key) => { //draw arrows
        let c1 = circles.get(key);
        value.forEach(s => {

            let c2 = circles.get(s);

            let x1 = toX(c1[0])
            let y1 = toY(c1[1])
            let x2 = toX(c2[0])
            let y2 = toY(c2[1])

            let angle = Math.atan2(y2 - y1, x2 - x1)
            let size = toScale(Math.max(c2[2]/8, circleSize * 1.75))
            let otherAngle = Math.PI / 8

            let x3 = x2 - toScale(c2[2]) * Math.cos(angle)
            let y3 = y2 - toScale(c2[2]) * Math.sin(angle)

            let xs = x1 + toScale(c1[2]) * Math.cos(angle)
            let ys = y1 + toScale(c1[2]) * Math.sin(angle)

            let x4 = x3 - size * Math.cos(angle - otherAngle);
            let y4 = y3 - size * Math.sin(angle - otherAngle);
            let x5 = x3 - size * Math.cos(angle + otherAngle);
            let y5 = y3 - size * Math.sin(angle + otherAngle);

            let color = 'black'
            if (network.get(key) != null)
                color = colors[Math.min(network.get(key), colors.length - 1)]
            else if (selected.length !== 0)
                color = unhighlighted

            drawLine(ctx, xs, ys, (x4+x5)/2, (y4+y5)/2, color)
            drawLine(ctx, x3, y3, x4, y4, color)
            drawLine(ctx, x3, y3, x5, y5, color)
            drawTriangle(ctx, x3, y3, x4, y4, x5, y5, color)
        });
    });

    circles.forEach((value, key) => { //draw circles
        let c = toCircle(value)

        let x = c[0];
        let y = c[1];
        let r = c[2];

        if (x + r <= 0 || y + r <= 0 || x - r >= width || y - r >= height)
            return;

        let color = 'black'
        if (network.get(key) != null)
            color = colors[Math.min(network.get(key), colors.length - 1)]
        else if (selected.length !== 0)
            color = unhighlighted

        drawCircle(ctx, x, y, r, color, color, 1);

        //text
        let size = r / 2;
        if (size !== 0){

            ctx.fillStyle = 'black'
            if (color === 'black')
                ctx.fillStyle = 'white'
            ctx.textAlign = 'center';
            ctx.textBaseLine = 'top';

            ctx.font = `${size}px segoe-ui`
            ctx.fillText(key, x, y)
        }

    });

}



function toX(x){
    return scale * (x - xOffset);
}

function toY(y){
    return scale * (y - yOffset);
}

function toScale(size){
    return size * scale
}

function toCircle(circ){
    return [toX(circ[0]), toY(circ[1]), toScale(circ[2])];
}


let scrolls = 0;
let scale = 1;
let zoomInMult = 1.1;

let xOffset = 0;
let yOffset = 0;

let mouseX;
let mouseY;

let isDragging = false;
let startX, startY;

function handleScroll(event) {
    scrolls = -event.deltaY / 120;


}
function getMouseLocation(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}

let moving = "";

function onMouseDown(event) {
    if (event.button === 0) {
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
    }
    else if (event.button === 2){
        let found = false;

        circles.forEach((value, key) => {
            if (found)
                return;

            let c = toCircle(value)

            let x = c[0];
            let y = c[1];
            let r = c[2];

            if (x + r <= 0 || y + r <= 0 || x - r >= width || y - r >= height)
                return;

            let d = Math.pow(x - event.clientX, 2) + Math.pow(y - event.clientY, 2)

            if (d < Math.pow(r, 2)){
                moving = key;
                found = true;
            }
        })

    }
    else if (event.button === 1){
        event.preventDefault();

        let found = false;
        network.clear();
        circles.forEach((value, key) => {
            if (found)
                return;
            let c = toCircle(value)

            let x = c[0];
            let y = c[1];
            let r = c[2];

            if (x + r <= 0 || y + r <= 0 || x - r >= width || y - r >= height)
                return;

            let d = Math.pow(x - event.clientX, 2) + Math.pow(y - event.clientY, 2)
            if (d < Math.pow(r, 2)){
                if (selected === key)
                    selected = "";
                else{
                    selected = key;
                    selectNetwork(key, 0);
                }
                found = true;
            }
        })
        if (!found)
            selected = "";

    }


}

function selectNetwork(name, jump){
    if (network.get(name) != null){
        if (network.get(name) > jump){
            network.set(name, jump)
            names.get(name).forEach(n => selectNetwork(n, jump + 1));
        }
        return;
    }
    network.set(name, jump);
    if (names.get(name) != null)
        names.get(name).forEach(n => selectNetwork(n, jump + 1));
}

function onMouseMove(event) {
    if (moving.length !==0 ){
        let c = circles.get(moving)
        c[0] = event.clientX / scale + xOffset
        c[1] = event.clientY / scale + yOffset
        circles.set(moving, c)
    }
    else if (isDragging) {
        let deltaX = event.clientX - startX;
        let deltaY = event.clientY - startY;

        xOffset -= deltaX/scale;
        yOffset -= deltaY / scale;

        startX = event.clientX;
        startY = event.clientY;
    }
}

function onMouseUp() {
    isDragging = false;
    moving = ""
}

function handleResize() {
    width = window.innerWidth;
    height = window.innerHeight;

}

window.addEventListener('resize', handleResize);
document.addEventListener('mousedown', onMouseDown);
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mouseup', onMouseUp);
document.addEventListener('mousemove', getMouseLocation);
window.addEventListener('wheel', handleScroll);
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});