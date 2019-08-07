
//document.getElementById("Vis2_interactive").style.display = "block";

var width = $('#sketch-holder1').width(), height = $('#sketch-holder1').height(), allpoints = [], maxpoints = 10, newchargex = 240, newchargey = 38, line_ele = [];
var Nvertices = 700, max_range = 2000, R = 16, square_size = 100, padding = 50, rect_height = height/8, arrow_size = 2;




//The special case care taker, delete at your own peril
function structural(n) {
    let x = newchargex, y = newchargey;
    fill(50);
    textSize(10);
    textAlign(CENTER);
    text('Author: Darren Lean', x, y + 30);
    if (dist(mouseX, mouseY, x, y) < R) {
        text("You can't catch me!", x, y - 22);
        textSize(15);
        text('Poofff  : p', x, y);
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
            text('Oh no! You have used all of them.', x, y - 22);
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

//Adds the starting points of the field lines around the charge
function initial_fieldpoints(Qposition, R, n_lines){
    let x0=[], y0=[];

    for (let i = 0; i < n_lines; i++) {
        let theta = 2*i*(Math.PI/n_lines);          //putting the dots around the circle
        x0.push(Qposition[0] + R*Math.cos(theta)/2);
        y0.push(Qposition[1] + R*Math.sin(theta)/2);
    }
    return([x0,y0]);
}

function draw_fieldlines(initialx, initialy, q, allpoints){
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
    for (let i = 0; i < allpoints.length; i++) {
        allpoints[i].pressed();
    }
    for (let i = 0; i < line_ele.length; i++) {
        line_ele[i].pressed();
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
    for (let i = 0; i < line_ele.length; i++) {
        line_ele[i].clicked = false;
    }
}

//Used to prevent things from overlapping one another
v1 = new volume_element(width/2, height/2, width/8, width/8);

//draw canvas in which everything p5.js happens
function setup() {
    let canvas = createCanvas(width,height);
    canvas.parent('sketch-holder1');
    frameRate(60);
}

//main function that repeats as soon as the last line is called
function draw() {
    clear();

    let fixedpoints = [];
    q1 = new charge(1, 250, 250);
    fixedpoints.push(q1);
    q2 = new charge(-1, 750, 500);
    fixedpoints.push(q2);

    //draws fieldlines of charges 
    for (let i = 0; i < fixedpoints.length; i++){
        let [x0, y0] = initial_fieldpoints([fixedpoints[i].x, fixedpoints[i].y], fixedpoints[i].r, fixedpoints[i].n_lines);
        for (let j = 0; j < x0.length; j++) {
            draw_fieldlines(x0[j], y0[j], fixedpoints[i].q, fixedpoints);
        }
    }

    //draw and colour all the points
    for (let i = 0; i < fixedpoints.length; i++) {
        noStroke(1);
        fill("rgb(0, 0, 0)");
        ellipse(fixedpoints[i].x, fixedpoints[i].y, R);
    }

    line_ele.push(new line_element(500, 375));
    //WARNING: do not change the order of the transformations, i.e. translate and rotate
    let angle = parseFloat(document.getElementById('angle').value)*3.14/180;
    let Fx = 0, Fy = 0, Ftotal;
    for (let k = 0; k < fixedpoints.length; k++) {
        let r = Math.sqrt(((line_ele[0].x - fixedpoints[k].x) ** 2 + (line_ele[0].y - fixedpoints[k].y) ** 2));
        //Calcuating the field strength
        Fx += (fixedpoints[k].q)*(line_ele[0].x - fixedpoints[k].x) / (Math.pow(r,3));
        Fy += (fixedpoints[k].q)*(line_ele[0].y - fixedpoints[k].y) / (Math.pow(r,3));
    }
    Ftotal = Math.sqrt(Fx ** 2 + Fy ** 2);
    //Scaling the step size
    let dx = 5*(Fx / 0.00001)*(2/(1+Math.exp(-Math.abs(Fx / Ftotal))) + 1),
        dy = 5*(Fy / 0.00001)*(2/(1+Math.exp(-Math.abs(Fy / Ftotal))) + 1);
    //Prepare to draw the line
    xfield1 = line_ele[0].x + dx;
    yfield1 = line_ele[0].y + dy;
    stroke("rgb(120, 120, 120)");
    strokeWeight(4);
    line(line_ele[0].x, line_ele[0].y, xfield1, yfield1);       //Draw the field line
    line(xfield1 - 10*Fx/Ftotal - 10*Fy/Ftotal , yfield1 - 10*Fy/Ftotal + 10*Fx/Ftotal , xfield1, yfield1);
    line(xfield1 - 10*Fx/Ftotal + 10*Fy/Ftotal , yfield1 - 10*Fy/Ftotal - 10*Fx/Ftotal , xfield1, yfield1);
    strokeWeight(1);
    fill(0, 0, 0);
    text('F', 1.02*xfield1, 1.02*yfield1);

    //Compute flux
    document.getElementById('flux').value = Math.round(100000*(Fx*Math.cos(angle) - Fy*Math.sin(angle)));

    translate(line_ele[0].x, line_ele[0].y);
    rotate(-angle);

    //Draw the line element
    noFill();
    stroke("#48A9A6");
    strokeWeight(4);
    //Line element
    line(0, -30, 0, 30);
    stroke(51);
    //Arrow body
    line(0, 0, 30, 0);
    //Arrow head
    line(30 - 5, 0 - 5, 30, 0);
    line(30 - 5, 0 + 5, 30, 0);
    translate(38, 3);
    rotate(angle);
    textAlign(CENTER);
    strokeWeight(1);
    text('d', 0, 0);
    strokeWeight(1.5);
    text('S', 8, 0);
    strokeWeight(1);
    rotate(-angle);
    translate(-38, -3);
    rotate(angle);
    translate(-line_ele[0].x, -line_ele[0].y);

    if (line_ele[0].clicked == true){
        cursor(HAND);
        line_ele[0].dragposition();
    } else {
        cursor(ARROW);
    }

    //draw the top blue rectangle box that contains the text, slider and new charge
    noStroke();
    fill(247, 252, 251);
    rect(0, 0, width, rect_height);

    stroke(72, 99, 95);
    line(0, rect_height, width, rect_height);

}