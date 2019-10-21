//global var
let angle_Eg = 0;
let frame_no = 60;
let mu0_1 = 1; //Number(Math.PI * 4E-7);
let arrowNo = 1;
let index = 0;
let nostep = 50;
let sign = 0;

function Play() {
    let button_val = document.getElementById("playB").value;
    if (button_val == 1) {
        document.getElementById("playB").innerHTML = "Stop!";
        document.getElementById("playB").value = 0
    } else {
        document.getElementById("playB").innerHTML = "Play!";
        document.getElementById("playB").value = 1
    }
    //console.log(button_val);
    button_no = button_val;
}

function getDiameter(a = 200) {
    return [sliderVal * a, BsliderVal * a];
}


class currentLoop {
    constructor(I, x, y) {
        this.In = I;
        this.x = x + width / 2;
        this.y = y + height / 2;
        this.a = 15;
    }

    bField(R) {
        let r = ((R[1] - this.y) ** 2 + (R[0] - this.x) ** 2) ** (1 / 2);
        //console.log(r)
        let B_mag = mu0_1 * this.In / (2 * Math.PI * r);
        //console.log(B_mag);
        let angle = Math.atan2((R[1] - this.y), (R[0] - this.x));
        //console.log(Math.cos(angle));
        return [B_mag * Math.sin(angle), B_mag * Math.cos(angle)]
    }

    drawLoop() {
        if (this.In > 0) {

            push();
            noFill();
            stroke(212, 36, 36);
            strokeWeight(2);
            //ellipse(this.x, this.y, this.a+40, this.a+40)
            ellipse(this.x, this.y, this.a, this.a);
            pop();
            push(); // Start a new drawing state
            noStroke();
            fill(212, 36, 36);
            strokeWeight(2);
            let b = Math.round(this.a / 3);
            ellipse(this.x, this.y, b, b);
            pop();

        } else if(this.In < 0) {
            push();
            strokeWeight(2);
            noFill();
            stroke(44, 61, 171);
            //ellipse(this.x, this.y, this.a+40, this.a+40)
            ellipse(this.x, this.y, this.a, this.a);
            let c = this.a * Math.cos(Math.PI / 4) / 2;
            line(this.x + c, this.y + c, this.x - c, this.y - c);
            line(this.x - c, this.y + c, this.x + c, this.y - c);

            strokeWeight(2);
            pop()
        } else {
            push();
            noFill();
            stroke(114, 212, 119);
            strokeWeight(2);
            ellipse(this.x, this.y, this.a, this.a);
            pop();
        }
    }

    getPos() {
        return [this.x, this.y]
    }
}

class arrow {
    constructor(x, y) {
        this.x = x + width / 2;
        this.y = y + height / 2;

    }

    arrowDraw(L, angle, sign) {
        let Lx = Math.round(L[0] * 300);
        let Ly = Math.round(L[1] * 300);
        let Bmag = ((Lx) ** 2 + (Ly) ** 2) ** (1 / 2);
        //console.log(Bmag)

        if (Bmag > 200) {
            Bmag = 200;
        }
        let mag = 0;
        if (sign == 1 && AsliderVal >= 0) {
            mag = -Bmag;
        } else if (sign == 0 && AsliderVal < 0) {
            mag = -Bmag;
        } else {
            mag = Bmag;
        }
        //console.log(Lx);
        push();
        translate(this.x, this.y);
        rotate(-angle);

        fill(212, 212, 100);
        noStroke();

        beginShape();
        vertex(0, 0);

        vertex(mag * 3 / 4, mag / 5);
        vertex(mag * 3 / 4, mag / 3);
        vertex(mag, 0);
        vertex(mag * 3 / 4, -mag / 3);
        vertex(mag * 3 / 4, -mag / 5);
        endShape();

        pop();
        //console.log(L);
    }

    getPos() {
        return [this.x, this.y]
    }
}

let TopSide = 0;
let BottomSide = 0;

function drawSol() {
    //console.log(width);
    let ypos = height / 8;
    let xpos = 0;
    let solTop = [new currentLoop(AsliderVal, xpos, -ypos)];
    let solBot = [new currentLoop(-AsliderVal, xpos, ypos)];

    push();
    strokeWeight(3);
    stroke(178, 181, 177);
    line(0, solBot[0].getPos()[1], width, solBot[0].getPos()[1]);
    line(0, solTop[0].getPos()[1], width, solTop[0].getPos()[1]);
    pop();

    TopSide = solTop[0].getPos()[1];
    BottomSide = solBot[0].getPos()[1]

    solBot.splice(0, 1);
    solTop.splice(0, 1);


    for (i = 0; i < Math.round(NsliderVal / 2); i++) {
        let currTop1 = new currentLoop(AsliderVal, xpos + i * Math.round(width / NsliderVal), -ypos);
        let currBot1 = new currentLoop(-AsliderVal, xpos + i * Math.round(width / NsliderVal), ypos);
        currTop1.drawLoop();
        currBot1.drawLoop();
        solTop.push(currTop1);
        solBot.push(currBot1);
        //console.log(Math.round(NsliderVal / 2))

        if (i > 0) {
            let currTop2 = new currentLoop(AsliderVal, xpos - i * Math.round(width / NsliderVal), -ypos);
            let currBot2 = new currentLoop(-AsliderVal, xpos - i * Math.round(width / NsliderVal), ypos);
            currTop2.drawLoop();
            currBot2.drawLoop();
            solTop.push(currTop2);
            solBot.push(currBot2);
        }
    }
    return [solTop, solBot]
}

function recWire(c, n = 10, a = width / 5, b = height / 3) {
    let xval = [];
    let yval = [];
    push();
    strokeWeight(3);
    //line(0,0,width,height);
    pop();
    //left to right at y=-b
    for (i = 0; i < n; i++) {
        xval.push(-a + i * (2 * a) / n);
        yval.push(-b + c);
    }
    //top to bottom at x=a
    for (i = 0; i < n; i++) {
        xval.push(a);
        yval.push(-b + i * (1.2 * b) / n + c);
    }
    //right to left at y=-height / 4 -100
    for (i = 0; i < n; i++) {
        xval.push(a - i * (2 * a) / n);
        yval.push(-b + (1.2 * b) + c);
    }
    //bottom to top at x=-a
    for (i = 0; i < n; i++) {
        xval.push(-a);
        yval.push(-b + (1.2 * b) + c - i * (1.2 * b) / n);
    }

    push();
    strokeWeight(3);
    stroke(19, 21, 22);
    noFill()
    rect(-a + width / 2, -b + height / 2 + c, 2 * a, (1.2 * b));
    push();
    textSize(30);
    fill(19, 21, 22);
    text("1", -a + width / 2 + width/5.5, -b + height / 2 - height/20 + c);
    text("2", -a + width / 2 + width/2.25, -b + height / 2 + height/4.5 + c);
    text("3", -a + width / 2 + width/5.5, -b + height / 2 + height/2 + c);
    text("4", -a + width / 2 - width/15, -b + height / 2 + height/4.5+ c);
    pop();
    pop();


    return [xval, yval]
}
/*
function hideFunction() {
    if (O11 == 1) {
        document.getElementById("hR").innerHTML = "Radius:";
        document.getElementById("B_slide").type = "hidden";
        document.getElementById("hB").style.display = "none";
        document.getElementById("pB").style.display = "none";

        document.getElementById("N_slide").type = "hidden";
        document.getElementById("hN").style.display = "none";
        document.getElementById("pN").style.display = "none";
    } else if (O11 == 2) {
        document.getElementById("hR").innerHTML = "Move:";
        document.getElementById("B_slide").type = "hidden";
        document.getElementById("hB").style.display = "none";
        document.getElementById("pB").style.display = "none";

        document.getElementById("N_slide").type = "range";
        document.getElementById("hN").style.display = "block";
        document.getElementById("pN").style.display = "block";
    } else if (O11 == 3) {
        document.getElementById("hR").innerHTML = "Radius:";
        document.getElementById("B_slide").type = "range";
        document.getElementById("hB").style.display = "block";
        document.getElementById("pB").style.display = "block";

        document.getElementById("N_slide").type = "range";
        document.getElementById("hN").style.display = "block";
        document.getElementById("pN").style.display = "block";
    }
    //console.log(O11)

}*/

function draw() {
    let C = createCanvas(windowHeight * 0.6, windowHeight * 0.6);
    C.parent('sketch-holder');
    frameRate(frame_no);

    //O11 = document.getElementById("circuitSelectList").value;
    //console.log(O11);

    //hideFunction()
    clear();
    background("white");
    if (O11 == 3) {
        let outerSide = 300;
        let aLoopD = getDiameter()[0];
        let bLoopD = getDiameter()[1];
        //console.log(aLoopD,bLoopD);

        push();
        strokeWeight(2);
        stroke(178, 181, 177);
        noFill();
        ellipse(width / 2, height / 2, outerSide, outerSide);
        ellipse(width / 2, height / 2, bLoopD, bLoopD);
        push();
        stroke(19, 21, 22);
        ellipse(width / 2, height / 2, aLoopD, aLoopD);
        pop()
        pop();

        let InLoop = [];
        let OutLoop = [];

        for (i = -NsliderVal; i < NsliderVal; i++) {
            let rotangle = (i * 2 * Math.PI) / NsliderVal;
            let inLoop = new currentLoop(AsliderVal, bLoopD * Math.sin(rotangle) / 2, bLoopD * Math.cos(rotangle) / 2);
            InLoop.push(inLoop);
            inLoop.drawLoop();
            let outLoop = new currentLoop(-AsliderVal, outerSide * Math.sin(rotangle) / 2, outerSide * Math.cos(rotangle) / 2);
            OutLoop.push(outLoop);
            outLoop.drawLoop();
        }


        let Brrow = [];
        for (i = 0; i < arrowNo; i++) {
            let Arrow = new arrow(aLoopD / 2 * Math.sin(angle_Eg + i * 2 * Math.PI / arrowNo), aLoopD / 2 * Math.cos(angle_Eg + i * 2 * Math.PI / arrowNo));
            Brrow.push(Arrow);

        }

        let BFinal = [];
        for (i = 0; i < Brrow.length; i++) {
            let B = [0, 0];
            let R = Brrow[i].getPos();
            //console.log(R);
            for (n = 0; n < InLoop.length; n++) {
                let A = 0;
                let C = 0;
                if (AsliderVal >= 0) {
                    A = InLoop[n].bField(R);
                    C = OutLoop[n].bField(R);
                } else {
                    C = InLoop[n].bField(R);
                    A = OutLoop[n].bField(R);
                }
                for (m = 0; m < B.length; m++) {
                    B[m] = B[m] + A[m] + C[m]

                    //console.log(m)

                }
            }
            //console.log(B[1]);
            //console.log(B);
            BFinal.push(B)

        }


        if (button_no == 1) {
            if (aLoopD >= outerSide) {
                angle_Eg = angle_Eg - 2 * AsliderVal * Math.PI / (2000 * sliderVal);
                sign = 1
            } else if (bLoopD >= aLoopD) {
                angle_Eg = angle_Eg - 2 * (AsliderVal) * Math.PI / (2000 * sliderVal);
                sign = 1
            } else if (aLoopD < outerSide && aLoopD > bLoopD) {
                angle_Eg = angle_Eg + 2 * (AsliderVal) * Math.PI / (2000 * sliderVal);
                sign = 0
            }
        }

        for (i = 0; i < Brrow.length; i++) {
            Brrow[i].arrowDraw(BFinal[i], angle_Eg + i * 2 * Math.PI / arrowNo, sign);
        }

    } else if (O11 == 2) {
        //console.log("30994091202");
        let solCurr = drawSol();
        let InLoop = solCurr[0];
        let OutLoop = solCurr[1];
        let path = recWire(sliderVal * 100, nostep);
        //console.log(path);
        let Brrow = [];
        for (i = 0; i < arrowNo; i++) {
            let Arrow = new arrow(path[0][index], path[1][index]);
            Brrow.push(Arrow);
        }
        if (button_no == 1) {
            index = index + 1;
            if (index > 4 * nostep) {
                index = 0;
            }
            //console.log(index);
        }

        let BFinal = [];
        for (i = 0; i < Brrow.length; i++) {
            let B = [0, 0];
            let R = Brrow[i].getPos();
            //console.log(R);
            for (n = 0; n < InLoop.length; n++) {
                let A = 0;
                let C = 0;
                if (AsliderVal >= 0) {
                    A = InLoop[n].bField(R);
                    C = OutLoop[n].bField(R);
                } else {
                    C = InLoop[n].bField(R);
                    A = OutLoop[n].bField(R);
                }
                for (m = 0; m < B.length; m++) {
                    B[m] = B[m] + A[m] + C[m]
                }
            }

            BFinal.push(B);

        }

        if (Brrow[0].getPos()[1] < BottomSide && Brrow[0].getPos()[1] > TopSide) {
            sign = 0
        } else {
            sign = 1
        }

        for (i = 0; i < Brrow.length; i++) {
            Brrow[i].arrowDraw(BFinal[i], 0, sign);
        }

    } else if (O11 == 1) {
        let aLoopD = getDiameter()[0];

        push();
        strokeWeight(2);
        stroke(19, 21, 22);
        noFill();
        ellipse(width / 2, height / 2, aLoopD, aLoopD);
        pop();

        let inLoop = new currentLoop(AsliderVal, 0, 0);
        inLoop.drawLoop();


        let Brrow = [];
        for (i = 0; i < arrowNo; i++) {
            let Arrow = new arrow(aLoopD / 2 * Math.sin(angle_Eg + i * 2 * Math.PI / arrowNo), aLoopD / 2 * Math.cos(angle_Eg + i * 2 * Math.PI / arrowNo));
            Brrow.push(Arrow);
        }

        let BFinal = [];
        for (i = 0; i < Brrow.length; i++) {
            let B = [0, 0];
            let R = Brrow[i].getPos();
            let A = inLoop.bField(R);

            for (m = 0; m < B.length; m++) {
                B[m] = (B[m] + A[m]) * 20
            }

            BFinal.push(B)
        }


        if (button_no == 1) {
            angle_Eg = angle_Eg + 2 * (AsliderVal) * Math.PI / (2000 * sliderVal);
            sign = 0
        }

        for (i = 0; i < Brrow.length; i++) {
            Brrow[i].arrowDraw(BFinal[i], angle_Eg + i * 2 * Math.PI / arrowNo, sign);
        }

    }
}
