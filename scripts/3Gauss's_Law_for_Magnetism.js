/*jshint esversion:7*/
//set global variables
//activepoints for charges, neutralpoints for neutral "magnet", allpoints = activepoints + neutralpoints, maxpoints to limit total n of activepoints

let width = $('#sketch-holder').width(), height = $('#sketch-holder').height(), activepoints = [], neutralpoints = [], allpoints = [], maxpoints = 10;
const Nvertices = 1700, max_range = 1500, R = 16, square_size = 100, padding = 50, rect_height = height/8, arrow_size = 5, dipdist = 1.2*R;

class volume_element {
    constructor(x,y,w,l) {
        this.y = y;
        this.x = x;
        this.w = w;
        this.l = l;
    }
}

//For q =! 0
class dipole {
    constructor(q,x,y){
        this.q = q;
        this.x = x;
        this.y = y;
        this.r = 2*R;
        this.clicked = false;
        
        //Colour of dipole
        let tune1 = Math.round(100*(1 - Math.sqrt(Math.abs(q))));
        this.redcolor = "rgb(255," + tune1.toString() + "," + tune1.toString() + ")";

        let tune3 = Math.round(70*(1 - Math.sqrt(Math.abs(q))));
        let tune4 = Math.round(90 - 60*(Math.sqrt(Math.abs(q))));
        this.bluecolor = "rgb(" + tune3.toString() + "," + tune4.toString() + ",255)";

        //Relate the number of field lines to the magnitude of the dipole
        if (Math.abs(q) <= 0.33) {
            this.n_lines = 8;
        } else if (Math.abs(q) > 0.33 && Math.abs(q) <= 0.66) {
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
        let thisFrameMouseX = mouseX, thisFrameMouseY = mouseY;
            this.x = thisFrameMouseX;
            this.y = thisFrameMouseY;
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

//For silly q = 0 neutral "magnet"
class neutral {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.r = 2*R;
        this.clicked = false;
        this.redcolor = "#00FF00";
        this.bluecolor = "#00FF00";
    }

    pressed(){
        if (dist(mouseX, mouseY, this.x, this.y) < this.r){
            this.clicked = true;
        }
    }

    dragposition(){
        let thisFrameMouseX = mouseX, thisFrameMouseY = mouseY;
            this.x = thisFrameMouseX;
            this.y = thisFrameMouseY;
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
class dipole_selector{
    constructor(q,x,y){
        this.q = q;
        this.x = x;
        this.y = y;
        this.r = 2*R;
        this.clicked = false;

        //Colour of dipole
        if (q == 0){
            this.redcolor = "#00FF00";
            this.bluecolor = "#00FF00";
        } else {
        let tune1 = Math.round(100*(1 - Math.sqrt(Math.abs(q))));
        this.redcolor = "rgb(255," + tune1.toString() + "," + tune1.toString() + ")";

        let tune3 = Math.round(70*(1 - Math.sqrt(Math.abs(q))));
        let tune4 = Math.round(90 - 60*(Math.sqrt(Math.abs(q))));
        this.bluecolor = "rgb(" + tune3.toString() + "," + tune4.toString() + ",255)";
        }
    }
    
    pressed(){
        if (dist(mouseX,mouseY,this.x,this.y)<this.r){
            if (this.q == 0){
                let n = new neutral(this.x,this.y);
                neutralpoints.push(n);
                allpoints.push(n);
            } else {
                let dip = new dipole(this.q,this.x,this.y);
                activepoints.push(dip);
                allpoints.push(dip);
            }
        }
    }
}

//Adds the starting points of the field lines around the dipole
//Left side
function initial_leftfieldpoints(Qposition, R, n_lines){
    let x0=[],y0=[];

    for (let i = 0; i < n_lines/4; i++) {
        x0.push(Qposition[0] - R);
        y0.push(Qposition[1] + i*3);
        x0.push(Qposition[0] - R);
        y0.push(Qposition[1] - i*3);
    }
    return([x0,y0]);
}

//Right side
function initial_rightfieldpoints(Qposition, R, n_lines){
    let x0=[],y0=[];

    for (let i = 0; i < n_lines/4; i++) {
        x0.push(Qposition[0] + R);
        y0.push(Qposition[1] + i*3);
        x0.push(Qposition[0] + R);
        y0.push(Qposition[1] - i*3);
    }
    return([x0,y0]);
}

//Draw fieldlines with given initial points
//Left side
function draw_leftfieldlines(initialx, initialy, q){
    let mvec = [q,0], xfield0 = initialx, yfield0 = initialy, xfield1 = 0, yfield1 = 0;

    for (let i = 0; i < Nvertices; i++) {
        if(xfield0 > width+padding||xfield0 < 0 - padding||yfield0 > height+padding||yfield0 < 0-padding){return;}
        let Bx = 0, By = 0, Btotal;
        for (let k = 0; k < activepoints.length; k++) {

            //Area inside the magnet to not draw fieldlines
            let delX = Math.abs(xfield0 - activepoints[k].x), delY = Math.abs(yfield0 - activepoints[k].y);
            if (delX < 32 && delY < 20) {
                return;
            }

            let rvec = [xfield0 - activepoints[k].x, yfield0 - activepoints[k].y];
            let absr = Math.sqrt(rvec[0]**2 + rvec[1]**2);
            let rvechat = math.divide(rvec, absr);
            let Bvec = math.divide(math.subtract(math.multiply(3*math.dot(mvec,rvechat),rvechat),mvec),Math.pow(absr, 3));
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
function draw_rightfieldlines(initialx, initialy, q){
    let mvec = [q,0], xfield0 = initialx, yfield0 = initialy, xfield1 = 0, yfield1 = 0;

    for (let i = 0; i < Nvertices; i++) {
        if(xfield0 > width+padding||xfield0 < 0 - padding||yfield0 > height+padding||yfield0 < 0-padding){return;}
        let Bx = 0, By = 0, Btotal;
        for (let k = 0; k < activepoints.length; k++) {

            //Area inside the magnet to not draw fieldlines
            let delX = Math.abs(xfield0 - activepoints[k].x), delY = Math.abs(yfield0 - activepoints[k].y);
            if (delX < 32 && delY < 20) {
                return;
            }
            
            let rvec = [xfield0 - activepoints[k].x, yfield0 - activepoints[k].y];
            let absr = Math.sqrt(rvec[0]**2 + rvec[1]**2);
            let rvechat = math.divide(rvec, absr);
            let Bvec = math.divide(math.subtract(math.multiply(3*math.dot(mvec,rvechat),rvechat),mvec),Math.pow(absr, 3));
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
    if (activepoints.length < maxpoints){
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
    frameRate(60);
}

//main function that repeats as soon as the last line is called
function draw() {
    clear();
    background('#ffffff');
    //noStroke();
    stroke("#48A9A6");
    fill("#ffffff");
    //rect(v1.x, v1.y, v1.l,v1.w);

    //Brings in user input and turn it into a charge
    dip = new dipole_selector(parseFloat(document.getElementById('magnit').value), width/3, rect_height/2);

    //any points cannot overlap graphically
    for (let i = 0; i < allpoints.length; i++) {
        if (allpoints[i].clicked == true && allpoints[i].intersect() == false){
            allpoints[i].dragposition();
        }
    }

    //Draws fieldlines of charges 
    //Left side
    for (let i = 0; i < activepoints.length; i++) {
        let [x0, y0] = initial_leftfieldpoints([activepoints[i].x, activepoints[i].y], activepoints[i].r, activepoints[i].n_lines);
        for (let j = 0; j < x0.length; j++) {
            draw_leftfieldlines(x0[j], y0[j], activepoints[i].q);
        }
    }

    //Right side
    for (let i = 0; i < activepoints.length; i++) {
        let [x0, y0] = initial_rightfieldpoints([activepoints[i].x, activepoints[i].y], activepoints[i].r, activepoints[i].n_lines);
        for (let j = 0; j < x0.length; j++) {
            draw_rightfieldlines(x0[j], y0[j], activepoints[i].q);
        }
    }

    //draw and colour all the magnets
    for (let i = 0; i < allpoints.length; i++) {
        noStroke(1);
        fill(color(allpoints[i].bluecolor));
        rect(allpoints[i].x - 31, allpoints[i].y - 20, 32, 40);
        fill(color(allpoints[i].redcolor));
        rect(allpoints[i].x + 1, allpoints[i].y - 20, 32, 40);
    }

    noStroke();
    fill(247, 252, 251);
    rect(0, 0, width, rect_height);

    stroke(72, 99, 95);
    line(0, rect_height, width, rect_height);

    if (activepoints.length < maxpoints){
        noStroke();
        fill(color(dip.bluecolor));
        rect(dip.x - 31, dip.y - 20, 32, 40);
        fill(color(dip.redcolor));
        rect(dip.x + 1, dip.y - 20, 32, 40);
    }

    textSize(25);
    textFont("Fira Sans");
    textAlign(CENTER);
    fill(1);
    text("Drag to add", width/6, rect_height/1.5);
    text("Charge:", width/2.1, rect_height/1.5);
}
