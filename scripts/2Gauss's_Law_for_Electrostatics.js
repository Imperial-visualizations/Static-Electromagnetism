/*jshint esversion:7*/
//set global variables
//allpoints for storing charges, maxpoints to limit total n of allpoints, newchargex/y for position of new charge on top

let width = $('#sketch-holder').width(), height = $('#sketch-holder').height(), allpoints = [], maxpoints = 10, newchargex = 240, newchargey = 38;
const Nvertices = 1700, max_range = 1500, R = 16, square_size = 100, padding = 50, rect_height = height/8, arrow_size = 5;

class volume_element {
    constructor(x, y, w, l) {
        this.y = y;
        this.x = x;
        this.w = w;
        this.l = l;
    }
}

class charge {
    constructor(q, x, y){
        this.q = q;
        this.x = x;
        this.y = y;
        this.r = R;
        this.clicked = false;
        
        //Colour of charge
        if (q > 0){
            let tune1 = Math.round(180 - 120*(1-Math.exp(-Math.abs(q))));
            let tune2 = Math.round(90*(Math.exp(-Math.abs(q))));
            this.color = "rgb(255," + tune1.toString() + "," + tune2.toString() + ")";
        } else if (q < 0){
            let tune1 = Math.round(120*(Math.exp(-Math.abs(q))));
            let tune2 = Math.round((180 - 120*(1-Math.exp(-Math.abs(q)))));
            this.color = "rgb(" + tune1.toString() + "," + tune2.toString() + ",255)";
        }else{
            this.color = "#00FF00";
        }

        //Relate the number of field lines to the magnitude of the charge
        if (Math.abs(q) <= 0.33) {
            this.n_lines = 4;
        } else if (Math.abs(q) > 0.33 && Math.abs(q) <= 0.66) {
            this.n_lines = 8;
        } else {
            this.n_lines = 16;
        }
    }

    pressed(){
        if (dist(mouseX, mouseY, this.x, this.y) < this.r){
            this.clicked = true;
        }
    }

    dragposition(){
            this.x = mouseX;
            this.y = mouseY;
    }

    intersect(){
        let areintersecting = false;
        for (let i = 0; i < allpoints.length; i++) {
            if(allpoints[i] != this){
                if (parseFloat(dist(mouseX, mouseY, allpoints[i].x, allpoints[i].y)) <= R*2){
                    areintersecting = true;
                }
            }
        }
        if (parseFloat(Math.abs(mouseX-v1.x)) <= R && v1.y - R <= mouseY && mouseY <= v1.y + v1.l + R){
            areintersecting = true;
        }
        if (parseFloat(Math.abs(mouseX-v1.x - v1.w)) <= R && v1.y - R <= mouseY && mouseY <= v1.y + v1.l + R){
            areintersecting = true;
        }
        if (parseFloat(Math.abs(mouseY-v1.y - v1.l)) <= R && v1.x - R <= mouseX && mouseX <= v1.x + v1.w + R){
            areintersecting = true;
        }
        if (parseFloat(Math.abs(mouseY - v1.y)) <= R && v1.x - R <= mouseX && mouseX <= v1.x + v1.w + R){
            areintersecting = true;
        }
        return areintersecting;
    }
}


//Selects a charge or neutral "charge"
class charge_selector{
    constructor(q, x, y){
        this.q = q;
        this.x = x;
        this.y = y;
        this.r = R;
        this.clicked = false;

        //Colour of charge
        if (q == 0){
            this.color = "#00FF00";
        } else if (q > 0){
            let tune1 = Math.round(180 - 120*(1-Math.exp(-Math.abs(q))));
            let tune2 = Math.round(90*(Math.exp(-Math.abs(q))));
            this.color = "rgb(255," + tune1.toString() + "," + tune2.toString() + ")";
        } else {
            let tune1 = Math.round(120*(Math.exp(-Math.abs(q))));
            let tune2 = Math.round((180 - 120*(1-Math.exp(-Math.abs(q)))));
            this.color = "rgb(" + tune1.toString() + "," + tune2.toString() + ",255)";
        }
    }
    
    pressed(){
        if (dist(mouseX, mouseY, this.x, this.y) < this.r){
            if (this.q != 0) {
                let q = new charge(this.q, this.x, this.y);
                allpoints.push(q);
            }
        }
    }
}

function structural(n) {
    let x = newchargex, y = newchargey;
    fill(50);
    textSize(10);
    textAlign(CENTER);
    text('Authors: Cyd Cowley, Darren Lean', x, y + 30);
    if (dist(mouseX, mouseY, x, y) < R) {
        text("You can't catch me!", x, y - 22);
        textSize(15);
        text('Poofff  : p', x, y);
        textSize(10);
        text("By the way, why neutral 'charge'", x + 300, y - 20);
    } else {
        if (n < maxpoints) {
            text('Peek a boo!', x, y - 22);
            noStroke();
            fill(247, 202, 24);
            ellipse(x, y, 2*R, 2*R);
            fill(0);
            ellipse(x - 8, y - 4, 5, 5);
            ellipse(x + 8, y - 4, 5, 5);
            arc(x, y + 1, 20, 20, radians(0), radians(180));
        } else {
            text('Oh no! You run out of charge.', x, y - 22);
            noStroke();
            fill(247, 202, 24);
            ellipse(x, y, 2*R, 2*R);
            stroke(51);
            line(x - 8, y - 6, x - 4, y - 2);
            line(x - 8, y - 2, x - 4, y - 6);
            line(x + 4, y - 6, x + 8, y - 2);
            line(x + 4, y - 2, x + 8, y - 6);
            fill(153, 153, 0);
            ellipse(x, y + 6, 6, 6);
        }
    }
}

//loopX and loopY are the initial central coordinates of the loop
//diceX and diceY are to randomise the curve of the polygon
let diceX = [], diceY = [], loopX = 200 + 600*Math.random(), loopY = 200 + 300*Math.random(), polygonradius = 60, polygonvertice = 25;
for (let i = 0; i < polygonvertice; i++) {
    diceX[i] = 1 + 0.5*Math.random();
    diceY[i] = 1 + 0.5*Math.random();
}

class weird_shape{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.r = 1.5 * polygonradius;
        this.nodeX = [];
        this.nodeY = [];
        for (let i = 0; i < polygonvertice; i++) {
            let theta = 2*i*(Math.PI/polygonvertice);
            this.nodeX[i] = x + polygonradius*diceX[i]*Math.cos(theta);
            this.nodeY[i] = y + polygonradius*diceY[i]*Math.sin(theta);
        }
    }
}

//Adds the starting points of the field lines around the charge
function initial_fieldpoints(Qposition, R, n_lines){
    let x0=[], y0=[];

    for (let i = 0; i < n_lines; i++) {
        let theta = 2*i*(Math.PI/n_lines);
        x0.push(Qposition[0] + R*Math.cos(theta));
        y0.push(Qposition[1] + R*Math.sin(theta));
    }
    return([x0,y0]);
}

function withinCanvas(x, y){
    if (y < (rect_height) || y > (height)|| x > (width) || x < (0) ){
        return false;
    } else {
        return true;
    }
}

function draw_fieldlines(initialx, initialy, q){
    let xfield0 = initialx, yfield0 = initialy, xfield1 = 0, yfield1 = 0;
    
    //Change the magnitude of charge to fix the sizes of arrows and field lines 
    if (q > 0) {
        q = +1;
    } else {
        q = -1;
    }

    for (let i = 0; i < Nvertices; i++) {
        if(xfield0 > width+padding||xfield0 < 0 - padding||yfield0 > height+padding||yfield0 < 0-padding){return;}
        let Fx = 0, Fy = 0, Ftotal;
        for (let k = 0; k < allpoints.length; k++) {
            let r = Math.sqrt(((xfield0 - allpoints[k].x) ** 2 + (yfield0 - allpoints[k].y) ** 2));
            if (r < 1) {
                return;
            }
            Fx += (allpoints[k].q)*(xfield0 - allpoints[k].x) / (Math.pow(r,3));
            Fy += (allpoints[k].q)*(yfield0 - allpoints[k].y) / (Math.pow(r,3));
        }
        Ftotal = Math.sqrt(Fx ** 2 + Fy ** 2);
        let dx = q * (max_range / Nvertices) * (Fx / Ftotal),
            dy = q * (max_range / Nvertices) * (Fy / Ftotal);
        xfield1 = xfield0 + dx;
        yfield1 = yfield0 + dy;
        stroke("rgb(120, 120, 120)");
        line(xfield0, yfield0, xfield1, yfield1);
        if (i == Math.round(Nvertices/12)) {
            line(xfield0 - q*dy*arrow_size, yfield0 + q*dx*arrow_size, xfield0 + arrow_size*q*dx, yfield0 + arrow_size*q*dy);
            line(xfield0 + q*dy*arrow_size, yfield0 - q*dx*arrow_size, xfield0 + arrow_size*q*dx, yfield0 + arrow_size*q*dy);
        }
        xfield0 = parseFloat(xfield1);
        yfield0 = parseFloat(yfield1);
    }
}

//functions that 'move' a charge when it is clicked
function mousePressed(){
    if (allpoints.length < maxpoints){
        sel.pressed();
    }
    for (let i = 0; i < allpoints.length; i++) {
        allpoints[i].pressed();
    }
}

function mouseReleased() {
    for (let i = 0; i < allpoints.length; i++) {
        if (allpoints[i].y < rect_height || allpoints[i].y > height|| allpoints[i].x > width || allpoints[i].x < 0 ){
            allpoints.splice(i,1);
        } else {
            allpoints[i].clicked = false;
        }
    }
}

v1 = new volume_element(width/2, height/2, width/8, width/8);

//draw canvas in which everything p5.js happens
function setup() {
    let canvas = createCanvas(width,height);
    canvas.parent('sketch-holder');
    frameRate(60);
}

//main function that repeats as soon as the last line is called
function draw() {
    clear();

    //Brings in user input and turn it into a charge
    sel = new charge_selector(parseFloat(document.getElementById('magnit').value), newchargex, newchargey);

    //any points cannot overlap graphically
    for (let i = 0; i < allpoints.length; i++) {
        if (allpoints[i].clicked == true && allpoints[i].intersect() == false){
            allpoints[i].dragposition();
        }
    }

    //draws fieldlines of charges 
    for (let i = 0; i < allpoints.length; i++){
        if (allpoints[i].q != 0){
            let [x0, y0] = initial_fieldpoints([allpoints[i].x, allpoints[i].y], allpoints[i].r, allpoints[i].n_lines);
            for (let j = 0; j < x0.length; j++) {
                draw_fieldlines(x0[j], y0[j], allpoints[i].q);
            }
        }
    }

    //draw and colour all the points
    for (let i = 0; i < allpoints.length; i++) {
        noStroke(1);
        fill(color(allpoints[i].color));
        ellipse(allpoints[i].x, allpoints[i].y, R*2);
    }

    noStroke();
    fill(247, 252, 251);
    rect(0, 0, width, rect_height);

    stroke(72, 99, 95);
    line(0, rect_height, width, rect_height);

    if (allpoints.length < maxpoints){
        if (sel.q != 0){
            noStroke();
            fill(color(sel.color));
            ellipse(sel.x, sel.y, R*2);
        } else {
            structural(allpoints.length);
        }
    } else {
        structural(allpoints.length);
    }

    if (document.getElementById('loopOption').checked == true) {
        loop = new weird_shape(loopX, loopY);

        //Draw the loop
        noFill();
        stroke("#48A9A6");
        curveTightness(1);
        beginShape();
        for (let i = 0; i < polygonvertice; i++) {
            curveVertex(loop.nodeX[i], loop.nodeY[i]);
        }
        endShape(CLOSE);


        //Start counting the number of net field lines into or out of the loop
        let fluxcounter = 0;
        for (let i = 0; i < allpoints.length; i++) {
            if (dist(allpoints[i].x, allpoints[i].y, loop.x, loop.y) < loop.r){
                if (allpoints[i].q > 0) {
                    fluxcounter += allpoints[i].n_lines;
                }   else if (allpoints[i].q < 0) {
                    fluxcounter -= allpoints[i].n_lines;
                } 
            }
        }

        fill(0, 0, 0);
        textSize(20);
        text(fluxcounter, loop.x, loop.y);
    }
}