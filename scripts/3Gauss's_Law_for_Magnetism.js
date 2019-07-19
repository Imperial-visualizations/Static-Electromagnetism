/*jshint esversion:7*/
//set global variables
//allpoints for storing dipoles, maxpoints to limit total n of allpoints, newdipolex/y for position of new magnet on top

let width = $('#sketch-holder').width(), height = $('#sketch-holder').height(), allpoints = [], maxpoints = 5, newdipolex = 245, newdipoley = 38;
const Nvertices = 700, max_range = 1500, R = 16, square_size = 100, padding = 50, rect_height = height/8, arrow_size = 2.5;

//Used to prevent things from overlapping one another
class volume_element {
    constructor(x, y, w, l) {
        this.y = y;
        this.x = x;
        this.w = w;
        this.l = l;
    }
}

//de magnet
class dipole {
    constructor(m, theta, x, y){
        this.m = m;
        this.mvec = [m*Math.cos(theta), m*Math.sin(theta)];
        this.theta = theta;
        this.x = x;
        this.y = y;
        this.r = 2 * R;
        this.clicked = false;
        
        //Colour of dipole in relation to the magnet strength
        if (m == 0){
            this.redcolor = "#00FF00";
            this.bluecolor = "#00FF00";
        } else {
            let tune1 = Math.round(100*(1 - Math.sqrt(Math.abs(m))));
            this.redcolor = "rgb(255," + tune1.toString() + "," + tune1.toString() + ")";

            let tune3 = Math.round(70*(1 - Math.sqrt(Math.abs(m))));
            let tune4 = Math.round(90 - 60*(Math.sqrt(Math.abs(m))));
            this.bluecolor = "rgb(" + tune3.toString() + "," + tune4.toString() + ",255)";
        }

        //Relate the number of field lines to the magnitude of the dipole
        this.n_lines = 4 + 20*m;
    }

    //Cursor interactivity
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

//Selects the magnet that user wants
class dipole_selector{
    constructor(m, theta, x, y){
        this.m = m;
        this.mvec = [m*Math.cos(theta), m*Math.sin(theta)];
        this.theta = theta;
        this.x = x;
        this.y = y;
        this.r = 2 * R;
        this.clicked = false;

        //Colour of dipole in relation to the magnet strength
        if (m == 0){
            this.redcolor = "#00FF00";
            this.bluecolor = "#00FF00";
        } else {
            let tune1 = Math.round(100*(1 - Math.sqrt(Math.abs(m))));
            this.redcolor = "rgb(255," + tune1.toString() + "," + tune1.toString() + ")";

            let tune3 = Math.round(70*(1 - Math.sqrt(Math.abs(m))));
            let tune4 = Math.round(90 - 60*(Math.sqrt(Math.abs(m))));
            this.bluecolor = "rgb(" + tune3.toString() + "," + tune4.toString() + ",255)";
        }
    }

    //God's hand to pull magnet out of thin air 
    pressed(){
        if (dist(mouseX, mouseY, this.x, this.y) < this.r){
            if (this.m != 0) {
                let dip = new dipole(this.m, this.theta, this.x, this.y);
                allpoints.push(dip);
            }
        }
    }
}

//To specify the loop
//loopX and loopY are the initial central coordinates of the loop
//diceX and diceY are to randomise the vertices of the polygon
let diceX = [], diceY = [], loopX = 200 + 600*Math.random(), loopY = 200 + 300*Math.random(), polygonradius = 60 + 20*Math.random(), polygonvertice = 30 + Math.round(10*Math.random());
for (let i = 0; i < polygonvertice; i++) {
    diceX[i] = 1 + 0.3*Math.random();
    diceY[i] = 1 + 0.3*Math.random();
}

//Still the loop thing
class weird_shape{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.r = polygonradius;
        this.nodeX = [];
        this.nodeY = [];
        for (let i = 0; i < polygonvertice; i++) {
            let theta = 2*i*(Math.PI/polygonvertice);
            this.nodeX[i] = x + polygonradius*diceX[i]*Math.cos(theta);
            this.nodeY[i] = y + polygonradius*diceY[i]*Math.sin(theta);
        }
    }
}

//The special case care taker, delete at your own peril
function structural(n, angle, m) {
    let x = 0, y = 0;
    fill(50);
    textAlign(CENTER);
    textSize(10);
    rotate(-angle);
    text('Author: Darren Lean', x, y + 30);
    rotate(angle);
    if (dist(mouseX, mouseY, newdipolex, newdipoley) < 2*R) {
        rotate(-angle);
        text("You can't catch me!", x, y - 22);
        textSize(15);
        text('Poofff  : p', x, y);
        if (m == 0){
            textSize(10);
            text("By the way, why 0", x + 400, y - 20);
        }
        rotate(angle);
    } else {
        if (n < maxpoints) {
            if (angle == 0 ){
                fill(50);
                text('Peek a boo!', x, y - 22);
                noStroke();
                fill(247, 202, 24);
                ellipse(x, y, 2*R, 2*R);
                fill(0);
                ellipse(x - 8, y - 4, 5, 5);
                ellipse(x + 8, y - 4, 5, 5);
                arc(x, y + 1, 20, 20, radians(0), radians(180));
            } else {
                if (document.getElementById("angleChange").value == true){
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
                    rotate(-angle);
                    fill(255, 0, 0);
                    textSize(20);
                    text('STOP it!', x, y - 22);
                    rotate(angle);
                } else {
                    noStroke();
                    fill(247, 202, 24);
                    ellipse(x, y, 2*R, 2*R);
                    stroke(51);
                    line(x - 8, y - 6, x - 4, y - 2);
                    line(x - 8, y - 2, x - 4, y - 6);
                    line(x + 4, y - 6, x + 8, y - 2);
                    line(x + 4, y - 2, x + 8, y - 6);
                    line(x - 6, y + 6, x + 6, y + 6);
                    rotate(-angle);
                    noStroke();
                    fill(50);
                    text('Ugh.', x, y - 22);
                    rotate(angle);
                }
            }
        } else {
            rotate(-angle);
            fill(50);
            if (angle == 0) {
                text('Oh no! You run out of magnets.', x, y - 22);
            } else {
                text("Sorry, I can't help.", x, y - 22);
            }
            rotate(angle);
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

//Adds the starting points of the field lines around the dipole
//Left side
function initial_leftfieldpoints(Qposition, theta, R, n_lines){
    let x0=[], y0=[];

    for (let i = 0; i < n_lines/4; i++) {  //theta is used in the rotation transformation matrix
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

    for (let i = 0; i < n_lines/4; i++) {  //theta is used in the rotation transformation matrix
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
        //Area inside the top blue box to not draw fieldlines
        if(xfield0 > width+padding||xfield0 < 0 - padding||yfield0 > height+padding||yfield0 < 0-padding){return;}
        let Bx = 0, By = 0, Btotal;
        for (let k = 0; k < allpoints.length; k++) {

            //Area inside the magnet to not draw fieldlines
            let delX = Math.abs(xfield0 - allpoints[k].x), delY = Math.abs(yfield0 - allpoints[k].y);
            if (delX < 20 && delY < 20) {
                return;
            }

            //Calcuating the field strength
            let rvec = [xfield0 - allpoints[k].x, yfield0 - allpoints[k].y];
            let absr = Math.sqrt(rvec[0]**2 + rvec[1]**2);
            let rvechat = math.divide(rvec, absr);
            let Bvec = math.divide(math.subtract(math.multiply(3*math.dot(allpoints[k].mvec,rvechat),rvechat),allpoints[k].mvec),Math.pow(absr, 3));
            Bx += Bvec[0];
            By += Bvec[1]; 

        }
        Btotal = Math.sqrt(Bx ** 2 + By ** 2);
        //Scaling the step size
        let dx = (max_range / Nvertices) * (Bx / Btotal),
            dy = (max_range / Nvertices) * (By / Btotal);
        //Prepare to draw the line
        xfield1 = xfield0 - dx;
        yfield1 = yfield0 - dy;
        stroke("rgb(120, 120, 120)");
        let delX = Math.abs(xfield0 - initialx), delY = Math.abs(yfield0 - initialy);
        if (i < Math.round(0.9*Nvertices)){
            line(xfield0, yfield0, xfield1, yfield1);       //Draw the field line
        } else if (i > Math.round(0.9*Nvertices) && delX > 1 && delY > 1){
            return;
        }
        if (i == Math.round(Nvertices/12)) {            //Draw the arrow if condition is met
            line(xfield0 - dy*arrow_size, yfield0 + dx*arrow_size, xfield0 + arrow_size*dx, yfield0 + arrow_size*dy);
            line(xfield0 + dy*arrow_size, yfield0 - dx*arrow_size, xfield0 + arrow_size*dx, yfield0 + arrow_size*dy);
        }
        xfield0 = parseFloat(xfield1);           //Prepare the initial coordinates for drawing next bit of field line
        yfield0 = parseFloat(yfield1);
    }
}

//Right side
function draw_rightfieldlines(initialx, initialy){
    let xfield0 = initialx, yfield0 = initialy, xfield1 = 0, yfield1 = 0;

    for (let i = 0; i < Nvertices; i++) {
        //Area inside the top blue box to not draw fieldlines
        if(xfield0 > width+padding||xfield0 < 0 - padding||yfield0 > height+padding||yfield0 < 0-padding){return;}
        let Bx = 0, By = 0, Btotal;
        for (let k = 0; k < allpoints.length; k++) {

            //Area inside the magnet to not draw fieldlines
            let delX = Math.abs(xfield0 - allpoints[k].x), delY = Math.abs(yfield0 - allpoints[k].y);
            if (delX < 20 && delY < 20) {
                return;
            }

            //Calcuating the field strength
            let rvec = [xfield0 - allpoints[k].x, yfield0 - allpoints[k].y];
            let absr = Math.sqrt(rvec[0]**2 + rvec[1]**2);
            let rvechat = math.divide(rvec, absr);
            let Bvec = math.divide(math.subtract(math.multiply(3*math.dot(allpoints[k].mvec,rvechat),rvechat),allpoints[k].mvec),Math.pow(absr, 3));
            Bx += Bvec[0];
            By += Bvec[1]; 

        }
        Btotal = Math.sqrt(Bx ** 2 + By ** 2);
        //Scaling the step size
        let dx = (max_range / Nvertices) * (Bx / Btotal),
            dy = (max_range / Nvertices) * (By / Btotal);
        //Prepare to draw the line
        xfield1 = xfield0 + dx;
        yfield1 = yfield0 + dy;
        stroke("rgb(120, 120, 120)");
        let delX = Math.abs(xfield1 - initialx), delY = Math.abs(yfield1 - initialy);
        if (i < Math.round(0.9*Nvertices)){
            line(xfield0, yfield0, xfield1, yfield1);       //Draw the field line
        } else if (i > Math.round(0.9*Nvertices) && delX > 1 && delY > 1){
            return;
        }
        if (i == Math.round(Nvertices/12)) {            //Draw the arrow if condition is met
            line(xfield0 - dy*arrow_size, yfield0 + dx*arrow_size, xfield0 + arrow_size*dx, yfield0 + arrow_size*dy);
            line(xfield0 + dy*arrow_size, yfield0 - dx*arrow_size, xfield0 + arrow_size*dx, yfield0 + arrow_size*dy);
        }
        xfield0 = parseFloat(xfield1);          //Prepare the initial coordinates for drawing next bit of field line
        yfield0 = parseFloat(yfield1);
    }
}

//Function that 'move' a charge when it is clicked
function mousePressed() {
    if (allpoints.length < maxpoints){  //limits the number of charge that can be dragged into the canvas
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

//Used to prevent things from overlapping one another
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

    //draw the top blue rectangle box that contains the text, slider and new magnet
    noStroke();
    fill(247, 252, 251);
    rect(0, 0, 2*width, 2*rect_height);

    stroke(72, 99, 95);
    line(0, rect_height, width, rect_height);

    //WARNING: do not change the order of the transformations, i.e. translate and rotate
    let angle = parseFloat(document.getElementById('angle').value)*3.14/180;
    translate(newdipolex, newdipoley);
    rotate(angle);

    //Brings in user input and turn it into a charge
    dip = new dipole_selector(parseFloat(document.getElementById('magnit').value), parseFloat(document.getElementById('angle').value)*3.14/180, newdipolex, newdipoley);

    //draw the magnets that are already inside the canvas
    if (allpoints.length < maxpoints){
        if (dip.m != 0){
            noStroke();
            fill(color(dip.bluecolor));
            rect(- 16, 0, 32, 40);
            fill(color(dip.redcolor));
            rect(16, 0, 32, 40);
        } else {
            structural(allpoints.length, angle, dip.m);
        }
    } else {
        structural(allpoints.length, angle, dip.m);
    }

    rotate(-angle);
    translate(-newdipolex, -newdipoley);

    //draw the loop if user wants it
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
    
        let flux = 0;       //Always 0 by Gauss's Law
    
        //display the flux at the center of the loop
        fill(0, 0, 0);
        textSize(20);
        text(flux, loop.x, loop.y);
    }
}
