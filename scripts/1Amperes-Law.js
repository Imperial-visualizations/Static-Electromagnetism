/*
Aline Buat
Ampere's law demonstration page 1
Javascript main code

This code is aimed to defining all the interractions on the page
It mainly uses p5 canvas and p5.draw for main loop.
Interractions from inputs are acquired using jquery

Several shapes for the loop are defined.
The circle one works perfectly, the integrals for the arcs and the rectangles are still approximative.
Those 2 shapes are still left messy

The center of the x, y positions is set as the upper left part of the canvas.
Most of the drawings are defined in polar coordinates
The angles go from -PI to PI, (left), the angles being negative in the upper part of the circle
The default angle is set here as -PI/2
If this needs to change, many changes in how to draw will need to be done (mostly respect to the last 2 shape types)

If this project was to be redone, it would be good be able to go from polar to cartesian (would be more useful to calculate),
or have relative coordinates respect to each wire
While the integral of B.dl is calculated after finding the total magnetic field at a point (by linear addition of the fields due to each wire),
maybe it would also be possible to calculate the circulation of the field due to each wire and then add them up.


What would be great and very cool would be to be able to have a display of the magnetic field at all points,
either with the use of magnetic lines or by calculating the value of the field at each point (but many calculations already)
Maybe only setting calculations when need display, and avoid wires moving while display
would then require only one calculation and therefore not slow viz down
*/



let currentContainer = [], circuitContainer=[], arrows = [], myCanvas, countingFrames = 0, notChangeAngle=false, stepLength=1,t=10;
let vectorB, circuit, arc1,arc2, rectangle1, square1, theta = -Math.PI / 2, magFieldScaling = 200;
const dTheta = 0.01, dt=1, mu0 = 4 * Math.PI * Math.pow(10, -7);
let fieldDisplay = true, playing = false, mouseWasPressed = false, someWireClose = false, wireSelected = 0, circuitSelected = 0;

/* Now the plotly part of declaration */
let trace = {x: [], y: []}, layout, trace2 = {x: [], y: []}, trace3 = {x:[], y:[]};
let x = [], y = [], r = [];
let B, Bdl = 0, intBdl = 0;

function setup() {
    let width = $('#sketch-holder').width(), height = $('#sketch-holder').height();
    //link the functions to the buttons
    $('#buttonPlay').click(buttonPlayFunction);
    $('#buttonField').click(buttonFieldFunction);
    $('#buttonAddWire').click(buttonAddWireFunction);
    $('#buttonRemoveWires').click(buttonRemoveWiresFunction);
    $('#buttonRemoveWires').hide();
    $('#buttonReset').click(buttonResetFunction);
    $('#buttonReset').hide();
    $("#circuitSelectList").on('change', function(){
        circuitSelected = this.value;
        buttonResetFunction();
    });

    myCanvas = createCanvas(width, height);
    myCanvas.parent('sketch-holder');
    frameRate(60);
    currentContainer.push(new Wire(circuit.x, circuit.y, 5, 0));
    initialPlot();
}

//defining the loop
const Circuit = class {
    constructor(x, y, type, args){
        this.x=x;
        this.y=y;
        this.type=type;
        if (type=== "circle"){
            this.diam = args.diam;
            this.diam1=args.diam;
        } else if (type === "arcs" ){
            this.args = {
                diam:args.diam, //each of them is an array of the same lenght containaing the starting angle and diameter of the arcs
                theta:args.theta.sort(),
                diam1:args.diam.splice(0),
            };
            for (let i=0; i<this.args.theta.length; i++){
                if (this.args.theta[i]>=Math.PI){
                    this.args.theta[i] -= 2*Math.PI
                }
            }
            this.args.theta.sort((a, b) => a - b);
        }
        else if (type === "rectangle"){
            this.h = args.height;
            this.w= args.width;
            this.h1=args.height;
            this.w1=args.width;
        }
    };

    //if want to change the shape of the circuit, this is to alter
    drawCircuit() {
        push();
        stroke(100);
        strokeWeight(1);
        noFill();
        translate(this.x, this.y);
        if (this.type==="circle"){
            ellipse(0, 0, this.diam, this.diam);
        } else if (this.type==="arcs"){
            let index = this.args.diam.length;
            for (let k=0; k<index; k++){
                let diam0, diam1, theta0, theta1;
                if (k<index-1) {
                    diam0 = this.args.diam[k], diam1 = this.args.diam[k + 1], theta0 = this.args.theta[k] + 2 * Math.PI, theta1 = 2 * Math.PI + this.args.theta[k + 1];
                }
                else {diam0= this.args.diam[index-1], diam1=this.args.diam[0]; theta0= this.args.theta[index-1], theta1 = this.args.theta[0];}
                arc(0, 0, diam0, diam0, theta0, theta1);
                line(diam0/2*Math.cos(theta1) , diam0/2*Math.sin(theta1), diam1/2*Math.cos(theta1), diam1/2*Math.sin(theta1));
            }
        } else if (this.type==="rectangle"){
            rectMode(RADIUS);
            rect(0, 0, this.w/2, this.h/2);
        }
        stroke (200);
        line (-3, 0, 3, 0);
        line(0, -3, 0, 3);
        pop();

    };

    //this as well so that we follow the circuit
    drawPath() {
        //have arc being bolder as we go on it--> from angle -PI/2 to angle
        push();
        strokeWeight(2);
        stroke(100, 40, 100);
        noFill();
        translate(this.x, this.y);
        if (this.type ==="circle") {
            arc(0, 0, this.diam, this.diam, 3 * Math.PI / 2, theta);
        } else if (this.type==="arcs") {
            let maxM = -1; //draw further than maxM
            for (let m = 0; m < this.args.theta.length; m++) {
                if (theta >= this.args.theta[m]) {
                    maxM = m;
                }
            }
            if (this.args.theta[maxM] >= - Math.PI / 2 && theta>= -Math.PI/2) {
                for (let m = 0; m < maxM; m++) {
                    arc(0, 0, this.args.diam[m], this.args.diam[m], Math.max(this.args.theta[m], -Math.PI / 2), this.args.theta[m + 1]);
                }
                arc(0, 0, this.args.diam[maxM], this.args.diam[maxM], this.args.theta[maxM], theta);
            } else if (theta<-Math.PI/2){
                let m=0;
                for (m=0; m<this.args.theta.length-1; m++){
                    arc(0, 0, this.args.diam[m], this.args.diam[m], Math.max(this.args.theta[m], -Math.PI / 2), this.args.theta[m + 1]);
                }
                arc(0,0, this.args.diam[m], this.args.diam[m], this.args.theta[m], Math.min(theta, this.args.theta[0]) );
                for (m=0; m<maxM; m++){
                    arc(0,0, this.args.diam[m], this.args.diam[m], Math.max(this.args.theta[m], -Math.PI), this.args.theta[m + 1] );
                }
                arc(0, 0, this.args.diam[maxM], this.args.diam[maxM], this.args.theta[maxM], theta);
            }
            else if (theta>=-Math.PI/2 && this.args.theta[maxM]<=-Math.PI/2){
                arc(0, 0, this.args.diam[maxM], this.args.diam[maxM], -Math.PI/2, theta);
            }
        } else if (this.type ==="rectangle"){
            let h = this.h, w = this.w
            let alpha = atan2(h,w);
            if (theta>= -Math.PI/2 &&theta< -alpha ){
                line(0, -h/2, -h/2/Math.tan(theta), -h/2);
            } else if (theta>=-alpha&&theta<=alpha){
                line(0, -h/2, w/2, -h/2);
                line(w/2, -h/2, w/2, w*Math.tan(theta)/2);
            } else if (theta>=alpha && theta<=Math.PI-alpha){
                line(0, -h/2, w/2, -h/2);
                line(w/2, -h/2, w/2, h/2);
                line (w/2, h/2, h/2/Math.tan(theta), h/2);
            } else if (theta>= Math.PI-alpha || theta<= alpha- Math.PI){
                line(0, -h/2, w/2, -h/2);
                line(w/2, -h/2, w/2, h/2);
                line (w/2, h/2, -w/2, h/2);
                line(-w/2, h/2, -w/2, -w*Math.tan(theta)/2);
            } else if (theta> alpha-Math.PI &&theta< -Math.PI/2){
                line(0, -h/2, w/2, -h/2);
                line(w/2, -h/2, w/2, h/2);
                line (w/2, h/2, -w/2, h/2);
                line(-w/2, h/2, -w/2, -h/2);
                line(-w/2, -h/2, -h/2/Math.tan(theta), -h/2);
            }
        }
        pop();
    }
};

const Wire = class {
    constructor(x, y, A, index) {
        this.x = x;
        this.y = y;
        this.value = A;
        if (A >= 0) {
            this.valueSign = 1
        }
        else {
            this.valueSign = -1
        }
        this.widthInner = 3;
        this.widthOuter = 12;
        this.index = index;
        this.clicked = false;
        this.color = 0;
    }

    intersect() { //check if we are close to a forbidden area
        let areintersecting = false;
        for (let i = 0; i < currentContainer.length; i++) {
            if (currentContainer[i] != this) {
                if (parseInt(dist(mouseX, mouseY, currentContainer[i].x, currentContainer[i].y)) <= this.widthOuter + 4) {
                    areintersecting = true
                }
            }
        }
        //also case to avoid putting it out of the canvas
        if (mouseIsPressed && (mouseX <= 4 || mouseY <= 4 || mouseX >= width || mouseY >= height - 10)) {
            areintersecting = true;
        }
        return areintersecting;
    }

    pressed() {
        let distance = dist(mouseX, mouseY, this.x, this.y);
        if (distance <= this.widthOuter + 4 && !mouseWasPressed) {
            someWireClose = true;
            if (mouseIsPressed) {
                this.clicked = true;
                mouseWasPressed = true;
            }
        }

        if (this.clicked && !mouseIsPressed) {
            this.clicked = false;
            mouseWasPressed = false;
        }
    }

    updateWirePos() {
        this.pressed();
        if ((!this.intersect()) && this.clicked) {
            this.x = mouseX;
            this.y = mouseY;
        }
    }

    selectingWire() {
        if (this.clicked) {
            wireSelected = this.index;
            $('#currentSlider').val(this.value.toString());
        }
    }

    drawWire() {
        push();
        stroke(this.color);
        noFill();
        ellipse(this.x, this.y, this.widthOuter, this.widthOuter);
        fill(0);
        strokeWeight(1);
        //change for cross if current is positive, dot if negative
        if (this.valueSign >= 0) {
            line(this.x - this.widthInner, this.y - this.widthInner, this.x + this.widthInner, this.y + this.widthInner);
            line(this.x + this.widthInner, this.y - this.widthInner, this.x - this.widthInner, this.y + this.widthInner);
        } else {
            //negative current represented by vector 3D notation (small dot in the middle)
            strokeWeight(3);
            ellipse(this.x, this.y, this.widthInner, this.widthInner);
        }
        strokeWeight(1);
        textSize(15);
        let textI = 'I (' + this.index + ') =' + this.value;
        text(textI, this.x + 10, this.y + 10);
        pop();
    }

    static drawField(wires) { //for now only works for 1 wire since we only have concentric circles
        if (fieldDisplay) {
            stroke(0, 150, 50);
            // if (wires.length === 1) {//concentric circles
            if (wires[0].value !== 0) {
                for (let r = magFieldScaling / 3 / Math.abs(wires[0].value); r <= $('#sketch-holder').width() || r <= $('#sketch-holder').width(); r += r) {
                    push();
                    translate(wires[0].x, wires[0].y);
                    let sign = wires[0].valueSign;
                    noFill();
                    //draw small arrow to indicate direction
                    ellipse(0, 0, 2 * r, 2 * r);
                    //draw arrows to show direction of magnetic fields
                    line(r, 0, r - sign * 4, -sign * 4);
                    line(r, 0, r + sign * 4, -sign * 4);
                    line(-r, 0, -r - sign * 4, sign * 4);
                    line(-r, 0, -r + sign * 4, sign * 4);
                    pop();
                }
            }
            // }
        }
    }
};

circuit= new Circuit($('#sketch-holder').width() / 2, $('#sketch-holder').height() / 2, "circle", {diam:200});
circuitContainer.push(circuit);
arc1= new Circuit($('#sketch-holder').width() / 2, $('#sketch-holder').height() / 2, "arcs", {diam:[150, 300, 250, 200], theta:[-Math.PI/3, Math.PI+Math.PI/7, Math.PI/2, 2*Math.PI/3]});
circuitContainer.push(arc1);
arc2 = new Circuit($('#sketch-holder').width() / 2, $('#sketch-holder').height() / 2, "arcs", {diam:[125, 240, 200, 300], theta:[Math.PI/6, Math.PI-Math.PI/7, -Math.PI/3, -2*Math.PI/3]});
circuitContainer.push(arc2);
rectangle1 = new Circuit($('#sketch-holder').width() / 2, $('#sketch-holder').height() / 2, "rectangle", {height:100, width:300});
circuitContainer.push(rectangle1);
square1 = new Circuit($('#sketch-holder').width() / 2, $('#sketch-holder').height() / 2, "rectangle", {height:200, width:200});
circuitContainer.push(square1);

vectorB = { //describes the green vector B and the small increase element dl at position (diam/2, theta)
    x: circuit.x,
    y: circuit.y - circuit.diam / 2,
    length: 0,
    scaling: 2000,
    r: [],

    findDistanceToCenter(loop, angle){
        let distance =0;
        if (loop.type ==="circle"){
            distance = loop.diam;
        } else if (loop.type==="arcs"){
            let thisM= loop.args.diam.length-1;
            for (let m=0; m<loop.args.diam.length-1; m++){
                if (angle>=loop.args.theta[m] && angle<loop.args.theta[m+1]){
                    thisM=m;
                }
            }
            if (angle >= loop.args.theta[loop.args.theta.length-1] ||angle< loop.args.theta[0]){thisM = loop.args.theta.length-1;}
            distance= loop.args.diam[thisM];
        } else if (loop.type ==="rectangle"){
            let alpha = atan2(loop.h,loop.w);
            if (angle>= alpha-Math.PI && angle< -alpha ){ distance = Math.abs(loop.h/Math.sin(angle));
            } else if (angle>=-alpha && angle<alpha){distance = Math.abs(loop.w/Math.cos(angle));
            } else if (angle>=alpha && angle<Math.PI-alpha){distance = Math.abs(loop.h/Math.sin(angle));
            } else if (angle>= Math.PI-alpha || angle< alpha- Math.PI){distance = Math.abs(loop.w/Math.cos(angle));
            }
        }
        return distance;
    },
    updateAngle(loop) { //recursion of the angle
        if (loop.type==="arcs" && !notChangeAngle){
            for (let i=0; i<loop.args.theta.length; i++){
                if (theta>=loop.args.theta[i]-dTheta*5/6 &&theta <=loop.args.theta[i]+dTheta/6){ //we are around the value of loop.args.theta[i], angle to change in diameter
                    notChangeAngle=true;
                    if (i){stepLength = loop.args.diam[i]-loop.args.diam[i-1];}
                    else{stepLength = loop.args.diam[0]-loop.args.diam[loop.args.diam.length-1];}
                    t=0;
                }
            }
        }
        if (notChangeAngle && t >= Math.abs(stepLength)){
            notChangeAngle=false;
            theta+=dTheta;
            t=0;
        }
        else if (!notChangeAngle) {
            if (theta <= Math.PI) {
            theta += dTheta;

            } else {
                theta = -Math.PI+dTheta;
            }
            if (theta >= -Math.PI / 2 - dTheta && theta < -Math.PI / 2) {
                playing = false;
                theta = -Math.PI / 2;
            }
            countingFrames++;
        }
        else {
            t+=dt;
        }
    },

    update(wires, loop) { //update will redraw each arrow
        //update the position as we change the angle or the diameter
        let signIfStop=1;
        if (stepLength<0){signIfStop=-1;}
        let distance=this.findDistanceToCenter(loop, theta);
        if (notChangeAngle){
            distance += signIfStop*t;
        }
        this.x = loop.x + distance / 2 * Math.cos(theta);
        this.y = loop.y + distance / 2 * Math.sin(theta);

        //update the angle for the arrow
        let Bvect = calculateB(wires, this.x, this.y);
        this.length = vectorLength(Bvect) / mu0 * this.scaling;

        //draw the arrow
        let angle = (atan2(Bvect[1], Bvect[0])); //orientate geometry to the position of the cursor (draw arrows pointing to cursor)
        push(); //move the grid

        translate(this.x, this.y);

        stroke(0);
        fill(40, 200, 40, 200);
        rotate(angle);
        beginShape(); //create a shape from vertices
        vertex(0, 0);
        vertex(2 * this.length, -Math.sqrt(2 * this.length));
        vertex(2 * this.length, -Math.sqrt(4 * this.length));
        vertex(3 * this.length, 0);
        vertex(2 * this.length, Math.sqrt(4 * this.length));
        vertex(2 * this.length, Math.sqrt(2 * this.length));
        endShape(CLOSE);
        rotate(-angle);

        //draw small increase element dl
        strokeWeight(2);
        stroke(200, 0, 200);
        fill(0);
        push();
        if (loop.type==="arcs"||loop.type==="circle") {
            if (!notChangeAngle) {
                rotate(theta); //arrow on the circuit
            } else {
                rotate(theta-signIfStop*Math.PI/2);
            }
        }
        else {
            let alpha = atan2(loop.h,loop.w);
            if (theta>= alpha- Math.PI &&theta< -alpha ) {rotate(-Math.PI/2);
            } //do not rotate for RHS
            else if (theta>=alpha && theta<=Math.PI-alpha){rotate(Math.PI/2);
            } else if (theta>= Math.PI-alpha || theta<=alpha- Math.PI){rotate(Math.PI);
            } //last case needs no rotation
        }
        line(0, 0, -6, -10);
        line(0, 0, 6, -10);

        pop();
        //text for the arrows (vector B and small increase element dl
        strokeWeight(1);
        textSize(15);
        text("dl", 7, -7);

        fill(40, 200, 40);
        stroke(0);
        text("B", (3 * this.length +5)*Math.cos(angle), (3 * this.length+ 5)*Math.sin(angle));
        pop(); //reset the grid!
    }
};

function addWire(wires) {
    let index = wires.length;
    if (index<6){
        wires.push(new Wire(index%6 * $('#sketch-holder').width() / 6, 20, 5, index));
        wireSelected = index;
    }
    else if (index<11){
        wires.push(new Wire((index%6+1)*$('#sketch-holder').width()/6, $('#sketch-holder').height()-20, 5, index));
        wireSelected = index;
    }
    if (index > 10) { //maximum amount of wires we can add
        $('#buttonAddWire').hide();
    }

}

//tool to calculate the length of a vector as an array
function vectorLength(vector) {
    let modulus = 0;
    for (let i = 0; i < vector.length; i++) {
        modulus += Math.pow(vector[i], 2);
    }
    return Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));
}


/*function to calculate the value of B at a point [x, y] */
function calculateB(setOfWires, x, y) {
    let Bx = 0;
    let By = 0;
    //if several wires: we add linearly their contributions
    for (let j = 0; j < setOfWires.length; j++) {
        let distance = dist(x, y, setOfWires[j].x, setOfWires[j].y);
        const BConst = mu0 / 2 / Math.PI / Math.pow(distance, 2) * setOfWires[j].value;

        let r = [x - setOfWires[j].x, y - setOfWires[j].y];
        //rotate and multiply by value
        Bx += -BConst * r[1];
        By += BConst * r[0];
    }
    return [Bx, By];
}

function GetBVector(WirePositions, Currents, Point){
    //WirePositions is an array of wire positions
    //Currents is an array of the currents in the same order as WirePositions
    //Point is an array containing the x and y of a single position
    
    let n = WirePositions.length; //number of wires
    let x = Point[0]; //x coord of point of interest
    let y = Point[1]; //y coord of point of interest
    let r = 0;
    let B = 0;
    let Mu0 = 4*Math.PI* 10**(-7); 
    let CurrentBVector = [0,0];
    let TotalBVector = [0,0];

    for (let i = 0; i < n; i ++){ //loop through all the wires
        //r is the distance from the point to the current wire
        r = Math.sqrt((x - WirePositions[i][0])**2 + (y - WirePositions[i][1])**2);
        //Find magnitude of B vector at that point due to current wire
        B = Mu0*abs(Currents[i])/(2*Math.PI*r);
        //Find angle of vector - may be incorrect type of arctan...
        Theta = atan2((y - WirePositions[i][1]), (x - WirePositions[i][0]))+ (Current[i]/abs(Current[i]))*0.5*Math.PI;
        //get vector in cartesian format
        CurrentBVector = [B*Math.cos(Theta), B*Math.sin(Theta)];
        //sum up contributions from each wire
        TotalBVector += CurrentBVector; 
    }
    return TotalBVector;
}

/*calculate B.dl at an angle of rotation alpha (equivalent to method using [posX, posY] */
function calculateBdl(loop, wires, B, angle) {
    let k=false
    if (angle >= Math.PI){angle -= 2*Math.PI;}
    let dlLength;
    if (loop.type==="circle"){
        dlLength = circuit.diam / 2 * dTheta; //dl is a fraction of the circle
    } else if (loop.type ==="arcs"){
        let distance= vectorB.findDistanceToCenter(loop, angle);
        dlLength = distance/2*dTheta;
    } else if (loop.type ==="rectangle"){
        let distance=vectorB.findDistanceToCenter(loop, angle);
        let ratio = (loop.h+loop.w)/Math.PI/circuit.diam;
        dlLength = distance*dTheta*ratio;
    }
    let dl;
    if (loop.type=== "circle" ||loop.type=== "arcs") {
        dl = [Math.cos(angle), Math.sin(angle)];
        const dl2 = dl.slice(0); //create a copy of dl
        //rotate by  PI/2 to the right and scale by the length
        dl[0] = -dl2[1] * dlLength;
        dl[1] = dl2[0] * dlLength;
    } else if (loop.type ==="rectangle"){
        let alpha = atan2(loop.h,loop.w);
        if (angle >= alpha-Math.PI && angle< -alpha){dl = [dlLength, 0];
        } else if (angle>=-alpha&&angle<alpha){dl = [0, dlLength];
        } else if (angle>=alpha && angle<Math.PI-alpha){dl = [-dlLength, 0];
        } else if (angle>= Math.PI-alpha || angle < alpha-Math.PI){dl = [0, -dlLength];
        }
    }
    // return dlLength;
    return (B[0] * dl[0] + B[1] * dl[1])*(5*Math.pow(10, 8)); //return the value of B.dl
}

function calculateIntBdl(loop, wires, x, y){
    let intBdl=0;
    let Bdl2
    for (let i = -Math.PI / 2; i <= 3 * Math.PI / 2; i += dTheta){
        Bdl2=Bdl;
        let adjust=0;
        if (i>=Math.PI){adjust=1;}
        let distance=vectorB.findDistanceToCenter(loop, i-adjust*2*Math.PI);
        let posX = loop.x + distance / 2 * Math.cos(i);
        let posY = loop.y + distance / 2 * Math.sin(i);
        B = calculateB(wires, posX, posY);
        Bdl = calculateBdl(loop, wires, B, i);
        x.push(i + Math.PI / 2); // + PI/2 so that plot starts at 0, but does not affect calculations
        y.push(Bdl);
        intBdl += (Bdl + Bdl2) / 2;
    }
    if (loop.type==="arcs"){
        let stepLength2=0, stepLength2Sign=1;
        let t2;
        for (let i=0; i<loop.args.theta.length; i++){
            stepLength2Sign=1;
            if (i){stepLength2=loop.args.diam[i]-loop.args.diam[i-1];
            }
            else {stepLength2=loop.args.diam[0]-loop.args.diam[loop.args.theta.length];
            }
            if (stepLength2<0){stepLength2Sign=-1}
            for (t2=0; Math.abs(t2)<Math.abs(stepLength2); t2+=stepLength2Sign*dt){
                Bdl2=Bdl;
                let distance=vectorB.findDistanceToCenter(loop, loop.args.theta[i])+t2;
                let posX = loop.x + distance / 2 * Math.cos(loop.args.theta[i]);
                let posY = loop.y + distance / 2 * Math.sin(loop.args.theta[i]);
                B = calculateB(wires, posX, posY);
                Bdl = calculateBdl(loop, wires, B, i);
                intBdl += (Bdl + Bdl2) / 2;
            }
        }
    }
    return intBdl;
}

/* Now the plotly part */

//return plotly parameters for x and y:
function args_plot_Bdl(loop, wires) {
    x = [];
    y = [];
    trace = {};
    trace2 = {};
    trace3={};

   intBdl= calculateIntBdl(loop, wires, x, y);

    trace = {x: x, y: y, name: 'B.dl', type: 'scatter', width:5 };
    //trace3 shows the results as if all wires were located in the center
    let val3=0, y3=[];
    for (let p=0; p<y.length; p++){
        val3+=y[p];
    }
    if (y.length!==0){val3 = val3/y.length;}
    y3 = Array(y.length).fill(val3);
    trace3 = {x:x, y:y3, name:'average B.dl', type:'scatter', line:{color:'cornFlowerBlue', dash: 'dot', width:2, opacity:0.1} , fill:'tonexty'}
    trace2 = {
        x: [x[0]],
        y: [y[0]],
        name: 'Line integral',
        fill: 'tozeroy',
        type: 'scatter',
        mode: 'lines',
        line: {color: 'green'}
    };
    let minRange, maxRange, min = Math.min(...trace.y), max = Math.max(...trace.y);
    // the 3 dots allow to spread the array
    if (min <= 0 && max <= 0) { //both are less than 0
        minRange = 11 * min / 10; //a bit smaller than the minimum value
        maxRange = -min / 10; //since the minimum is negative, max
    }
    else if (min <= 0 && max >= 0) { //we have both negative and positive values
        minRange = 11 / 10 * min;
        maxRange = 11 / 10 * max;
    }
    else if (min >= 0 && max >= 0) {
        minRange = -1 / 10 * max;
        maxRange = 11 / 10 * max;
    }
    else {
        minRange = maxRange = min;
    }
    layout.yaxis.range = [minRange, maxRange];
}

//initial plot
function initialPlot() {
    layout = {
        title: {
        text: 'Line integral of <b>B.dl</b> around the loop',
        y: 0.7
        },
        autosize: true,
        xaxis: {
            title: 'θ',
            range: [-0.2, 2 * Math.PI + 0.2],
            autotick: false,
            ticks: 'outside',
            tick0: 0,
            dtick: Math.PI / 2,
        },
        yaxis: {
            title: 'B.dl',
            range: [-10 * Math.pow(10, -7), 10 * Math.pow(10, -7)],
            exponentformat: 'e',
            showexponent: 'all'
        },
        showlegend: true,
        legend: {
            x: 1,
            y: 0.5
        }

    };
    args_plot_Bdl(circuitContainer[circuitSelected], currentContainer);
    Plotly.newPlot('graph-holder', [trace, trace3,trace2], layout, {displayModeBar: false});
}

//button functions:
function buttonPlayFunction() {
    playing = !playing;
    if (playing){
        $('#buttonPlay').html('Pause');
        $('#buttonReset').show();
    } else {
        $('#buttonPlay').html('Play');
    }

    $( "#circuitSelectList, #diameterSlider, #currentSlider, #buttonAddWire, #buttonRemoveWires" ).prop( "disabled", true );
}

function buttonFieldFunction() {
    fieldDisplay = !fieldDisplay;
    if (fieldDisplay){
        $('#buttonField').html('Hide Magnetic Field');
    } else {
        $('#buttonField').html('Show Magnetic Field');
    }
}

function buttonAddWireFunction() {
    //only in start condition:
    if (checkStartPos()) {
        addWire(currentContainer);
        $('#buttonRemoveWires').show();
        if (currentContainer.length >= 11) {
            $('#buttonAddWire').hide();
        }
    }
    //disable field lines and field line button when more than 1 wire
    $('#buttonField').prop( "disabled", true );
    fieldDisplay = true;
    buttonFieldFunction();
}
function buttonRemoveWiresFunction() {
    if (checkStartPos()) {
        let currents = currentContainer.length;
        currentContainer.splice(1, currents - 1);
        $('#buttonRemoveWires').hide();
        $('#buttonAddWire').show();
        //$('#buttonField').show();
        wireSelected = 0;

        $('#buttonField').prop( "disabled", false );
        buttonFieldFunction();
    }
}
function buttonResetFunction() {
    playing = false;
    theta = -Math.PI / 2;
    vectorB.x = circuit.x;
    vectorB.y = circuit.y - circuit.diam / 2;
    currentContainer[0].x = circuit.x;
    currentContainer[0].y = circuit.y;
    buttonRemoveWiresFunction(); //remove all the other wires
    //reset the plot
    args_plot_Bdl(circuit, currentContainer);
    Plotly.react('graph-holder', [trace, trace3,trace2], layout, {displayModeBar: false});
    $( "#circuitSelectList, #diameterSlider, #currentSlider, #buttonAddWire, #buttonRemoveWires" ).prop( "disabled", false );
    $('#buttonPlay').html('Play');
    $('#buttonReset').hide();
}

function updateValuesFromSlider() {
    let val = $('#currentSlider').val();
    currentContainer[wireSelected].value = val;
    if (val >= 0) {
        currentContainer[wireSelected].valueSign = 1;
    } else {
        currentContainer[wireSelected].valueSign = -1;
    }
    $('#currentDynamicDisplay').html((Math.round(10*val)/10).toString().slice(0, 4) + " Amps");
    for (let k=0; k<circuitContainer.length; k++){
        if (circuitContainer[k].type ==="circle"){
            circuitContainer[k].diam = parseFloat($('#diameterSlider').val()); //update the diameter of the loop
        } else if (circuitContainer[k].type==="arcs"){
            for (let i=0; i<circuitContainer[k].args.theta.length; i++){
                circuitContainer[k].args.diam[i] = circuitContainer[k].args.diam1[i]*parseFloat($('#diameterSlider').val())/200;
            }
        } else if (circuitContainer[k].type ==="rectangle"){
            circuitContainer[k].h = circuitContainer[k].h1*(parseInt($('#diameterSlider').val())/200);
            circuitContainer[k].w = circuitContainer[k].w1*parseInt($('#diameterSlider').val())/200;
        }
    }


}

function checkStartPos() {
    if (!playing && theta >= -Math.PI / 2-dTheta/2 && theta <= -Math.PI / 2 + dTheta) {
        return true;
    } else {
        return false;
    }
}
//resize the canvas if the window size changes
function windowResized() {
    let width = $('#sketch-holder').width(), height = $('#sketch-holder').height();
    resizeCanvas(width, height);
}
//same for plotly
window.onresize = function () {
    Plotly.Plots.resize('graph-holder');
};
function mouseShape() {
    if (checkStartPos()) { //we are in the start position
        if (someWireClose && !mouseWasPressed) {
            $('#sketch-holder').css('cursor', 'grab');
        }
        else if (mouseWasPressed) {
            $('#sketch-holder').css('cursor', 'grabbing');
        }
        else {
            $('#sketch-holder').css('cursor', 'default');
        }
        someWireClose = false;
    }
}

function draw() {
    background(255);
    circuitContainer[circuitSelected].drawCircuit();
    for (let i = 0; i < currentContainer.length; i++) {
        if (checkStartPos()) {
            currentContainer[i].selectingWire(); //checks if we are currently selecting the wire
            if (wireSelected === i) {
                currentContainer[i].color = [50, 50, 200];
            }
            else {
                currentContainer[i].color = 0;
            }
            currentContainer[i].updateWirePos();
        }
        currentContainer[i].drawWire(); //always draw the wires
    }
    Wire.drawField(currentContainer);
    vectorB.update(currentContainer, circuitContainer[circuitSelected]); //redraw the arrows
    mouseShape();

    //when we are in start position:
    if (checkStartPos()) {
        updateValuesFromSlider();
        $('#wireSelected').html(parseInt(wireSelected.toString())+1);
        $('#buttonPlay').html('Play');

        //plotly parameters:
        countingFrames = 0; //not started the animation
        let intBdl2 = intBdl;
        args_plot_Bdl(circuitContainer[circuitSelected], currentContainer);
        if (intBdl2 !== intBdl) { // only if there's update of data
            $('#Bdl-text').html(`${(intBdl / mu0).toString().slice(0, 4)}*&mu;<sub>0<\sub>`); //print the value of Bdl on the page
            Plotly.react('graph-holder', [trace,trace3, trace2], layout, {displayModeBar: false});
        }
    } else { //we are not in start position, but we don't care if playing or not
        circuitContainer[circuitSelected].drawPath(); //draw path from start position to current position
    }

    //while we play: we update the plotly graph to have the trace, we update the angle for the arrow
    if (playing) {
        currentContainer[wireSelected].color = 0;
        vectorB.updateAngle(circuitContainer[circuitSelected]); //we update the position of the arrow on the circuit
        trace2.x = trace.x.slice(0, countingFrames + 1);
        trace2.y = trace.y.slice(0, countingFrames + 1);
        // trace3.
        Plotly.react('graph-holder', [trace, trace2], layout, {displayModeBar: false});
        if (!playing) { //the precedent update set playing to false
            $( "#circuitSelectList, #diameterSlider, #currentSlider, #buttonAddWire, #buttonRemoveWires" ).prop( "disabled", false );

        }
    }
}