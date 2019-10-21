/*jshint esversion:7*/


//Vis1


//C: Interactivity

//A: Global Initial Parameters:

/* Start by putting in all initial parameters you want and any constants you want to use (e.g. G = 6.67*10**(-11),
any layout properties (which you probably want to keep constant for an individual part of a visualisation
should go here */
function main() {

    var layout = {
        autosize: true,
        margin: {l:30, r:30, t:30, b:30},
        hovermode: "closest",
        showlegend: false,
        xaxis: {range: [-5, 5], zeroline: true},
        yaxis: {range: [-5, 5], zeroline: true},
        aspectratio: {x:1, y:1},
    };
    
    
    //B: Maths
    
    /*Next comes all the mathematical functions that are used, if you think a library will do a particular job
    that's fine, no need to recreate stuff, but any functions you need to construct yourself should go in this
    next block*/
    
    function computeBasis(x3) {
    
        circ11 = new Circle(0.5,Math.abs(x3));//opacity of circle proportional to magnitude of current
    
        circ12 = new Circle(0.25,Math.abs(x3));
    
        cross11  = new Line2d([[3-0.35355,3-0.35355],[3+0.35355,3+0.35355]]);
        cross12  = new Line2d([[3-0.35355,3+0.35355],[3+0.35355,3-0.35355]]);
    
    
        var data=[        
            circ11.gObject(black,[3,3]),
        ];
    
        let n = Math.round(8*Math.sqrt(Math.abs(x3)));
    
        if (x3 > 0) {
            data.push(
                circ12.gObject(black, [3, 3])
                );
    
            for (let i = 0; i < n+1; i++) {
                ypos = -2 + Math.sqrt(i/n)*4;
                line = new Line2d([[-10, ypos], [10, ypos]]).gObject(black, 1, 3);
                data.push(line);
            }
        } else if (x3 < 0){
            data.push(        
                cross11.gObject(black, Math.abs(x3), 2+3*Math.abs(x3)),
                cross12.gObject(black, Math.abs(x3), 2+3*Math.abs(x3))
                );
    
            for (let i = 0; i < n+1; i++) {
                ypos = 2 - Math.sqrt(i/n)*4;
                line = new Line2d([[-10, ypos], [10, ypos]]).gObject(black, 1, 3);
                data.push(line);
            }
    
                
        } else if (x3 == 0) {
            data = [
                new Line2d([[-10, -2], [10, -2]]).gObject(black, 1, 3),
                new Line2d([[-10, 2], [10, 2]]).gObject(black, 1, 3)
            ];
        }
    
        return data;
    }
    
    //C: Interactivity
    
    /* We've now got all the functions we need to use such that for a given user input, we have a data output that we'll use.
    Now we just have to actually obtain the user input from the HTML file by using JQuery and then plot everything relevant that we want to see*/
    
    function initCarte() {
    }
    
    
    //D: Calling
    
    /* Now we have to ask the plots to update every time the user interacts with the visualisation. Here we must both
    define what we want it to do when it updates, and then actually ask it to do that. These are the two functions below.
    */
    
    function updatePlot() {
    
        x3 = parseFloat(document.getElementById('x3Controller').value);
        data = computeBasis(x3);
    
        Plotly.animate(
            'graph-holder',
            {data: data},
            {
                fromcurrent: true,
                transition: {duration: 0,},
                frame: {duration: 0, redraw: false,},
                mode: "immediate"
            }
        );
    }
    
        initCarte();
        /*Jquery*/ //NB: Put Jquery stuff in the main not in HTML
        $("input[type=range]").each(function () {
            /*Allows for live update for display values*/
            $(this).on('input', function(){
                //Displays: (FLT Value) + (Corresponding Unit(if defined))
                $("#"+$(this).attr("id") + "Display").val( $(this).val());
                //NB: Display values are restricted by their definition in the HTML to always display nice number.
                updatePlot(); //Updating the plot is linked with display (Just My preference)
            });
    
            //Update sliders if value in box is changed
            $("#x3ControllerDisplay").change(function () {
            var value = this.value;
            $("#x3Controller").val(value);
            });
    
        });
    
    
        }
    
    $(document).ready(main); //Load main when document is ready.
    

//JS for Vis2
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

let width = $('#sketch-holder').width(), height = $('#sketch-holder').height(), neutralpoints = [], allpoints = [], maxpoints = 10; //activepoints = []
const Nvertices = 1700, max_range = 1500, R = 16, square_size = 100, padding = 50, rect_height = height/8, arrow_size = 5;

let currentContainer = [], circuitContainer=[], arrows = [], myCanvas, countingFrames = 0, notChangeAngle=false, stepLength=1,t=10;
let vectorB, circuit, arc1,arc2, rectangle1, square1, theta = -Math.PI / 2, magFieldScaling = 200;
let dTheta = 0.5, dt=10, mu0 = 4 * Math.PI * Math.pow(10, -7);
let fieldDisplay = true, playing = false, mouseWasPressed = false, someWireClose = false, wireSelected = 0, circuitSelected = 0, loopActive = true, hasPlayed = false;
let fieldFlow = false, field = 0;

/* Now the plotly part of declaration */
let trace = {x: [], y: []}, layout, trace2 = {x: [], y: []}, trace3 = {x:[], y:[]};
let x = [], y = [], r = [];
let B, Bdl = 0, intBdl = 0;

let doDraw = true;

var arr = [];
function setup() {
    let width = $('#sketch-holder').width(), height = $('#sketch-holder').height();
    //link the functions to the buttons
    $('#buttonAddWire').click(buttonAddWireFunction);
    $('#buttonRemoveWires').click(buttonRemoveWiresFunction);
    $('#buttonRemoveWires').hide();
    $('#buttonFieldFlow').click(buttonFieldFlowFunction);
    $('#buttonPlay').click(buttonPlayFunction);
    $('#buttonReset').click(buttonResetFunction);
    $('#buttonReset').hide();
    $("#fieldList").on('change', function(){
        field = this.value;
    });
    $("#circuitSelectList").on('change', function(){
        circuitSelected = this.value;
    });

    myCanvas = createCanvas(width, height);
    myCanvas.parent('sketch-holder');
    frameRate(120);
    currentContainer.push(new Wire(circuit.x, circuit.y, 5, 0));
    initialPlot();

    //Create field of arrows
    for(i=0; i<width; i+=20) {
        for(j=0; j<height; j+=20){
            arr.push(new Arrow(i, j, 10));
        }
    }
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
                diam:args.diam, //each of them is an array of the same length containing the starting angle and diameter of the arcs
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
        stroke('red');
        strokeWeight(3);
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
        strokeWeight(3);
        stroke('green');
        noFill();
        translate(this.x, this.y);
        if (this.type ==="circle") {
            arc(0, 0, this.diam, this.diam, 3 * Math.PI / 2, theta);
        } else if (this.type==="arcs") {
            /*let maxM = -1; //draw further than maxM
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
            }*/
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
        fill(-1000*Math.pow(this.value,3), 100, 1000*Math.pow(this.value,3));
        ellipse(this.x, this.y, this.widthOuter, this.widthOuter);
        fill(0);
        strokeWeight(1);
        //change for cross if current is positive, dot if negative
        //if (this.valueSign >= 0) {
            //line(this.x - this.widthInner, this.y - this.widthInner, this.x + this.widthInner, this.y + this.widthInner);
            //line(this.x + this.widthInner, this.y - this.widthInner, this.x - this.widthInner, this.y + this.widthInner);
        //} else {
            //negative current represented by vector 3D notation (small dot in the middle)
            //strokeWeight(3);
            //fill(255, 204, 0);
            //ellipse(this.x, this.y, this.widthInner, this.widthInner);
        //}
        strokeWeight(1);
        textSize(15);
        let textI = 'I (' + this.index + ') =' + this.value;
        text(textI, this.x + 10, this.y + 10);
        pop();
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


var Path = [];
var stepSize = 0.1;
scale = parseInt($('#diameterSlider').val())/2;
var oldType = -1;
var oldScale = -1;

getPath();

//Paths must be specified to start from directly above the centre point (theta = pi/2) otherwise code won't work (not my code)
function getPath() { //create array of (x,y) for each path
    scale = parseFloat($('#diameterSlider').val())/2;
    circuitSelected = parseInt(circuitSelected);
    //console.log(scale, oldScale, circuitSelected, oldType);

    if(scale !== oldScale || circuitSelected !== oldType){
            Path = []
            //console.log('update path');
            if (circuitSelected == 0) { //Circle path
            stepSize = 0.03;
            for(i=-Math.PI; i<Math.PI; i+=stepSize){
                x = scale*Math.cos(i + Math.PI/2) + width/2;
                y = scale*Math.sin(i + Math.PI/2) + height/2;
                Path.push([x,y]);
            };

            //Ensures green trace matches with arrow
            dTheta = 2*Math.PI/Path.length;
    }

            else if(circuitSelected == 1){ //Arc1 Path
                stepSize = 0.05;
                correction =0;

                for(i=-Math.PI/2; i<-Math.PI/3; i+= stepSize){
                    x = 0.75*scale*Math.cos(i) + width/2;
                    y = 0.75*scale*Math.sin(i) + height/2;
                    Path.push([x,y]);
                }

                for(i=0.75; i < 1.5; i+= stepSize){
                    x = i*scale*Math.cos(-Math.PI/3) + width/2;
                    y = i*scale*Math.sin(-Math.PI/3) + height/2;
                    Path.push([x,y]);
                    correction ++;
                }

                for(i=-Math.PI/3; i < Math.PI/2; i+= stepSize) {
                    x = 1.5*scale*Math.cos(i) + width/2;
                    y = 1.5*scale*Math.sin(i) + height/2;
                    Path.push([x,y]);
                }

                for(i=1.5; i > 1.25; i-= stepSize){
                    x = i*scale*Math.cos(Math.PI/2) + width/2;
                    y = i*scale*Math.sin(Math.PI/2) + height/2;
                    Path.push([x,y]);
                    correction ++;
                }

                for(i=Math.PI/2; i < 2*Math.PI/3; i+= stepSize) {
                    x = 1.25*scale*Math.cos(i) + width/2;
                    y = 1.25*scale*Math.sin(i) + height/2;
                    Path.push([x,y]);
                }

                for(i=1.25; i > 1; i-= stepSize){
                    x = i*scale*Math.cos(2*Math.PI/3) + width/2;
                    y = i*scale*Math.sin(2*Math.PI/3) + height/2;
                    Path.push([x,y]);
                    correction ++;
                }

                for(i=2*Math.PI/3; i < 8*Math.PI/7; i+= stepSize) {
                    x = 1*scale*Math.cos(i) + width/2;
                    y = 1*scale*Math.sin(i) + height/2;
                    Path.push([x,y]);
                }

                for(i=1; i > 0.75; i-= stepSize){
                    x = i*scale*Math.cos(8*Math.PI/7) + width/2;
                    y = i*scale*Math.sin(8*Math.PI/7) + height/2;
                    Path.push([x,y]);
                    correction ++;
                }

                for(i=8*Math.PI/7; i < 3*Math.PI/2; i+= stepSize) {
                    x = 0.75*scale*Math.cos(i) + width/2;
                    y = 0.75*scale*Math.sin(i) + height/2;
                    Path.push([x,y]);
                }

                //Ensures green trace matches with arrow (correcting for radial out/in parts)
                dTheta = 2*Math.PI/(Path.length -correction+6);

            }

            else if(circuitSelected == 2){ //Arc2 Path
                stepSize = 0.05;
                correction=0;

                for(i=-Math.PI/2; i<-Math.PI/3; i+= stepSize){
                    x = 0.625*scale*Math.cos(i) + width/2;
                    y = 0.625*scale*Math.sin(i) + height/2;
                    Path.push([x,y]);
                }

                for(i=0.625; i < 1.2; i+= stepSize){
                    x = i*scale*Math.cos(-Math.PI/3) + width/2;
                    y = i*scale*Math.sin(-Math.PI/3) + height/2;
                    Path.push([x,y]);
                    correction ++;
                }

                for(i=-Math.PI/3; i<Math.PI/6; i+= stepSize){
                    x = 1.2*scale*Math.cos(i) + width/2;
                    y = 1.2*scale*Math.sin(i) + height/2;
                    Path.push([x,y]);
                }

                for(i=1.2; i > 1; i-= stepSize){
                    x = i*scale*Math.cos(Math.PI/6) + width/2;
                    y = i*scale*Math.sin(Math.PI/6) + height/2;
                    Path.push([x,y]);
                    correction ++;
                }

                for(i=Math.PI/6; i<6*Math.PI/7; i+= stepSize){
                    x = 1*scale*Math.cos(i) + width/2;
                    y = 1*scale*Math.sin(i) + height/2;
                    Path.push([x,y]);
                }

                for(i=1; i < 1.5; i+= stepSize){
                    x = i*scale*Math.cos(6*Math.PI/7) + width/2;
                    y = i*scale*Math.sin(6*Math.PI/7) + height/2;
                    Path.push([x,y]);
                    correction ++;
                }

                for(i=6*Math.PI/7; i< 4*Math.PI/3; i+= stepSize){
                    x = 1.5*scale*Math.cos(i) + width/2;
                    y = 1.5*scale*Math.sin(i) + height/2;
                    Path.push([x,y]);
                }

                for(i=1.5; i > 0.625; i-= stepSize){
                    x = i*scale*Math.cos(4*Math.PI/3) + width/2;
                    y = i*scale*Math.sin(4*Math.PI/3) + height/2;
                    Path.push([x,y]);
                    correction ++;
                }

                for(i=4*Math.PI/3; i< 3*Math.PI/2; i+= stepSize){
                    x = 0.625*scale*Math.cos(i) + width/2;
                    y = 0.625*scale*Math.sin(i) + height/2;
                    Path.push([x,y]);
                }

            dTheta = 2*Math.PI/(Path.length -correction+8);
            }

            else if(circuitSelected == 3){ //Rectangle Path
                stepSize = 2;

                for(i=0; i < 1.5*scale; i+=stepSize){
                    Path.push([i + width/2, -0.5*scale + height/2]);}
                for(i=0; i < scale; i+=stepSize){
                    Path.push([1.5*scale + width/2, -0.5*scale + i + height/2]);}
                for(i=0; i < 3*scale; i+=stepSize){
                    Path.push([1.5*scale - i + width/2, 0.5*scale + height/2]);}
                for(i=0; i < scale; i+=stepSize){
                    Path.push([-1.5*scale + width/2, -i +0.5*scale + height/2]);}
                for(i=0; i < 1.5*scale; i+=stepSize){
                    Path.push([i -1.5*scale + width/2, -0.5*scale + height/2]);}

                //Ensures green trace matches with arrow
                dTheta = 2*Math.PI/Path.length;
            }

            else if(circuitSelected == 4){ //Square Path
                stepSize = 2;
                for(i=0; i<= scale -stepSize; i+=stepSize) {
                    Path.push([i + width/2, -scale + height/2])}
                for(i=0; i <= 2*scale -stepSize ; i+=stepSize){
                    Path.push([scale + width/2, -scale + i + height/2]);}
                for(i=0; i <= 2*scale - stepSize ; i+=stepSize){
                    Path.push([scale - i + width/2, scale + height/2]);}
                for(i=0; i <= 2*scale - stepSize ; i+=stepSize){
                    Path.push([-scale + width/2, -i + scale + height/2]);}
                for(i=0; i <= scale - stepSize ; i+=stepSize){
                    Path.push([i -scale + width/2, -scale + height/2]);}

                //Ensures green trace matches with arrow
                dTheta = 2*Math.PI/Path.length;
            }

            else (console.log('No circuit selected'));


    } else {};

    oldType = circuitSelected;
    oldScale = scale;
}


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
                    if (i){stepLength = (loop.args.diam[i]-loop.args.diam[i-1]);}
                    else{stepLength = (loop.args.diam[0]-loop.args.diam[loop.args.diam.length-1]);}
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
        }
        else {
            t+=dt;
        }
        //Progresses green area in Bdl graph
        countingFrames += 1;
    },

    update(wires, loop) { //update will redraw each arrow
        //update the position as we change the angle or the diameter
        let signIfStop=1;
        if (stepLength<0){signIfStop=-1;}

        if(!notChangeAngle){
            distance=this.findDistanceToCenter(loop, theta-dTheta);
        }

        if (notChangeAngle){
            thetaOld = theta - dTheta;
            distance=this.findDistanceToCenter(loop, thetaOld);

            distance += signIfStop*t;

        }


        this.x = loop.x + distance / 2 * Math.cos(theta);
        this.y = loop.y + distance / 2 * Math.sin(theta);

        //update the angle for the arrow
        let Bvect = calculateE(wires, this.x, this.y);
        //scales arrow to reasonable size
        this.length = Math.pow(vectorLength(Bvect), 0.4) / mu0 * this.scaling*0.00003;
0
        //draw the arrow
        let angle = (atan2(Bvect[1], Bvect[0]));
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


        //Rotates dl arrow as we go around loop
        if (loop.type==="arcs"||loop.type==="circle") {
            if (!notChangeAngle) {
                rotate(theta); //arrow on the circuit
            } else {
                //Rotates dl to radial out direction if going radially out
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
        text("E", (3 * this.length +5)*Math.cos(angle), (3 * this.length+ 5)*Math.sin(angle));
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

function calculateE(setOfCharges, x, y){
    let Fx = 0, Fy = 0;
        for (let k = 0; k < setOfCharges.length; k++) {
            let r = Math.sqrt(((x - setOfCharges[k].x) ** 2 + (y - setOfCharges[k].y) ** 2));

            //Calcuating the field strength
            Fx += (setOfCharges[k].value)*(x - setOfCharges[k].x) / (Math.pow(r,3));
            Fy += (setOfCharges[k].value)*(y - setOfCharges[k].y) / (Math.pow(r,3));

        }

        Fx = Fx * Math.pow(10, -5);
        Fy = Fy * Math.pow(10, -5);

        //Background field options
        if(field != 0){
            if(field == 1){
                Fx = Fx+(0.000000005);
            } else if (field == 2){
                Fx = Fx + (0.00000000005 * x);
            } else if (field == 3){
                Fx = Fx + (0.00000003* Math.pow(sin(0.01*x),2));
            }
        }
    return [Fx , Fy];
}

/*calculate B.dl at an angle of rotation alpha (equivalent to method using [posX, posY] */
function calculateBdl(loop, wires, B, angle, distance) {
    ratio = 1;
    let k=false

    //More general integration
    angleB = atan2(B[1], B[0]);
    magB = vectorLength(B);

    //find dl
    x1 = Path[i][0];
    x2 = Path[i+1][0];
    y1 = Path[i][1];
    y2 = Path[i+1][1];

    magDl = Math.pow(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2), 0.5);
    angleDl = atan2(y2-y1, x2-x1);

    deltaTheta = angleDl-angleB;

    Bdl = magDl*magB*Math.cos(deltaTheta);


    return Bdl;
}

function calculateIntBdl(loop, wires, x, y){
    let intBdl=0;
    let Bdl2
    for(i=0; i<Path.length-1; i++){
        Bdl2=Bdl;
        let adjust=0;
        if (i>=Math.PI){adjust=1;}
        let distance=vectorB.findDistanceToCenter(loop, i-adjust*2*Math.PI);
        let posX = Path[i][0];
        let posY = Path[i][1];
        B = calculateE(wires, posX, posY);
        Bdl = calculateBdl(loop, wires, B, i, distance);
        x.push(i); // + PI/2 so that plot starts at 0, but does not affect calculations
        y.push(Bdl*(Math.pow(10, 8)));
        intBdl += (Bdl + Bdl2) / 2;
    };
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

    intBdl = calculateIntBdl(loop, wires, x, y);
    //console.log(integration_simps(x,y));
    //intBdl = integration_simps(x,y);
    //console.log(simpsIntBdl);


    //trace3 shows the results as if all wires were located in the center
    let val3=0, y3=[];
    for (let p=0; p<y.length; p++){
        val3+=y[p];
    }
    if (y.length!==0){val3 = val3/y.length;}
    y3 = Array(y.length).fill(val3);

    //correct for integration errors and make average always zero
    for (let i=0; i<y.length; i++){
        y[i] = y[i]-val3;

        //filters tiny values
        if(Math.abs(y[i]) < Math.pow(10, -8)){ y[i] =0;};
    }

    //recalculate average
    for (let p=0; p<y.length; p++){
        val3+=y[p];
    }
    if (y.length!==0){val3 = val3/y.length;}
    y3 = Array(y.length).fill(val3);

    trace = {x: x, y: y, name: 'E.dl', type: 'scatter', width:5 };
    trace3 = {x:x, y:y3, name:'average E.dl', type:'scatter', line:{color:'cornFlowerBlue', dash: 'dot', width:2, opacity:0.1} , fill:'tonexty'}
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
        text: 'Line integral of <b>E.dl</b> around the loop',
        y: 0.8
        },
        autosize: true,
        xaxis: {
            rangemode: 'tozero',
            autorange: true,
            title: 'Number of Steps',
            //range: [-10, scale*8+10],//2 * Math.PI + 0.2],
            autotick: true,
            //ticks: 'outside',
            //tick0: 0,
            //dtick: Math.PI / 2,
        },
        yaxis: {
            showticklabels: true,
            title: 'E.dl',
            range: [-1, 1],
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
}

//Button Functions

function buttonAddWireFunction() {
    //only in start condition:
    if (checkStartPos()) {
        addWire(currentContainer);
        $('#buttonRemoveWires').show();
        if (currentContainer.length >= 11) {
            $('#buttonAddWire').hide();
        }
    }
}
function buttonRemoveWiresFunction() {
    if (checkStartPos()) {
        let currents = currentContainer.length;
        currentContainer.splice(1, currents - 1);
        $('#buttonRemoveWires').hide();
        $('#buttonAddWire').show();
        $('#buttonField').show();
        wireSelected = 0;
    }
}

function buttonFieldFlowFunction() {
    fieldFlow = !fieldFlow;
    arr = []
    for(i=0; i<width; i+=20) {
        for(j=0; j<height; j+=20){
            arr.push(new Arrow(i, j, 10));
        }
    }
}

function buttonResetFunction() {
    playing = false;
    theta = -Math.PI / 2;
    notChangeAngle = false;
    vectorB.x = circuit.x;
    vectorB.y = circuit.y - circuit.diam / 2;
    currentContainer[0].x = circuit.x;
    currentContainer[0].y = circuit.y;
    buttonRemoveWiresFunction(); //remove all the other wires
    //reset the plot
    args_plot_Bdl(circuit, currentContainer);
    $( "#circuitSelectList, #diameterSlider, #currentSlider, #buttonAddWire, #buttonRemoveWires" ).prop( "disabled", false );
    $('#buttonPlay').html('Play');
    $('#buttonReset').hide();
}

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

function updateValuesFromSlider() {
    let val = $('#currentSlider').val();
    currentContainer[wireSelected].value = val;
    if (val >= 0) {
        currentContainer[wireSelected].valueSign = 1;
    } else {
        currentContainer[wireSelected].valueSign = -1;
    }

    //get new path
    getPath();


    $('#currentDynamicDisplay').html((Math.round(10*val)/10).toString().slice(0, 4) + " Coulombs");
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



var Bxdisp = 0;
var Bydisp = 0;


function Arrow(x, y, length) {
    this.x = x;
    this.y = y;
    this.Bxdisp = Bxdisp;
    this.Bydisp = Bydisp;

    this.update = function(){
        push();

        Bvec = calculateE(currentContainer, this.x, this.y);

        if(field != 0){
            if(field == 1){
                Bxdisp = Bvec[0]+(0.000000005);
                Bydisp = Bvec[1];
                Bvec = [Bxdisp, Bydisp];
            } else if (field == 2){
                Bxdisp = Bvec[0] + (0.00000000005 * this.x);
                Bydisp = Bvec[1];
                Bvec = [Bxdisp, Bydisp];
            } else if (field == 3){
                Bxdisp = Bvec[0] + (0.00000003* Math.pow(sin(0.01*this.x),2));
                Bydisp = Bvec[1];
                Bvec = [Bxdisp, Bydisp];
            }
        }



        if(fieldFlow){
            this.Bxdisp = (Bvec[0]/mu0)*50;
            this.Bydisp = (Bvec[1]/mu0)*50;
            this.x = this.x + this.Bxdisp;
            this.y = this.y + this.Bydisp;
        };

        translate(this.x, this.y);
        let angle = atan2(Bvec[1], Bvec[0]);
        amplitude = vectorLength(Bvec);
        this.length = Math.pow(amplitude, 0.5)*3*10000;
        if(this.length > 18){
            this.length = 18;
        }

        //change colour of wire based on field strength
        fill(255 - amplitude*4000000000, 255 - amplitude*1500000000, 255);

        rotate(angle);
        beginShape();
        vertex(0, -0.5*this.length);
        vertex(3*this.length, 0);
        vertex(0, 0.5*this.length);
        endShape(CLOSE);
        pop();//reset the grid
    }
};



//stop drawing when mouse not in visualisation part (this fixes performance issues with container_journey)
//doDraw = false;
//let drawNumber = 0
//$( ".container_vis" ).mouseenter(function(){doDraw = true;});
//$( ".container_vis" ).mouseleave(function(){doDraw = false;});



let done=false;
function draw() {
        background(255);

        if(fieldDisplay){
            fill(255-100,255-0,255-0);
            for(k=0; k<arr.length; k++){
                arr[k].update();
            }
            Arrow(width/2,height/2,20);
        };



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

        if(loopActive){
            vectorB.update(currentContainer, circuitContainer[circuitSelected]); //redraw the arrows
        }

        mouseShape();

        if(playing){hasPlayed = true;}

        //when we are in start position:
        if (checkStartPos()) {
            updateValuesFromSlider();
            $('#wireSelected').html(parseInt(wireSelected.toString())+1);
            if(hasPlayed === true){$('#buttonPlay').html('Play');}

            //plotly parameters:
            countingFrames = 0; //not started the animation
            let intBdl2 = intBdl;
            args_plot_Bdl(circuitContainer[circuitSelected], currentContainer);
            if (intBdl2 !== intBdl) { // only if there's update of data
                printIntBdl = Math.round((intBdl/mu0));
                $('#Bdl-text').html(`${(printIntBdl).toString().slice(0, 4)}`); //print the value of Bdl on the page
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
            if (!playing) { //the precedent update set playing to false
                $( "#circuitSelectList, #diameterSlider, #currentSlider, #buttonAddWire, #buttonRemoveWires" ).prop( "disabled", false );

            }
        }

        /* //Draw Path for debugging
        for(i=0; i<Path.length-1; i+=2){
            line(Path[i][0], Path[i][1], Path[i+1][0], Path[i+1][1]);
        }
        //}*/
        //drawNumber ++

}


