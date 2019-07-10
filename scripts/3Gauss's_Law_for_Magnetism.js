/*jshint esversion:7*/
//set global variables
let width = $('#sketch-holder').width(), height = $('#sketch-holder').height(), activepoints = [], activenegpoints = [], activepospoints = [], maxpoints = 10;
const Nvertices = 1700, max_range = 1500, R = 16, square_size = 100, padding = 50, rect_height = height/8, arrow_size = 5;

class volume_element {
    constructor(x,y,w,l) {
        this.y = y;
        this.x = x;
        this.w = w;
        this.l = l;
    }
}

class dipole {
    constructor(q,x,y){
        this.q = q;
        this.posq = q;
        this.negq = -q;
        this.x = x;
        this.y = y;
        this.r = R;
        this.clicked = false;

        //Colour of charge
        let tune1 = Math.round(180 - 120*(1-Math.exp(-Math.abs(q))));
        let tune2 = Math.round(90*(Math.exp(-Math.abs(q))));
        this.poscolor = "rgb(255," + tune1.toString() + "," + tune2.toString() + ")";

        let tune3 = Math.round(120*(Math.exp(-Math.abs(q))));
        let tune4 = Math.round((180 - 120*(1-Math.exp(-Math.abs(q)))));
        this.negcolor = "rgb(" + tune3.toString() + "," + tune4.toString() + ",255)";

        //Relate the number of field lines to the magnitude of the dipole
        if (Math.abs(q) <= 0.33) {
            this.n_lines = 4;
        } else if (Math.abs(q) > 0.33 && Math.abs(q) <= 0.66) {
            this.n_lines = 8;
        } else {
            this.n_lines = 16;
        }
    }

    pressed(){
        if (dist(mouseX, mouseY, this.x, this.y) < 2*this.r){
            this.clicked = true;
        }
    }
    dragposition(mx,my){
        let pointsnearmouse = 0, thisFrameMouseX = mouseX, thisFrameMouseY = mouseY;
                this.x = thisFrameMouseX;
                this.y = thisFrameMouseY;
    }

    intersect(){
        let areintersecting = false;
        for (let i = 0; i < activepoints.length; i++) {
            if(activepoints[i] != this){
                if (parseFloat(dist(mouseX, mouseY, activepoints[i].x, activepoints[i].y)) <= R*2){
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

class dipole_selector{
    constructor(q,x,y){
    this.q = q;
    this.posq = q;
    this.negq = -q;
    this.x = x;
    this.y = y;
    this.r = R;
    this.clicked = false;

    //Colour of charge
    let tune1 = Math.round(180 - 120*(1-Math.exp(-Math.abs(q))));
    let tune2 = Math.round(90*(Math.exp(-Math.abs(q))));
    this.poscolor = "rgb(255," + tune1.toString() + "," + tune2.toString() + ")";

    let tune3 = Math.round(120*(Math.exp(-Math.abs(q))));
    let tune4 = Math.round((180 - 120*(1-Math.exp(-Math.abs(q)))));
    this.negcolor = "rgb(" + tune3.toString() + "," + tune4.toString() + ",255)";


        //Relate the number of field lines to the magnitude of the dipole
        if (Math.abs(q) <= 0.33) {
            this.n_lines = 4;
        } else if (Math.abs(q) > 0.33 && Math.abs(q) <= 0.66) {
            this.n_lines = 8;
        } else {
            this.n_lines = 16;
        }
    }
    
    pressed(){
        if (dist(mouseX,mouseY,this.x,this.y)<2*this.r){
            let dip = new dipole(this.q,this.x,this.y);
            dip.pressed();
            activepoints.push(dip);
            activepospoints.push(dip);
            activenegpoints.push(dip);
        }
    }
}

function initial_fieldpoints(Dposition, R, n_lines){
    let x0=[],y0=[];

    for (let i = 0; i < n_lines; i++) {
        let theta = 2*i*(Math.PI/n_lines);
        x0.push(Dposition[0] + R*Math.cos(theta));
        y0.push(Dposition[1] + R*Math.sin(theta));
    }
    return([x0,y0]);
}

function draw_fieldlines(initialx, initialy, q){
    let xfield0 = initialx, yfield0 = initialy, xfield1 = 0, yfield1 = 0;
    
    //Change the magnitude of dipole to fix the sizes of arrows and field lines 
    if (q == 0) {
        return;
    } else if (q > 0) {
        q = +1;
    } else {
        q = -1;
    }

    for (let i = 0; i < Nvertices; i++) {
        if(xfield0 > width+padding||xfield0 < 0 - padding||yfield0 > height+padding||yfield0 < 0-padding){return;}
        let Fx = 0, Fy = 0, Ftotal;
        for (let k = 0; k < activepoints.length; k++) {
            let r = Math.sqrt(((xfield0 - activepoints[k].x) ** 2 + (yfield0 - activepoints[k].y) ** 2));
            if(r < 1){
                return;
            }
            Fx += (activepoints[k].q)*(xfield0 - activepoints[k].x) / (Math.pow(r,3));
            Fy += (activepoints[k].q)*(yfield0 - activepoints[k].y) / (Math.pow(r,3));
        }
        Ftotal = Math.sqrt(Fx ** 2 + Fy ** 2);
        let dx = q * (max_range / Nvertices) * (Fx / Ftotal),
            dy = q * (max_range / Nvertices) * (Fy / Ftotal);
        xfield1 = xfield0 + dx;
        yfield1 = yfield0 + dy;
        stroke("rgb(120, 120, 120)");
        line(xfield0-16*q, yfield0, xfield1-16*q, yfield1);
        if (i == Math.round(Nvertices/12)) {
            line(xfield0 - q*dy*arrow_size-16*q, yfield0 + q*dx*arrow_size, xfield0 + arrow_size*q*dx-16*q, yfield0 + arrow_size*q*dy);
            line(xfield0 + q*dy*arrow_size-16*q, yfield0 - q*dx*arrow_size, xfield0 + arrow_size*q*dx-16*q, yfield0 + arrow_size*q*dy);
        }
        xfield0 = parseFloat(xfield1);
        yfield0 = parseFloat(yfield1);
    }
}
function draw_fieldlines(initialx, initialy, q){
    let xfield0 = initialx, yfield0 = initialy, xfield1 = 0, yfield1 = 0;
    
    //Change the magnitude of dipole to fix the sizes of arrows and field lines 
    if (q == 0) {
        return;
    } else if (q > 0) {
        q = +1;
    } else {
        q = -1;
    }

    for (let i = 0; i < Nvertices; i++) {
        if(xfield0 > width+padding||xfield0 < 0 - padding||yfield0 > height+padding||yfield0 < 0-padding){return;}
        let Fx = 0, Fy = 0, Ftotal;
        for (let k = 0; k < activepoints.length; k++) {
            let r = Math.sqrt(((xfield0 - activepoints[k].x) ** 2 + (yfield0 - activepoints[k].y) ** 2));
            if(r < 1){
                return;
            }
            Fx += (activepoints[k].q)*(xfield0 - activepoints[k].x) / (Math.pow(r,3));
            Fy += (activepoints[k].q)*(yfield0 - activepoints[k].y) / (Math.pow(r,3));
        }
        Ftotal = Math.sqrt(Fx ** 2 + Fy ** 2);
        let dx = q * (max_range / Nvertices) * (Fx / Ftotal),
            dy = q * (max_range / Nvertices) * (Fy / Ftotal);
        xfield1 = xfield0 + dx;
        yfield1 = yfield0 + dy;
        stroke("rgb(120, 120, 120)");
        line(xfield0-1.2*R*q, yfield0, xfield1-1.2*R*q, yfield1);
        if (i == Math.round(Nvertices/12)) {
            line(xfield0 - q*dy*arrow_size-1.2*R*q, yfield0 + q*dx*arrow_size, xfield0 + arrow_size*q*dx-1.2*R*q, yfield0 + arrow_size*q*dy);
            line(xfield0 + q*dy*arrow_size-1.2*R*q, yfield0 - q*dx*arrow_size, xfield0 + arrow_size*q*dx-1.2*R*q, yfield0 + arrow_size*q*dy);
        }
        xfield0 = parseFloat(xfield1);
        yfield0 = parseFloat(yfield1);
    }
}
//functions that 'move' a dipole when it is clicked
function mousePressed() {
    if (activepoints.length < maxpoints){
        dip.pressed();
    }
    for (let i = 0; i < activepoints.length; i++) {
        activepoints[i].pressed();
    }
}

function mouseReleased() {
    for (let i = 0; i < activepoints.length; i++) {
        if (activepoints[i].y < rect_height || activepoints[i].y > height|| activepoints[i].x > width || activepoints[i].x < 0 ){
            activepoints.splice(i,1);
        } else {
        activepoints[i].clicked = false;
        }
    }
}

v1 = new volume_element(width/2, height/2, width/8, width/8);

//draw canvas in which everything p5.js happens
function setup() {
    let canvas = createCanvas(width, height);
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

    //Brings in user input and turn it into a dipole
    dip = new dipole_selector(parseFloat(document.getElementById('magnit').value), width/3, rect_height/2);

    for (let i = 0; i < activepoints.length; i++) {
        if (activepoints[i].clicked == true && activepoints[i].intersect() == false){
            console.log(activepoints[i]);
            activepoints[i].dragposition();
        }
    }

    for (let i = 0; i < activenegpoints.length; i++) {
        let [x0, y0] = initial_fieldpoints([activenegpoints[i].x, activenegpoints[i].y], activenegpoints[i].r, activenegpoints[i].n_lines);
        for (let j = 0; j < x0.length; j++) {
            console.log(activenegpoints[i].negq);
            draw_fieldlines(x0[j], y0[j], activenegpoints[i].posq);
        }
    }
    
    for (let i = 0; i < activepospoints.length; i++) {
        let [x0, y0] = initial_fieldpoints([activepospoints[i].x, activepospoints[i].y], activepospoints[i].r, activepospoints[i].n_lines);
        for (let j = 0; j < x0.length; j++) {
            console.log(activepospoints[i].posq);
            draw_fieldlines(x0[j], y0[j], activepospoints[i].posq);
        }
    }

    for (let i = 0; i < activenegpoints.length; i++) {
        noStroke(1);
        fill(color(activenegpoints[i].negcolor));
        ellipse(activenegpoints[i].x+1.2*R, activenegpoints[i].y, R*2);
    }

    for (let i = 0; i < activepospoints.length; i++) {
        noStroke(1);
        fill(color(activepospoints[i].poscolor));
        ellipse(activepospoints[i].x-1.2*R, activepospoints[i].y, R*2);
    }

    noStroke();
    fill(247, 252, 251);
    rect(0, 0, width, rect_height);

    stroke(72, 99, 95);
    line(0, rect_height, width, rect_height);

    if (activepoints.length < maxpoints){
        noStroke();
        fill(color(dip.poscolor));
        ellipse(dip.x-1.2*R, dip.y, R*2);
        fill(color(dip.negcolor));
        ellipse(dip.x+1.2*R, dip.y, R*2);
    }

    textSize(25);
    textFont("Fira Sans");
    textAlign(CENTER);
    fill(1);
    text("Drag to add", width/6, rect_height/1.5);
    text("Dipole:", width/2.1, rect_height/1.5);
}
