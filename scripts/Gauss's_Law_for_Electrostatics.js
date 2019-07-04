//set global variables
let width = $('#sketch-holder').width(), height = $('#sketch-holder').height(),activepoints = [],activenegpoints = [],
activepospoints = [],maxpoints=10;
const n_lines = 8,Nvertices=1700,max_range=1500, R=16, square_size=100,padding = 50,rect_height = height/8,
arrow_size=5;


class volume_element {

constructor(x,y,w,l) {
    this.y = y
    this.x = x
    this.w = w
    this.l = l
}
}

class charge {
    constructor(q,x,y){
        this.q = q
        this.x = x
        this.y=y
        this.r = R
        this.clicked = false
    if (q>0){
        this.color = "#FF8900"
    }
    else{ this.color = "#0091D4"}
}

    pressed(){
        if (dist(mouseX,mouseY,this.x,this.y)<this.r){
            this.clicked = true
        };
    }
    dragposition(mx,my){
        let pointsnearmouse = 0, thisFrameMouseX = mouseX, thisFrameMouseY = mouseY;

                this.x=thisFrameMouseX
                this.y=thisFrameMouseY
}

    intersect(){
        let areintersecting = false;
        for (let i = 0; i < activepoints.length; i++) {
            if(activepoints[i]!=this){
                if (parseFloat(dist(mouseX,mouseY,activepoints[i].x,activepoints[i].y))<=R*2){
                    areintersecting=true
            }
            }
        }
            if (parseFloat(Math.abs(mouseX-v1.x))<=R && v1.y-R <= mouseY && mouseY <= v1.y+v1.l+R){
            areintersecting=true
            }
            if (parseFloat(Math.abs(mouseX-v1.x-v1.w))<=R && v1.y-R<= mouseY && mouseY <= v1.y+v1.l+R){
            areintersecting=true
            }
            if (parseFloat(Math.abs(mouseY-v1.y-v1.l)) <=R && v1.x-R<= mouseX && mouseX<= v1.x+v1.w+R){
            areintersecting=true
            }
            if (parseFloat(Math.abs(mouseY-v1.y))<=R && v1.x-R<= mouseX && mouseX <= v1.x+v1.w+R){
            areintersecting=true
            }

        return areintersecting;
    }
};

class charge_selector{
        constructor(q,x,y){
        this.q = q
        this.x = x
        this.y=y
        this.r = R
        this.clicked = false
    if (q>0){
        this.color = "#FF8900"
    }
    else{ this.color = "#0091D4"}
}

    pressed(){
        if (dist(mouseX,mouseY,this.x,this.y)<this.r){
            let q = new charge(this.q,this.x,this.y)
            q.pressed()
            activepoints.push(q)
            if (q.q>0){
                activepospoints.push(q)
            }else{activenegpoints.push(q)}

        };
    }
}

function initial_fieldpoints(Qposition,R,number_of_lines){
    let x0=[],y0=[];
    for (let i = 0; i < number_of_lines; i++) {
        let theta = 2*i*(Math.PI/number_of_lines);
        x0.push(Qposition[0]+R*Math.cos(theta));
        y0.push(Qposition[1]+R*Math.sin(theta));
    };
    return([x0,y0])
    };




function draw_fieldlines(initialx,initialy,q){
    let xfield0 = initialx, yfield0 = initialy, xfield1=0,yfield1=0;
    for (let i = 0;i<Nvertices;i++) {
        if(xfield0>width+padding || xfield0<0-padding||yfield0>height+padding||yfield0<0-padding){return};
        let Fx = 0, Fy = 0, Ftotal;
        for (let k = 0; k < activepoints.length; k++) {
            let r = Math.sqrt(((xfield0- activepoints[k].x) ** 2 + (yfield0 -activepoints[k].y) ** 2));
            if(r<1){
                return;
            }
            Fx += (activepoints[k].q)*(xfield0 - activepoints[k].x) / (Math.pow(r,3));
            Fy += (activepoints[k].q)*(yfield0 - activepoints[k].y) / (Math.pow(r,3));
            };
        Ftotal = Math.sqrt(Fx ** 2 + Fy ** 2)
        let dx = q*(max_range / Nvertices) * (Fx / Ftotal),
            dy = q*(max_range / Nvertices) * (Fy / Ftotal);
        xfield1=xfield0+dx;
        yfield1=yfield0+dy;
        stroke("rgb(120, 120, 120)");
        line(xfield0, yfield0, xfield1, yfield1);
        if (i==Math.round(Nvertices/12)) {
            line(xfield0-q*dy*arrow_size , yfield0 +q*dx*arrow_size, xfield0+arrow_size*q*dx, yfield0+arrow_size*q*dy)
            line(xfield0+ q*dy*arrow_size, yfield0 -q*dx*arrow_size, xfield0+arrow_size*q*dx, yfield0+arrow_size*q*dy)
        }
        xfield0 = parseFloat(xfield1)
        yfield0=parseFloat(yfield1)
        }
    };



//functions that 'move' a charge when it is clicked
function mousePressed() {
    for (let i = 0; i < activepoints.length; i++) {
        activepoints[i].pressed()
    }
    selpos.pressed()
    selneg.pressed()
};

function mouseReleased() {

    for (let i = 0; i < activepoints.length; i++) {
        if(activepoints[i].y<rect_height || activepoints[i].y>height|| activepoints[i].x> width || activepoints[i].x<0 ){
            activepoints.splice(i,1);
        }else{
        activepoints[i].clicked=false;
        }
    }
        for (let i = 0; i < activenegpoints.length; i++) {
        if(activenegpoints[i].y<rect_height || activenegpoints[i].y>height || activenegpoints[i].x> width || activenegpoints[i].x<0 ){
            activenegpoints.splice(i,1);
        }else{
        activepoints[i].clicked=false;
        }
    }
        for (let i = 0; i < activepospoints.length; i++) {
        if(activepospoints[i].y<rect_height || activepospoints[i].y>height || activepospoints[i].x> width || activepospoints[i].x<0 ){
            activepospoints.splice(i,1);
        }else{
        activepospoints[i].clicked=false;
        }
    }

};


selpos = new charge_selector(1,width/3,rect_height/2);
selneg = new charge_selector(-1,width*2/3,rect_height/2);
v1 = new volume_element(width/2, height/2, width/8,width/8);

//draw canvas in which everything p5.js happens
function setup() {
  let canvas = createCanvas(width,height);
    canvas.parent('sketch-holder');
    frameRate(60);
};

//main function that repeats as soon as the last line is called
function draw() {
    clear();
    background('#ffffff');
    // noStroke();
    stroke("#48A9A6");
    fill("#ffffff");
    rect(v1.x, v1.y, v1.l,v1.w);

    for (let i = 0; i < activepoints.length; i++) {
        if(activepoints[i].clicked==true&&activepoints[i].intersect()==false){
            activepoints[i].dragposition()
        }
    }

    for (let i = 0; i <activepospoints.length; i++) {
        let [x0, y0] = initial_fieldpoints([activepospoints[i].x, activepospoints[i].y], activepospoints[i].r, n_lines);
        for (let j = 0; j < x0.length; j++) {
            draw_fieldlines(x0[j], y0[j], activepospoints[i].q)
        }
    }

    for (let i = 0; i <activenegpoints.length; i++) {
        let [x0,y0]=initial_fieldpoints([activenegpoints[i].x,activenegpoints[i].y],activenegpoints[i].r,n_lines);
        for (let j = 0; j < x0.length; j++) {
            draw_fieldlines(x0[j],y0[j],activenegpoints[i].q)
        }
    }

    for (let i = 0; i <activenegpoints.length; i++) {
        noStroke(1);
        fill(color(activenegpoints[i].color));
        ellipse(activenegpoints[i].x,activenegpoints[i].y,R*2);
    }

    for (let i = 0; i <activepospoints.length; i++) {
        noStroke(1);
        fill(color(activepospoints[i].color));
        ellipse(activepospoints[i].x,activepospoints[i].y,R*2);

    }
    noStroke();
    fill(247, 252, 251);
    rect(0, 0, width,rect_height);

    stroke(72, 99, 95);
    line(0,rect_height,width,rect_height);

    if (activepoints.length<maxpoints){
        noStroke();
        fill(color(selpos.color));
        ellipse(selpos.x,selpos.y,R*2);

        noStroke();
        fill(color(selneg.color));
        ellipse(selneg.x,selneg.y,R*2);

    };
    textSize(25);
    textFont("Fira Sans")
    textAlign(CENTER)
    fill(1)
    text("Drag to add", width/2, rect_height/1.5);
    text("positive", width/5, rect_height/1.5);
    text("negative", 4*width/5, rect_height/1.5);
};

