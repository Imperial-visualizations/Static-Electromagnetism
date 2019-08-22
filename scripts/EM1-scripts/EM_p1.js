/*jshint esversion:7*/

//The function to switch between visualisations
//When checked is false, displays vis 1
//When checked is true, displays vis 2
//Default is false
//document.getElementById("mode").checked = false;
function toggle() {
    if (document.getElementById("mode").checked == true) {
        document.getElementById("Vis1_text").style.display = "none";
        document.getElementById("Vis1_interactive").style.display = "none";
        document.getElementById("Vis2_text").style.display = "block";
        document.getElementById("Vis2_interactive").style.display = "block";
    } else {
        document.getElementById("Vis1_text").style.display = "block";
        document.getElementById("Vis1_interactive").style.display = "block";
        document.getElementById("Vis2_text").style.display = "none";
        document.getElementById("Vis2_interactive").style.display = "none";
    }
}

//JS for Vis1

//JS for Vis2
//allpoints for storing charges, maxpoints to limit total n of allpoints, newchargex/y for position of new charge on top

let width = $('#sketch-holder').width(), height = $('#sketch-holder').height(), allpoints = [], maxpoints = 10, newchargex = 160, newchargey = 38;
const Nvertices = 700, max_range = 2000, R = 16, square_size = 100, padding = 90, rect_height = height/8, arrow_size = 2;

//Used to prevent things from overlapping one another
class volume_element {
    constructor(x, y, w, l) {
        this.y = y;
        this.x = x;
        this.w = w;
        this.l = l;
    }
}

//de charge
class charge {
    constructor(q, x, y){
        this.q = q;
        this.x = x;
        this.y = y;
        this.r = R;
        this.clicked = false;
        
        //Colour of charge in relation to magnitude and polarity
        if (q > 0){
            let tune1 = Math.round(180 - 120*(1-Math.exp(-Math.abs(q))));
            let tune2 = Math.round(90*(Math.exp(-Math.abs(q))));
            this.color = "rgb(255," + tune1.toString() + "," + tune2.toString() + ")";
        } else if (q < 0){
            let tune1 = Math.round(120*(Math.exp(-Math.abs(q))));
            let tune2 = Math.round((180 - 120*(1-Math.exp(-Math.abs(q)))));
            this.color = "rgb(" + tune1.toString() + "," + tune2.toString() + ",255)";
        } else {
            this.color = "#00FF00";
        }

        //Relate the number of field lines to the magnitude of the charge
        this.n_lines = 3 + 10*Math.abs(q);
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

//Selects the charge that user wants
class charge_selector{
    constructor(q, x, y){
        this.q = q;
        this.x = x;
        this.y = y;
        this.r = R;
        this.clicked = false;

        //Colour of charge in relation to magnitude and polarity
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
    
    //God's hand to pull charge out of thin air 
    pressed(){
        if (dist(mouseX, mouseY, this.x, this.y) < this.r){
            if (this.q != 0) {
                let q = new charge(this.q, this.x, this.y);
                allpoints.push(q);
            }
        }
    }
}

//To specify the loop
//loopX and loopY are the initial central coordinates of the loop
//diceX and diceY are to randomise the vertices of the polygon
let diceX = [], diceY = [], loopX = 300 + 400*Math.random(), loopY = 250 + 100*Math.random(), polygonradius = 80 + 20*Math.random(), polygonvertice = 30 + Math.round(10*Math.random());
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

class OK_shape{
    constructor(x, y){
        this.x = x;
        this.y = y;                                                 //Anticlockwise
        this.nodeX = [x, x+100, x+150,                                  //Palm
                        x+140, x+130, x+105, x+95, x+115,                     //Pinky
                        x+122, x+103, x+70, x+55, x+80,                       //4th finger
                        x+87, x+70, x+30, x+13, x+45,                         //International
                        x+52, x-10, x-30, x-50, x-48, x-25, x-10, x+25,       //2nd
                        x+30, x+25,                                     //the curve
                        x-15, x-30, x-55, x-50];                        //Thumb
        this.nodeY = [y, y, y-50,                                    //Palm
                        y-100, y-150, y-200, y-200, y-150,               //Pinky
                        y-110, y-160, y-220, y-215, y-155,               //4th finger
                        y-115, y-165, y-225, y-220, y-160,               //International
                        y-115, y-140, y-130, y-110, y-90, y-100, y-110, y-100,//2nd
                        y-70, y-50,                                   //the curve
                        y-55, y-80, y-70, y-55];                        //Thumb
    }
}

let DrawX = [], DrawY = [];
class Draw_shape{
    constructor(){
        this.nodeX = DrawX;
        this.nodeY = DrawY;                     
    }
}

let drawing = false;
function DrawingMode() {
    if (drawing) {
        drawing = false;
        $('#Draw').html('Drag');
    } else {
        drawing = true;
        $('#Draw').html('Draw');
    }
}

function clearDrawing() {
    DrawX.splice(0, DrawX.length);
    DrawY.splice(0, DrawY.length);
}

//The special case care taker, delete at your own peril
function structural(n) {
    let x = newchargex, y = newchargey;
    fill(50);
    textSize(10);
    textAlign(CENTER);
    text('Authors: Cyd Cowley, Darren Lean', x, y + 30);
    if (dist(mouseX, mouseY, x, y) < R) {
        text("You can't catch me!", x, y - 22);
        textSize(15);
        text('Poofff :p', x, y);
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

//This field calculator is sligthly different from that in the draw_fieldlines function
//Do not change the power
function field(x, y){
    let Fx = 0, Fy = 0;
    for (let k = 0; k < allpoints.length; k++) {
        let r = Math.sqrt(((x - allpoints[k].x) ** 2 + (y - allpoints[k].y) ** 2));
        Fx += (allpoints[k].q)*(x - allpoints[k].x) / (Math.pow(r,2));      //Note inverse r and not r^2 because this is 2D Gauss's Law
        Fy += (allpoints[k].q)*(y - allpoints[k].y) / (Math.pow(r,2));      //Math.pow 2 because one power comes from resolving the forces
    }
    return [Fx, Fy];
}

function checkCrossing(x1, y1, x2, y2, x3, y3, x4, y4){
    m1 = (y2-y1)/(x2-x1);
    c1 = y1 - m1*x1;
    m2 = (y4-y3)/(x4-x3);
    c2 = y3 - m2*x3;
    x = (c2-c1)/(m1-m2);
    y = m1*x + c1;
    xmin = Math.min(x1, x2, x3, x4);
    xmax = Math.max(x1, x2, x3, x4);
    ymin = Math.min(y1, y2, y3, y4);
    ymax = Math.max(y1, y2, y3, y4);
    if (x > xmin && x < xmax && y > ymin && y < ymax){
        return true;
    } else {
        return false;
    }
}

//For calculating net flux through the loop
//The loop must be specified by N number of nodes, this function will close the loop for you so don't repeat the first node at last
//This function takes in two arrays, one for all the x of the nodes and the other for y
//A field(x, y) function that calculates the field at (x,y) is required 
function lineCrossIntegral(Xnode, Ynode){
    let sum = 0, resolution = 1000; //resolution for the line element in path vector

    for (let i = 0; i < Xnode.length - 1; i++){                         //for the going around the loop
        pathsection = [Xnode[i+1] - Xnode[i], Ynode[i+1] - Ynode[i]];   //path vector assumes straight line formed by the two nodes
        dl = [pathsection[0]/resolution, pathsection[1]/resolution, 0]; //dividing the path into smaller line elements, third dimension for cross product
        for (let j = 0; j < resolution - 1; j++){                       //integration along the path vector by moving in line element steps
            F = field(Xnode[i] + (j/resolution)*pathsection[0], Ynode[i] + (j/resolution)*pathsection[1]); //gives [Fx, Fy]
            newF = [F[0], F[1], 0];                                     //third dimension for cross product
            sum += math.cross(newF, dl)[2];                             //taking just the third dimension
        }
    }
    //The end case for closing the loop
    pathsection = [Xnode[0] - Xnode[Xnode.length - 1], Ynode[0] - Ynode[Ynode.length - 1]]; //path vector from last node to the first
    dl = [pathsection[0]/resolution, pathsection[1]/resolution, 0];                         //same procedure as above
    for (let j = 0; j < resolution - 1; j++){
        F = field(Xnode[Xnode.length - 1] + (j/resolution)*pathsection[0], Ynode[Ynode.length - 1] + (j/resolution)*pathsection[1]);
        newF = [F[0], F[1], 0];
        sum += math.cross(newF, dl)[2];
    }
    return sum;
}

//Adds the starting points of the field lines around the charge
function initial_fieldpoints(Qposition, R, n_lines){
    let x0=[], y0=[];

    for (let i = 0; i < n_lines; i++) {
        let theta = 2*i*(Math.PI/n_lines);          //putting the dots around the circle
        x0.push(Qposition[0] + R*Math.cos(theta));
        y0.push(Qposition[1] + R*Math.sin(theta));
    }
    return([x0,y0]);
}

function draw_fieldlines(initialx, initialy, q){
    let xfield0 = initialx, yfield0 = initialy, xfield1 = 0, yfield1 = 0;
    
    //Change the magnitude of charge to fix the sizes of arrows and field lines 
    //The polarity of q determines the direction of the arrow
    if (q > 0) {
        q = +1;
    } else {
        q = -1;
    }

    for (let i = 0; i < Nvertices; i++) {
        //Area inside the top blue box to not draw fieldlines
        if(xfield0 > width+padding||xfield0 < 0 - padding||yfield0 > height+padding||yfield0 < 0-padding){return;}
        let Fx = 0, Fy = 0, Ftotal;
        for (let k = 0; k < allpoints.length; k++) {
            let r = Math.sqrt(((xfield0 - allpoints[k].x) ** 2 + (yfield0 - allpoints[k].y) ** 2));
            
            //Area inside the charge to not draw fieldlines
            if (r < 1) {
                return;
            }

            //Calcuating the field strength
            Fx += (allpoints[k].q)*(xfield0 - allpoints[k].x) / (Math.pow(r,3));
            Fy += (allpoints[k].q)*(yfield0 - allpoints[k].y) / (Math.pow(r,3));
        }
        Ftotal = Math.sqrt(Fx ** 2 + Fy ** 2);
        //Scaling the step size
        let dx = q * (max_range/Nvertices) * (Fx / Ftotal),
            dy = q * (max_range/Nvertices) * (Fy / Ftotal);
        //Prepare to draw the line
        xfield1 = xfield0 + dx;
        yfield1 = yfield0 + dy;
        stroke("rgb(120, 120, 120)");
        line(xfield0, yfield0, xfield1, yfield1);       //Draw the field line
        if (i == Math.round(Nvertices/12)) {            //Draw the arrow if condition is met
            line(xfield0 - q*dy*arrow_size, yfield0 + q*dx*arrow_size, xfield0 + arrow_size*q*dx, yfield0 + arrow_size*q*dy);
            line(xfield0 + q*dy*arrow_size, yfield0 - q*dx*arrow_size, xfield0 + arrow_size*q*dx, yfield0 + arrow_size*q*dy);
        }
        xfield0 = parseFloat(xfield1);                  //Prepare the initial coordinates for drawing next bit of field line
        yfield0 = parseFloat(yfield1);
    }
}

//function that 'move' a charge when it is clicked
function mousePressed(){
    if (allpoints.length < maxpoints){          //limits the number of magnet that can be dragged into the canvas
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

//Used to prevent things from overlapping one another
v1 = new volume_element(width/2, height/2, width/8, width/8);

//draw canvas in which everything p5.js happens
function setup() {
    let canvas = createCanvas(width, height);
    canvas.parent('sketch-holder');
    frameRate(60);
    $('#Draw').click(DrawingMode);
}

//main function that repeats as soon as the last line is called
function draw() {
    clear();

    //Brings in user input and turn it into a charge
    sel = new charge_selector(parseFloat(document.getElementById('magnit').value), newchargex, newchargey);
    loopChoice = document.getElementById('loopOptions').value;
    //any points cannot overlap graphically
    if (drawing) {
    } else {
        for (let i = 0; i < allpoints.length; i++) {
            if (allpoints[i].clicked == true && allpoints[i].intersect() == false){
                cursor(HAND);
                allpoints[i].dragposition();
            } else {
                cursor(ARROW);
            }
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

    //draw the top blue rectangle box that contains the text, slider and new charge
    noStroke();
    fill(247, 252, 251);
    rect(0, 0, width, rect_height);

    stroke(72, 99, 95);
    line(0, rect_height, width, rect_height);

    //draw the charges that are already inside the canvas
    if (allpoints.length < maxpoints){
        if (sel.q != 0){
            if (drawing){
            } else {
                noStroke();
                fill(color(sel.color));
                ellipse(sel.x, sel.y, R*2);
            }
        } else {
            structural(allpoints.length); 
        }
    } else {
        structural(allpoints.length);
    }

    //draw the loop that the user wants
    if (loopChoice == 1) {
        drawing = false;
        document.getElementById('Draw').style.display = 'none';
        document.getElementById('clearDrawing').style.display = 'none';
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

        //flux calculator
        let flux = Math.round(100*lineCrossIntegral(loop.nodeX, loop.nodeY)/6.27)/100;

        //display the flux at the center of the loop
        textSize(20);
        fill(0, 0, 0);
        text(flux, loop.x, loop.y);

    } else if (loopChoice == 2) {
        document.getElementById('Draw').style.display = 'inline-block';
        document.getElementById('clearDrawing').style.display = 'inline-block';

        loop = new Draw_shape();
        noFill();
        if (mouseIsPressed && mouseButton === LEFT && drawing){
            if(mouseX > 20 && mouseX < width - 100 && mouseY > padding && mouseY < height){              
                cursor(CROSS);
                DrawX.push(mouseX);
                DrawY.push(mouseY);
            } 
            if (loop.nodeX.length != 0){    
                //Draw the loop
                stroke("#48A9A6");
                curveTightness(1);
            
                beginShape();
                for (let i = 0; i < loop.nodeX.length; i++) {
                    curveVertex(loop.nodeX[i], loop.nodeY[i]);
                }
                endShape(CLOSE);
                
            }
        } else {
            cursor(ARROW);
            if (loop.nodeX.length != 0){    
                //Draw the loop
                stroke("#48A9A6");
                curveTightness(1);
            
                beginShape();
                for (let i = 0; i < loop.nodeX.length; i++) {
                    curveVertex(loop.nodeX[i], loop.nodeY[i]);
                }
                endShape(CLOSE);
            }
        }
            //flux calculator
            let flux = Math.round(100*lineCrossIntegral(loop.nodeX, loop.nodeY)/6.27)/100;

            //display the flux at the center of the loop
            textSize(20);
            fill(0, 0, 0);
            if (loop.nodeX.length == 0){
                if (drawing){
                    text('Start drawing!', 300, 250);
                } else {
                    text('Turn on the drawing mode', 300, 250);
                }
            } else {
                text(flux, loopX, loopY);
            }

    } else {
        drawing = false;
        document.getElementById('Draw').style.display = 'none';
        document.getElementById('clearDrawing').style.display = 'none';
        loop = new OK_shape(500, 500);

        //Draw the loop
        noFill();
        stroke("#48A9A6");
        curveTightness(1);
        beginShape();
        for (let i = 0; i < loop.nodeX.length; i++) {
            curveVertex(loop.nodeX[i], loop.nodeY[i]);
        }
        endShape(CLOSE);

        //flux calculator
        let flux = Math.round(100*lineCrossIntegral(loop.nodeX, loop.nodeY)/6.27)/100;

        //display the flux at the center of the loop
        textSize(20);
        fill(0, 0, 0);
        text(-flux, loop.x-45, loop.y-79.5); //flux is negative because the nodes are specified anticlockwise

    }
    
}