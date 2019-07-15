/*jshint esversion:7*/
//set global variables
//allpoints for storing dipoles, maxpoints to limit total n of allpoints

let width = $('#sketch-holder').width(), height = $('#sketch-holder').height(), allpoints = [], maxpoints = 5;
const Nvertices = 1700, max_range = 1500, R = 16, square_size = 100, padding = 50, rect_height = height/8, arrow_size = 5;

class volume_element {
    constructor(x, y, w, l) {
        this.y = y;
        this.x = x;
        this.w = w;
        this.l = l;
    }
}

class dipole {
    constructor(m, theta, x, y){
        this.m = m;
        this.mvec = [m*Math.cos(theta), m*Math.sin(theta)];
        this.theta = theta;
        this.x = x;
        this.y = y;
        this.r = 2 * R;
        this.clicked = false;
        
        //Colour of dipole
        if (m == 0){
            this.redcolor = "#00FF00";
            this.bluecolor = "#00FF00";
        } else {
            let tune1 = Math.round(100*(1 - Math.sqrt(Math.abs(m/100))));
            this.redcolor = "rgb(255," + tune1.toString() + "," + tune1.toString() + ")";

            let tune3 = Math.round(70*(1 - Math.sqrt(Math.abs(m/100))));
            let tune4 = Math.round(90 - 60*(Math.sqrt(Math.abs(m/100))));
            this.bluecolor = "rgb(" + tune3.toString() + "," + tune4.toString() + ",255)";
        }

        //Relate the number of field lines to the magnitude of the dipole
        if (Math.abs(m) <= 33) {
            this.n_lines = 8;
        } else if (Math.abs(m) > 33 && Math.abs(m) <= 66) {
            this.n_lines = 16;
        } else {
            this.n_lines = 32;
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

//Selects a magnet or neutral "magnet"
class dipole_selector{
    constructor(m, theta, x, y){
        this.m = m;
        this.mvec = [m*Math.cos(theta), m*Math.sin(theta)];
        this.theta = theta;
        this.x = x;
        this.y = y;
        this.r = 2 * R;
        this.clicked = false;

        //Colour of dipole
        if (m == 0){
            this.redcolor = "#00FF00";
            this.bluecolor = "#00FF00";
        } else {
            let tune1 = Math.round(100*(1 - Math.sqrt(Math.abs(m/100))));
            this.redcolor = "rgb(255," + tune1.toString() + "," + tune1.toString() + ")";

            let tune3 = Math.round(70*(1 - Math.sqrt(Math.abs(m/100))));
            let tune4 = Math.round(90 - 60*(Math.sqrt(Math.abs(m/100))));
            this.bluecolor = "rgb(" + tune3.toString() + "," + tune4.toString() + ",255)";
        }
    }

    pressed(){
        if (dist(mouseX, mouseY, this.x, this.y) < this.r){
            let dip = new dipole(this.m, this.theta, this.x, this.y);
            allpoints.push(dip);
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

//Adds the starting points of the field lines around the dipole
//Left side
function initial_leftfieldpoints(Qposition, theta, R, n_lines){
    let x0=[], y0=[];

    for (let i = 0; i < n_lines/4; i++) {
        x0.push(Qposition[0] - R*Math.cos(theta) - i*3*Math.sin(theta));
        y0.push(Qposition[1] - R*Math.sin(theta) + i*3*Math.cos(theta));
        x0.push(Qposition[0] - R*Math.cos(theta) + i*3*Math.sin(theta));
        y0.push(Qposition[1] - R*Math.sin(theta) - i*3*Math.cos(theta));
    }
    return([x0,y0]);
}

//Right side
function initial_rightfieldpoints(Qposition, theta, R, n_lines){
    let x0=[], y0=[];

    for (let i = 0; i < n_lines/4; i++) {
        x0.push(Qposition[0] + R*Math.cos(theta) - i*3*Math.sin(theta));
        y0.push(Qposition[1] + R*Math.sin(theta) + i*3*Math.cos(theta));
        x0.push(Qposition[0] + R*Math.cos(theta) + i*3*Math.sin(theta));
        y0.push(Qposition[1] + R*Math.sin(theta) - i*3*Math.cos(theta));
    }
    return([x0,y0]);
}

//Draw fieldlines with given initial points
//Left side
function draw_leftfieldlines(initialx, initialy){
    let xfield0 = initialx, yfield0 = initialy, xfield1 = 0, yfield1 = 0;

    for (let i = 0; i < Nvertices; i++) {
        if(xfield0 > width+padding||xfield0 < 0 - padding||yfield0 > height+padding||yfield0 < 0-padding){return;}
        let Bx = 0, By = 0, Btotal;
        for (let k = 0; k < allpoints.length; k++) {

            //Area inside the magnet to not draw fieldlines
            let delX = Math.abs(xfield0 - allpoints[k].x), delY = Math.abs(yfield0 - allpoints[k].y);
            if (delX < 20 && delY < 20) {
                return;
            }

            let rvec = [xfield0 - allpoints[k].x, yfield0 - allpoints[k].y];
            let absr = Math.sqrt(rvec[0]**2 + rvec[1]**2);
            let rvechat = math.divide(rvec, absr);
            let Bvec = math.divide(math.subtract(math.multiply(3*math.dot(allpoints[k].mvec,rvechat),rvechat),allpoints[k].mvec),Math.pow(absr, 3));
            Bx += Bvec[0];
            By += Bvec[1]; 

        }
        Btotal = Math.sqrt(Bx ** 2 + By ** 2);
        let dx = (max_range / Nvertices) * (Bx / Btotal),
            dy = (max_range / Nvertices) * (By / Btotal);
        xfield1 = xfield0 - dx;
        yfield1 = yfield0 - dy;
        stroke("rgb(120, 120, 120)");
        line(xfield0, yfield0, xfield1, yfield1);
        if (i == Math.round(Nvertices/12)) {
            line(xfield0 - dy*arrow_size, yfield0 + dx*arrow_size, xfield0 + arrow_size*dx, yfield0 + arrow_size*dy);
            line(xfield0 + dy*arrow_size, yfield0 - dx*arrow_size, xfield0 + arrow_size*dx, yfield0 + arrow_size*dy);
        }
        xfield0 = parseFloat(xfield1);
        yfield0 = parseFloat(yfield1);
    }
}

//Right side
function draw_rightfieldlines(initialx, initialy){
    let xfield0 = initialx, yfield0 = initialy, xfield1 = 0, yfield1 = 0;

    for (let i = 0; i < Nvertices; i++) {
        if(xfield0 > width+padding||xfield0 < 0 - padding||yfield0 > height+padding||yfield0 < 0-padding){return;}
        let Bx = 0, By = 0, Btotal;
        for (let k = 0; k < allpoints.length; k++) {

            //Area inside the magnet to not draw fieldlines
            let delX = Math.abs(xfield0 - allpoints[k].x), delY = Math.abs(yfield0 - allpoints[k].y);
            if (delX < 20 && delY < 20) {
                return;
            }

            let rvec = [xfield0 - allpoints[k].x, yfield0 - allpoints[k].y];
            let absr = Math.sqrt(rvec[0]**2 + rvec[1]**2);
            let rvechat = math.divide(rvec, absr);
            let Bvec = math.divide(math.subtract(math.multiply(3*math.dot(allpoints[k].mvec,rvechat),rvechat),allpoints[k].mvec),Math.pow(absr, 3));
            Bx += Bvec[0];
            By += Bvec[1]; 

        }
        Btotal = Math.sqrt(Bx ** 2 + By ** 2);
        let dx = (max_range / Nvertices) * (Bx / Btotal),
            dy = (max_range / Nvertices) * (By / Btotal);
        xfield1 = xfield0 + dx;
        yfield1 = yfield0 + dy;
        stroke("rgb(120, 120, 120)");
        line(xfield0, yfield0, xfield1, yfield1);
        if (i == Math.round(Nvertices/12)) {
            line(xfield0 - dy*arrow_size, yfield0 + dx*arrow_size, xfield0 + arrow_size*dx, yfield0 + arrow_size*dy);
            line(xfield0 + dy*arrow_size, yfield0 - dx*arrow_size, xfield0 + arrow_size*dx, yfield0 + arrow_size*dy);
        }
        xfield0 = parseFloat(xfield1);
        yfield0 = parseFloat(yfield1);
    }
}

//Functions that 'move' a charge when it is clicked
function mousePressed() {
    if (allpoints.length < maxpoints){
        dip.pressed();
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

//Draw canvas in which everything p5.js happens
function setup() {
    let canvas = createCanvas(width,height);
    canvas.parent('sketch-holder');
    rectMode(CENTER);
    frameRate(60);
}

//main function that repeats as soon as the last line is called
function draw() {
    clear();

    //any points cannot overlap graphically
    for (let i = 0; i < allpoints.length; i++) {
        if (allpoints[i].clicked == true && allpoints[i].intersect() == false){
            allpoints[i].dragposition();
        }
    }

    //Draws fieldlines of charges 
    //Left side
    for (let i = 0; i < allpoints.length; i++) {
        if (allpoints[i].m != 0){
            let [x0, y0] = initial_leftfieldpoints([allpoints[i].x, allpoints[i].y], allpoints[i].theta, allpoints[i].r, allpoints[i].n_lines);
            for (let j = 0; j < x0.length; j++) {
                draw_leftfieldlines(x0[j], y0[j]);
            }
        }
    }

    //Right side
    for (let i = 0; i < allpoints.length; i++) {
        if (allpoints[i].m != 0){
            let [x0, y0] = initial_rightfieldpoints([allpoints[i].x, allpoints[i].y], allpoints[i].theta, allpoints[i].r, allpoints[i].n_lines);
            for (let j = 0; j < x0.length; j++) {
                draw_rightfieldlines(x0[j], y0[j]);
            }
        }
    }

    //draw and colour all the magnets
    for (let i = 0; i < allpoints.length; i++) {
        noStroke(1);

        translate(allpoints[i].x, allpoints[i].y);
        rotate(allpoints[i].theta);
        fill(color(allpoints[i].bluecolor));
        rect(-16, 0, 32, 40);
        rotate(-allpoints[i].theta);
        translate(-allpoints[i].x, -allpoints[i].y);

        translate(allpoints[i].x, allpoints[i].y);
        rotate(allpoints[i].theta);
        fill(color(allpoints[i].redcolor));
        rect(16, 0, 32, 40);
        rotate(-allpoints[i].theta);
        translate(-allpoints[i].x, -allpoints[i].y);
    }

    noStroke();
    fill(247, 252, 251);
    rect(0, 0, 2*width, 2*rect_height);

    stroke(72, 99, 95);
    line(0, rect_height, width, rect_height);

    let angle = parseFloat(document.getElementById('angle').value)*3.14/180, translatex = 330, translatey = 38;
    translate(translatex, translatey);
    rotate(angle);

    //Brings in user input and turn it into a charge
    dip = new dipole_selector(100*parseFloat(document.getElementById('magnit').value), parseFloat(document.getElementById('angle').value)*3.14/180, translatex, translatey);

    if (allpoints.length < maxpoints){
        noStroke();
        fill(color(dip.bluecolor));
        rect(- 16, 0, 32, 40);
        fill(color(dip.redcolor));
        rect(16, 0, 32, 40);
    }

    rotate(-angle);
    translate(-translatex, -translatey);

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

    let fluxcounter = 0;

    fill(0, 0, 0);
    textSize(20);
    text(fluxcounter, loop.x, loop.y);
}
