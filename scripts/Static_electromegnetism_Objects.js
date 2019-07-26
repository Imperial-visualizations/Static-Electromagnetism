function Line(points) {
    this.x = [];
    this.y = [];
    this.z = [];
    for (var i = 0; i  < points.length; ++i) {
        this.x.push(points[i][0]);
        this.y.push(points[i][1]);
        this.z.push(points[i][2]);
    }

    this.gObject = function(color, width=7, dash="solid") {
        var lineObject = {
            type: "scatter3d",
            mode: "lines",
            x: this.x,
            y: this.y,
            z: this.z,
            line: {color: color, width: width, dash:dash},
        }
        return lineObject;
    }

    this.arrowHead = function(color, width=7, wingLen=0.1, dash="solid",) {
        var lastElm = this.x.length - 1;
        var [r, theta, phi] = c2sp(this.x[lastElm]-this.x[0], this.y[lastElm]-this.y[0], this.z[lastElm]-this.z[0]);
        var offset = [this.x[0], this.y[0], this.z[0]];
        var frac = wingLen*r;
        var sin45 = Math.sin(Math.PI/4);
        var d = r - frac * sin45;
        var wingLength = Math.sqrt(Math.pow(frac*sin45,2) + d*d);
        var wingAngle = Math.acos(d/wingLength);


        var wings_xyz = [
            math.add(sp2c(wingLength, theta + wingAngle, phi), offset),
            math.add(sp2c(wingLength, theta - wingAngle, phi), offset)
        ];

        var wings = {
            type: "scatter3d",
            mode: "lines",
            x: [wings_xyz[0][0], this.x[lastElm], wings_xyz[1][0]],
            y: [wings_xyz[0][1], this.y[lastElm], wings_xyz[1][1]],
            z: [wings_xyz[0][2], this.z[lastElm], wings_xyz[1][2]],
            line: {color: color, width: width}

        }

        return wings;
    }
}


function Rectangle(x0, y0) {
    this.x0 = x0;
    this.y0 = y0;

    this.gObject = function(color=orange, centre=[0,0]) {
        var rectangle = {
            type: "scatter",
            mode: "lines",
            x: [0, this.x0, this.x0, 0, 0],
            y: [0, 0, this.y0, this.y0, 0],
            line: {simplify: false, color: color},
            fill:'toself',
            opacity: 0.5
        }
        return rectangle;
    }
}
/**
 * Represents a line.
 * @constructor
 * @param {list} points - list of the points in the line.
 */
function Line2d(points) {
    this.x = [];
    this.y = [];

    for (var i = 0; i  < points.length; ++i) {
        this.x.push(points[i][0]);
        this.y.push(points[i][1]);
    }

    this.gObject = function(color, width=7, dash="solid", modetype="lines", textInput="") {
        var lineObject = {
            type: "scatter",
            mode: modetype,
            text: ["",textInput],

            textposition: "top",
            textfont: {size: 15},

            x: this.x,
            y: this.y,
            line: {color: color, width: width, dash:dash}
        }
        return lineObject;
    }

    this.arrowHead = function(color, width=7, dash="solid") {
        var lastElm = this.x.length - 1;
        var [rho, phi] = c2p(this.x[lastElm] - this.x[0], this.y[lastElm] - this.y[0]);
        var offset = [this.x[0], this.y[0]];
        var frac = 0.2;
        var sin45 = Math.sin(Math.PI/4);
        var d = rho - frac * sin45;
        var wingLength = Math.sqrt(Math.pow(frac*sin45,2) + d*d);
        var wingAngle = Math.acos(d/wingLength);

        var wings_xyz = [
            math.add(p2c(wingLength, phi + wingAngle), offset),
            math.add(p2c(wingLength, phi - wingAngle), offset)
        ];

        var wings = {
            type: "scatter",
            mode: "lines",
            x: [wings_xyz[0][0], this.x[lastElm], wings_xyz[1][0]],
            y: [wings_xyz[0][1], this.y[lastElm], wings_xyz[1][1]],
            line: {color: color, width: width}
        }

        return wings;
    }
}