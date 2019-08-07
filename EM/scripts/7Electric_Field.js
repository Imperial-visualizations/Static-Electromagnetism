//Below prepares the x,y coordinate data to be calculated, depending on the plot step.
class Arrow{
    //class currently only works for 2d arrows drawn at z = 0 on a 3d plot.
    //need to edit GetDrawData if you want 3d arrows.
    constructor(x1, y1, x2, y2, HeadSize){
        //x1 and y1 are coords of tail of arrow
        //x2 and y2 are coords of head of arrow
        //HeadSize sets the size of the arrowhead.
        this.TailPos = [x1, y1];
        this.HeadPos = [x2, y2];

        this.HeadSize = HeadSize;
        this.HeadAngle = Math.PI/4;

        this.r = this.GetLength(this.HeadPos, this.TailPos);
        this.theta = this.GetTheta(this.HeadPos, this.TailPos);

    }

    GetHeadPos(){
        return this.HeadPos;
    }

    GetTailPos(){
        return this.TailPos;
    }

    GetLength(){
        return Math.sqrt((this.HeadPos[0] - this.TailPos[0])**2 + (this.HeadPos[1] - this.TailPos[1])**2);
    }

    GetTheta(){
        return Math.atan2((this.HeadPos[1] - this.TailPos[1]), (this.HeadPos[0] - this.TailPos[0]));
    }

    GetDrawData3D(){
        //need arrays of x values and arrays of y values
        //first line is main body of arrow

        //let FirstLine = [[this.TailPos[0], this.HeadPos[0]],  [this.TailPos[1], this.HeadPos[1]]];

        let Ax = this.HeadPos[0] - this.HeadSize*Math.sin((Math.PI/2) - this.theta + this.HeadAngle);
        let Ay = this.HeadPos[1] - this.HeadSize*Math.cos((Math.PI/2) - this.theta + this.HeadAngle);
        //let PointA = [Ax, Ay];

        let Bx = this.HeadPos[0] - this.HeadSize*Math.sin((Math.PI/2) - this.theta - this.HeadAngle);
        let By = this.HeadPos[1] - this.HeadSize*Math.cos((Math.PI/2) - this.theta - this.HeadAngle);
        //let PointB = [Bx, By];

        //let SecondLine = [[this.HeadPos[0], Ax], [this.HeadPos[1], Ay]];
        //let ThirdLine = [[this.HeadPos[0], Bx], [this.HeadPos[1], By]];
        let FirstLine = {};
        let SecondLine = {};
        let ThirdLine = {};

        if (this.r <= 0.000001){
            FirstLine = {
                type: "scatter3d",
                mode: "lines",
                x: [this.TailPos[0], this.HeadPos[0]],
                y: [this.TailPos[1], this.HeadPos[1]],
                z: [0,0],
                line: {color: "blue", width: 3},
                hoverinfo: "skip"
            };

            SecondLine = {
                type: "scatter3d",
                mode: "lines",
                x: [this.HeadPos[0], Ax],
                y: [this.HeadPos[1], Ay],
                z: [0,0],
                line: {color: "blue", width: 3},
                hoverinfo: "skip"
            };

            ThirdLine = {
                type: "scatter3d",
                mode: "lines",
                x: [this.HeadPos[0], Bx],
                y: [this.HeadPos[1], By],
                z: [0,0],
                line: {color: "blue", width: 3},
                hoverinfo: "skip"
            };
        }else{

            FirstLine = {
                type: "scatter3d",
                mode: "lines",
                x: [this.TailPos[0], this.HeadPos[0]],
                y: [this.TailPos[1], this.HeadPos[1]],
                z: [0,0],
                line: {color: "blue", width: 3},
                hoverinfo: "skip"
            };

            SecondLine = {
                type: "scatter3d",
                mode: "lines",
                x: [this.HeadPos[0], Ax],
                y: [this.HeadPos[1], Ay],
                z: [0,0],
                line: {color: "blue", width: 3},
                hoverinfo: "skip"
            };

            ThirdLine = {
                type: "scatter3d",
                mode: "lines",
                x: [this.HeadPos[0], Bx],
                y: [this.HeadPos[1], By],
                z: [0,0],
                line: {color: "blue", width: 3},
                hoverinfo: "skip"
            };
        }

        return [FirstLine, SecondLine, ThirdLine];
    }

    GetDrawData2D(){

        //need arrays of x values and arrays of y values
        //first line is main body of arrow

        //let FirstLine = [[this.TailPos[0], this.HeadPos[0]],  [this.TailPos[1], this.HeadPos[1]]];

        let Ax = this.HeadPos[0] - this.HeadSize*Math.sin((Math.PI/2) - this.theta + this.HeadAngle);
        let Ay = this.HeadPos[1] - this.HeadSize*Math.cos((Math.PI/2) - this.theta + this.HeadAngle);
        //let PointA = [Ax, Ay];

        let Bx = this.HeadPos[0] - this.HeadSize*Math.sin((Math.PI/2) - this.theta - this.HeadAngle);
        let By = this.HeadPos[1] - this.HeadSize*Math.cos((Math.PI/2) - this.theta - this.HeadAngle);
        //let PointB = [Bx, By];

        //let SecondLine = [[this.HeadPos[0], Ax], [this.HeadPos[1], Ay]];
        //let ThirdLine = [[this.HeadPos[0], Bx], [this.HeadPos[1], By]];
        let FirstLine = {};
        let SecondLine = {};
        let ThirdLine = {};

        if (this.r == 0){
            FirstLine = {
                type: "scatter",
                mode: "lines",
                x: [this.TailPos[0], this.HeadPos[0]],
                y: [this.TailPos[1], this.HeadPos[1]],
                line: {color: "blue", width: 0},
                hoverinfo: "skip"
            };

            SecondLine = {
                type: "scatter",
                mode: "lines",
                x: [this.HeadPos[0], Ax],
                y: [this.HeadPos[1], Ay],
                line: {color: "blue", width: 0},
                hoverinfo: "skip"
            };

            ThirdLine = {
                type: "scatter",
                mode: "lines",
                x: [this.HeadPos[0], Bx],
                y: [this.HeadPos[1], By],
                line: {color: "blue", width: 0},
                hoverinfo: "skip"
            };
        }else{

            FirstLine = {
                type: "scatter",
                mode: "lines",
                x: [this.TailPos[0], this.HeadPos[0]],
                y: [this.TailPos[1], this.HeadPos[1]],
                line: {color: "blue", width: 2},
                hoverinfo: "skip"
            };

            SecondLine = {
                type: "scatter",
                mode: "lines",
                x: [this.HeadPos[0], Ax],
                y: [this.HeadPos[1], Ay],
                line: {color: "blue", width: 1},
                hoverinfo: "skip"
            };

            ThirdLine = {
                type: "scatter",
                mode: "lines",
                x: [this.HeadPos[0], Bx],
                y: [this.HeadPos[1], By],
                line: {color: "blue", width: 1},
                hoverinfo: "skip"
            };
        }

        return [FirstLine, SecondLine, ThirdLine];
    }

};

function getVectorData(q, x_max, PlotStep){
    let ArrowData = [];
    //let z = [];
    let VectorData = [];

    let CurrentArrow, LineStuff;

    let x = [];
    let y = [];

    let x2 = 0;
    let y2 = 0;
    let b = 0;
    let c = 0;
    let equation = selectEquation();

    switch (equation){
        case "PointCharge": //reciprocal
            for (let i = -x_max; i <= x_max; i += PlotStep){
                for (let j = -x_max; j <= x_max; j += PlotStep){
                    x[0] = i;
                    y[0] = j;

                    let scaleFactor = Math.pow(10,22);

                    x2 = q/( 4*Math.PI*8.85*Math.pow(10,-12)*(x[0]**2 + y[0]**2)**1.5*x[0] )
                    y2 = q/( 4*Math.PI*8.85*Math.pow(10,-12)*(x[0]**2 + y[0]**2)**1.5*y[0] )


                    x2 = (x2**2*scaleFactor)**0.1*x2;
                    y2 = (y2**2*scaleFactor)**0.1*y2;

                    x[1] = x[0] + x2;
                    y[1] = y[0] + y2;

                    ArrowData = [x, y];

                    CurrentArrow = new Arrow(ArrowData[0][0], ArrowData[1][0], ArrowData[0][1], ArrowData[1][1], 2);
                    LineStuff = CurrentArrow.GetDrawData2D();

                    VectorData.push(LineStuff[0]);
                    VectorData.push(LineStuff[1]);
                    VectorData.push(LineStuff[2]);
                }
            }
            break;


        case "Dipole":  //gaussian type

            for (let i = -x_max; i <= x_max; i += PlotStep){
                for (let j = -x_max; j <= x_max; j += PlotStep){
                    x[0] = i;
                    y[0] = j;

                    let scaleFactor = Math.pow(10,40);

                    x2 = 1/(4*Math.PI*8.85*Math.pow(10,-12))*( (q/((x[0]+10)**2+y[0]**2)**1.5)*(x[0]+10) + (-q/((x[0]-10)**2+y[0]**2)**1.5)*(x[0]-10) );
                    y2 = 1/(4*Math.PI*8.85*Math.pow(10,-12))*( (q/((x[0]+10)**2+y[0]**2)**1.5)*(y[0]) + (-q/((x[0]-10)**2+y[0]**2)**1.5)*(y[0]) );

//                    x2 = 5;
//                    y2 = 5;
//
//                    x2 = -q/( 4*Math.PI*8.85*Math.pow(10,-12)*(x[0]**2 + y[0]**2)**1.5*x[0] )
//                    y2 = -q/( 4*Math.PI*8.85*Math.pow(10,-12)*(x[0]**2 + y[0]**2)**1.5*y[0] )

                    x2 = (x2**2*scaleFactor)**0.01*x2;
                    y2 = (y2**2*scaleFactor)**0.01*y2;

                    x[1] = x[0] + x2;
                    y[1] = y[0] + y2;

                    ArrowData = [x, y];

                    CurrentArrow = new Arrow(ArrowData[0][0], ArrowData[1][0], ArrowData[0][1], ArrowData[1][1], 2);
                    LineStuff = CurrentArrow.GetDrawData2D();

                    VectorData.push(LineStuff[0]);
                    VectorData.push(LineStuff[1]);
                    VectorData.push(LineStuff[2]);

                }
            }

            break;

        case "FarField": //cos type
            for (let i = -x_max; i <= x_max; i += PlotStep){
                for (let j = -x_max; j <= x_max; j += PlotStep){
                    //ArrowData = GetArrowPoints(i, j, Equation, A);
                    x[0] = i;
                    y[0] = j;

                    let scaleFactor = Math.pow(10,1.5);

                    x2 = 1/(4*Math.PI*8.85*Math.pow(10,-12))*( (q/((x[0]+0.1)**2+y[0]**2)**1.5)*(x[0]+0.1) + (-q/((x[0]-0.1)**2+y[0]**2)**1.5)*(x[0]-0.1) );
                    y2 = 1/(4*Math.PI*8.85*Math.pow(10,-12))*( (q/((x[0]+0.1)**2+y[0]**2)**1.5)*(y[0]) + (-q/((x[0]-0.1)**2+y[0]**2)**1.5)*(y[0]) );

//                    x2 = 5;
//                    y2 = 5;
//
//                    x2 = -q/( 4*Math.PI*8.85*Math.pow(10,-12)*(x[0]**2 + y[0]**2)**1.5*x[0] )
//                    y2 = -q/( 4*Math.PI*8.85*Math.pow(10,-12)*(x[0]**2 + y[0]**2)**1.5*y[0] )

                    x2 = (Math.abs(x2)*scaleFactor)**0.5*x2/Math.abs(x2);
                    y2 = (Math.abs(y2)*scaleFactor)**0.5*y2/Math.abs(y2);

                    x[1] = x[0] + x2;
                    y[1] = y[0] + y2;

                    ArrowData = [x, y];

                    CurrentArrow = new Arrow(ArrowData[0][0], ArrowData[1][0], ArrowData[0][1], ArrowData[1][1], 1.5);
                    LineStuff = CurrentArrow.GetDrawData2D();

                    VectorData.push(LineStuff[0]);
                    VectorData.push(LineStuff[1]);
                    VectorData.push(LineStuff[2]);

                }
            }
            break;
    }
    return VectorData;
};

function setupSurfaceData(xMin, xMax, yMin, yMax, plotStep){
    let xSurface = [];
    let ySurface = [];

    for (let i = xMin; i <= xMax; i += plotStep){
        xSurface.push(i);
    };

    for (let j = yMin; j <= yMax; j += plotStep){
        ySurface.push(j);
    };

    return [xSurface , ySurface]
};

//Line 1 is the horizontal line where y = 0.
//Line 2 is a sinusodial path.
function setupLineAData(xLineMin, xLineMax, yLineMin, yLineMax, plotLineStep) {
    let xLine = [];
    let yLine = [];

    for (let i = xLineMin; i <= xLineMax; i += plotLineStep){
        xLine.push(i);
    };

    for (let j = xLineMin; j <= xLineMax; j += plotLineStep){
        yLine.push(yLineMin);
    };

    return [xLine , yLine]
};

//path2 draws sinusodial line.
function path2(x){
    return 10 * Math.sin( (2*Math.PI/42) * (x+16) )
};

function setupLineBData(xLineMin, xLineMax, yLineMin, yLineMax, plotLineStep){
    let xLine = [];
    let yLine = [];

    for (let i = xLineMin; i <= xLineMax; i += plotLineStep){
        xLine.push(i);
        yLine.push( path2(i) + yLineMin );
    };
    return [xLine , yLine]
};

//Below we calculate the function values f(x,y).

//for surface plot.
function dipoleSurface (q, xSurface,ySurface){
    let zSurface = [];
    for (let xValue in xSurface){
        let zArray = [];
        for (let yValue in ySurface){
            zArray.push( q/(4*Math.PI*8.85*Math.pow(10,-12)*Math.sqrt( xSurface[xValue]**2 + (ySurface[yValue]+10)**2))
                        - q/(4*Math.PI*8.85*Math.pow(10,-12)*Math.sqrt( xSurface[xValue]**2 + (ySurface[yValue]-10)**2))
            );
        };
        zSurface.push(zArray);
    };
    return zSurface;
};

//for line plot.
function dipoleLine (q, xLine, yLine){
    let zLine = [];
    for (let xValue in xLine){
            zLine.push(q/(4*Math.PI*8.85*Math.pow(10,-12)*Math.sqrt( (xLine[xValue]+10)**2 + yLine[xValue]**2))
                        - q/(4*Math.PI*8.85*Math.pow(10,-12)*Math.sqrt( (xLine[xValue]-10)**2 + yLine[xValue]**2))
            );
        };
    return zLine;
};

//for point plot.
function dipolePoint (q, xPoint, yPoint){
    return q/(4*Math.PI*8.85*Math.pow(10,-12)*Math.sqrt( (xPoint+10)**2 + yPoint**2))
           - q/(4*Math.PI*8.85*Math.pow(10,-12)*Math.sqrt( (xPoint-10)**2 + yPoint**2));
};

function pointChargeSurface(q, xSurface, ySurface){
    let zSurface = [];
    for (let xValue in xSurface){
            let zArray = [];
            for (let yValue in ySurface){
                zArray.push(q/(4*Math.PI*8.85*Math.pow(10,-12)*Math.sqrt( xSurface[xValue]**2 + ySurface[yValue]**2)) );
//                zArray.push(q);
            };
            zSurface.push(zArray);
        };
    return zSurface;
};

function pointChargeLine (q, xLine, yLine){
    let zLine = [];
    for (let xValue in xLine){
            zLine.push(q/(4*Math.PI*8.85*Math.pow(10,-12)*Math.sqrt( xLine[xValue]**2 + yLine[xValue]**2)) );
        };
    return zLine;
};

function pointChargePoint (q, xPoint, yPoint){
    return q/(4*Math.PI*8.85*Math.pow(10,-12)*Math.sqrt( xPoint**2 + yPoint**2))
};

function farFieldSurface (q, xSurface,ySurface){
    let zSurface = [];
    for (let xValue in xSurface){
        let zArray = [];
        for (let yValue in ySurface){
            zArray.push( q/(4*Math.PI*8.85*Math.pow(10,-12)*Math.sqrt( xSurface[xValue]**2 + (ySurface[yValue]+0.1)**2))
                        - q/(4*Math.PI*8.85*Math.pow(10,-12)*Math.sqrt( xSurface[xValue]**2 + (ySurface[yValue]-0.1)**2))
            );
        };
        zSurface.push(zArray);
    };
    return zSurface;
};

//for line plot.
function farFieldLine (q, xLine, yLine){
    let zLine = [];
    for (let xValue in xLine){
            zLine.push(q/(4*Math.PI*8.85*Math.pow(10,-12)*Math.sqrt( (xLine[xValue]+0.1)**2 + yLine[xValue]**2))
                        - q/(4*Math.PI*8.85*Math.pow(10,-12)*Math.sqrt( (xLine[xValue]-0.1)**2 + yLine[xValue]**2))
            );
        };
    return zLine;
};

//for point plot.
function farFieldPoint (q, xPoint, yPoint){
    return q/(4*Math.PI*8.85*Math.pow(10,-12)*Math.sqrt( (xPoint +0.1)**2 + yPoint**2))
           - q/(4*Math.PI*8.85*Math.pow(10,-12)*Math.sqrt( (xPoint -0.1)**2 + yPoint**2));
};

function selectEquation(){
    return document.getElementById("Function_Selector").value
};

//Below we prepare the data in the structure that plotly takes.
function dataSurfaceCompile(xSurface,ySurface,zSurface){
     let dataSurface = {
                         x: xSurface,
                         y: ySurface,
                         z: zSurface,
                         type: 'surface',
                         name: 'Scalar Field',
                         showscale: false
                     };
    return dataSurface;
};

function dataLineACompile(xLine, yLine, zLine){
    let dataLine = {
                         x:xLine,
                         y:yLine,
                         z:zLine,
                         type: 'scatter3d',
                         mode: 'lines',
                         line: {
                                color: 'rgb(255,255,0)',
                                width: 10
                              },
                         name: 'Path 1',
                         showscale: false
                     };
    return dataLine
};

function dataLineBCompile(xLine, yLine, zLine){
    let dataLine = {
                         x:xLine,
                         y:yLine,
                         z:zLine,
                         type: 'scatter3d',
                         mode: 'lines',
                         line: {
                                color: 'rgb(173,255,47)',
                                width: 10
                              },
                         name: 'Path 2',
                         showscale: false
                     };
    return dataLine
};

function dataLineAVectorCompile(lineArray){
    let xLine = lineArray[0];
    let yLine = lineArray[1];
    let dataLine = {
                         x:xLine,
                         y:yLine,
                         type: 'scatter',
                         mode: 'lines',
                         line: {
                                color: 'rgb(255,255,0)',
                                width: 5
                              },
                         name: 'Path 1',
                         showscale: false
                     };
    return dataLine;
};

function dataLineBVectorCompile(lineArray){
    let xLine = lineArray[0];
    let yLine = lineArray[1];
    let dataLine = {
                         x:xLine,
                         y:yLine,
                         type: 'scatter',
                         mode: 'lines',
                         line: {
                                color: 'rgb(173,255,47)',
                                width: 5
                              },
                         name: 'Path 1',
                         showscale: false
                     };
    return dataLine;
};

function dataPointACompile(xPoint, yPoint, zPoint){
    let dataPoint = {
                         x:[xPoint],
                         y:[yPoint],
                         z:[zPoint],
                         type: 'scatter3d',
                         mode: 'markers',
                         marker: {
                                color: 'rgb(238,130,238)',
                                size: 10
                              },
                         name: "Point A",
                         showscale: false
    };
    return dataPoint
};

function dataPointBCompile(xPoint, yPoint, zPoint){
    let dataPoint = {
                         x:[xPoint],
                         y:[yPoint],
                         z:[zPoint],
                         type: 'scatter3d',
                         mode: 'markers',
                         marker: {
                                color: 'rgb(255,140,0)',
                                size: 10
                              },
                         name: "Point B",
                         showscale: false
    };
    return dataPoint
};

function dataBallCompile(xBall, yBall, zBall){
    let dataBall = {
                         x:[xBall],
                         y:[yBall],
                         z:[zBall],
                         type: 'scatter3d',
                         mode: 'markers',
                         marker: {
                                color: 'rgb(255,0,0)',
                                size: 10
                              },
                         name: "Ball",
                         showscale: false
                         };
    return dataBall
};

function dataBallVectorCompile(xBall, yBall){
    let dataBall = {
                         x:[xBall],
                         y:[yBall],
                         type: 'scatter',
                         mode: 'markers',
                         marker: {
                                color: 'rgb(255,0,0)',
                                size: 15
                              },
                         name: "Ball",
                         showscale: false
                         };
    return dataBall
};

function dataPointAVectorCompile(xPoint, yPoint){
    let dataPoint = {
                         x:[xPoint],
                         y:[yPoint],
                         type: 'scatter',
                         mode: 'markers',
                         marker: {
                                color: 'rgb(238,130,238)',
                                size: 15
                              },
                         name: "Point A",
                         showscale: false
    };
    return dataPoint
};

function dataPointBVectorCompile(xPoint, yPoint){
    let dataPoint = {
                         x:[xPoint],
                         y:[yPoint],
                         type: 'scatter',
                         mode: 'markers',
                         marker: {
                                color: 'rgb(255,140,0)',
                                size: 15
                              },
                         name: "Point B",
                         showscale: false
    };
    return dataPoint
};

function plot(xMin, xMax, yMin, yMax, plotStep, xSurface, ySurface, xLineA, yLineA,
                    xLineB, yLineB, xLineMin, yLineMin, xLineMax, yLineMax, dataLineAVector, dataLineBVector, dataPointAVector, dataPointBVector,
                    layoutScalar, layoutVector){

    document.getElementById("PointCharge_E_eqn_7b").style.display = "none";
    document.getElementById("Dipole_E_eqn_7b").style.display = "none";
    document.getElementById("FarField_E_eqn_7b").style.display = "none";
    document.getElementById("PointCharge_V_eqn_7b").style.display = "none";
    document.getElementById("Dipole_V_eqn_7b").style.display = "none";
    document.getElementById("FarField_V_eqn_7b").style.display = "none";

    let q = parseFloat(document.getElementById('Slider_1_7b').value)*Math.pow(10,-9);
    let xPoint = parseFloat(document.getElementById('Slider_2_7b').value);

    let equation = selectEquation();

    let xBallA = xPoint;
    let yBallA = yLineMin;

    let xBallB = xPoint;
    let yBallB = path2(xPoint) + yLineMin;

    let xPointA = xLineMin;
    let yPointA = yLineMin;

    let xPointB = xLineMax;
    let yPointB = yLineMax;

    if (equation === "Dipole"){

        document.getElementById("Dipole_E_eqn_7b").style.display = "block";
        document.getElementById("Dipole_V_eqn_7b").style.display = "block";

        let zSurface = dipoleSurface(q, xSurface, ySurface);
        let dataSurface = dataSurfaceCompile(xSurface, ySurface, zSurface);

        let zLineA = dipoleLine(q, xLineA, yLineA);
        let dataLineA = dataLineACompile(xLineA, yLineA, zLineA);

        let zLineB = dipoleLine(q, xLineB, yLineB);
        let dataLineB = dataLineBCompile(xLineB, yLineB, zLineB);

        let zPointA = dipolePoint(q, xPointA, yPointA);
        let zPointB = dipolePoint(q, xPointB, yPointB);

        let dataPointA = dataPointACompile(xPointA, yPointA, zPointA);
        let dataPointB = dataPointBCompile(xPointB, yPointB, zPointB);

        let zBallA = dipolePoint(q, xBallA, yBallA);

        let zBallB = dipolePoint(q, xBallB, yBallB);

        let dataBallA = dataBallCompile(xBallA, yBallA, zBallA);

        let dataBallB = dataBallCompile(xBallB, yBallB, zBallB);

        dataBallAVector = dataBallVectorCompile(xBallA,yBallA);
        dataBallBVector = dataBallVectorCompile(xBallB,yBallB);

        let vectorData = getVectorData(q, 15, 10);

        console.log(vectorData);
        vectorData.push(dataLineAVector);
        vectorData.push(dataLineBVector);
        vectorData.push(dataPointAVector);
        vectorData.push(dataPointBVector);
        vectorData.push(dataBallAVector);
        vectorData.push(dataBallBVector);

        $("#functionValueBall1_7b").text(`Electric Potential of Ball 1 = ${Math.round(100*zBallA)/100} V`);
        $("#functionValueBall2_7b").text(`Electric Potential of Ball 2 = ${Math.round(100*zBallB)/100} V`);

        Plotly.react("Vector_Graph_7b", vectorData, layoutVector);
        Plotly.react('Scalar_Graph_7b', [dataSurface, dataLineA, dataLineB, dataPointA, dataPointB, dataBallA, dataBallB], layoutScalar);
    }
        else if (equation === "FarField") {

        document.getElementById("FarField_E_eqn_7b").style.display = "block";
        document.getElementById("FarField_V_eqn_7b").style.display = "block";

        let zSurface = farFieldSurface(q, xSurface, ySurface);
        let dataSurface = dataSurfaceCompile(xSurface, ySurface, zSurface);

        let zLineA = farFieldLine(q, xLineA, yLineA);
        let dataLineA = dataLineACompile(xLineA, yLineA, zLineA);

        let zLineB = farFieldLine(q, xLineB, yLineB);
        let dataLineB = dataLineBCompile(xLineB, yLineB, zLineB);

        let zPointA = farFieldPoint(q, xPointA, yPointA);
        let zPointB = farFieldPoint(q, xPointB, yPointB);

        let dataPointA = dataPointACompile(xPointA, yPointA, zPointA);
        let dataPointB = dataPointBCompile(xPointB, yPointB, zPointB);

        let zBallA = farFieldPoint(q, xBallA, yBallA);

        let zBallB = farFieldPoint(q, xBallB, yBallB);

        let dataBallA = dataBallCompile(xBallA, yBallA, zBallA);

        let dataBallB = dataBallCompile(xBallB, yBallB, zBallB);

        dataBallAVector = dataBallVectorCompile(xBallA,yBallA);
        dataBallBVector = dataBallVectorCompile(xBallB,yBallB);

        let vectorData = getVectorData(q, 17.5, 5);

        vectorData.push(dataLineAVector);
        vectorData.push(dataLineBVector);
        vectorData.push(dataPointAVector);
        vectorData.push(dataPointBVector);
        vectorData.push(dataBallAVector);
        vectorData.push(dataBallBVector);

        $("#functionValueBall1_7b").text(`Electric Potential of Ball 1 = ${Math.round(1000*zBallA)/1000} V`);
        $("#functionValueBall2_7b").text(`Electric Potential of Ball 2 = ${Math.round(1000*zBallB)/1000} V`);

        Plotly.react("Vector_Graph_7b", vectorData, layoutVector );
        Plotly.react('Scalar_Graph_7b', [dataSurface, dataLineA, dataLineB, dataPointA, dataPointB, dataBallA, dataBallB], layoutScalar);

    }
    else if (equation === "PointCharge"){
        document.getElementById("PointCharge_E_eqn_7b").style.display = "block";
        document.getElementById("PointCharge_V_eqn_7b").style.display = "block";

        let zSurface = pointChargeSurface(q, xSurface, ySurface);
        let dataSurface = dataSurfaceCompile(xSurface, ySurface, zSurface);

        let zLineA = pointChargeLine(q, xLineA, yLineA);
        let dataLineA = dataLineACompile(xLineA, yLineA, zLineA);

        let zLineB = pointChargeLine(q, xLineB, yLineB);
        let dataLineB = dataLineBCompile(xLineB, yLineB, zLineB);

        let zPointA = pointChargePoint(q, xPointA, yPointA);
        let zPointB = pointChargePoint(q, xPointB, yPointB);

        let dataPointA = dataPointACompile(xPointA, yPointA, zPointA);
        let dataPointB = dataPointBCompile(xPointB, yPointB, zPointB);

        let zBallA = pointChargePoint(q, xBallA, yBallA);

        let zBallB = pointChargePoint(q, xBallB, yBallB);

        let dataBallA = dataBallCompile(xBallA, yBallA, zBallA);

        let dataBallB = dataBallCompile(xBallB, yBallB, zBallB);


        console.log(dataSurface);
        dataBallAVector = dataBallVectorCompile(xBallA,yBallA);
        dataBallBVector = dataBallVectorCompile(xBallB,yBallB);

        let vectorData = getVectorData(q, xMax, 5);

        vectorData.push(dataLineAVector);
        vectorData.push(dataLineBVector);
        vectorData.push(dataPointAVector);
        vectorData.push(dataPointBVector);
        vectorData.push(dataBallAVector);
        vectorData.push(dataBallBVector);

        $("#functionValueBall1_7b").text(`Electric Potential of Ball 1 = ${Math.round(100*zBallA)/100} V`);
        $("#functionValueBall2_7b").text(`Electric Potential of Ball 2 = ${Math.round(100*zBallB)/100} V`);

        Plotly.react("Vector_Graph_7b", vectorData, layoutVector);
        Plotly.react('Scalar_Graph_7b', [dataSurface, dataLineA, dataLineB, dataPointA, dataPointB, dataBallA, dataBallB], layoutScalar)
    };
};

function main(){
    let q7b = 1*Math.pow(10,-9);
    let xMin = -20;
    let xMax = 20;
    let yMin = -20;
    let yMax = 20;
    let plotStep = 0.33;
    let plotLineStep = 0.11;

    let xLineMin = -16;
    let xLineMax = 5;
    let yLineMin = -2;
    let yLineMax = -2;

    const layoutScalar_7b = {
            title: 'Electric Potential',
            autosize: false,
            width: 500,
            height: 500,
            margin: {
                        l: 65,
                        r: 50,
                        b: 65,
                        t: 90},
            dragmode: 'turntable',
            scene: {
                aspectmode: "cube",
                xaxis: {range: [xMin, xMax], title: 'x'},
                yaxis: {range: [yMin, yMax], title: 'y'},
                zaxis: {range: [-50, 50], title: 'V(x,y)'},

                camera: {
                    up: {x: 0, y: 0, z: 1},//sets which way is up
                    eye: {x: -1, y: -1, z: 1}//adjust camera starting view
                }
            },
    };


    const layoutVector_7b = {
        title: "Electric Field",
        showlegend: false,
        xaxis: {
            constrain: "domain",
            range: [-20, 20],
            title: "x",
            showticklabels: false
        },
        yaxis: {
            scaleanchor: "x",
            range: [-20, 20],
            showticklabels: false,
            title: "y"
        },
        margin: {
            l: 1, r: 1, b: 30, t: 30, pad: 10
        },
    };

    let xySurface = setupSurfaceData(xMin, xMax, yMin, yMax, plotStep);
    let xScalarPlot = xySurface[0];
    let yScalarPlot = xySurface[1];

    let ScalarLine1Plot = setupLineAData(xLineMin, xLineMax, yLineMin, yLineMax, plotLineStep);
    let xScalarLine1_1b = ScalarLine1Plot[0];
    let yScalarLine1_1b = ScalarLine1Plot[1];

    let ScalarLine2Plot = setupLineBData(xLineMin, xLineMax, yLineMin, yLineMax, plotLineStep);
    let xScalarLine2_1b = ScalarLine2Plot[0];
    let yScalarLine2_1b = ScalarLine2Plot[1];

    let lineAVector = setupLineAData(xLineMin, xLineMax, yLineMin, yLineMax, 0.1);
    let dataLineAVector = dataLineAVectorCompile(lineAVector);

    let lineBVector = setupLineBData(xLineMin, xLineMax, yLineMin, yLineMax, 0.1);
    let dataLineBVector = dataLineBVectorCompile(lineBVector);

    let dataPointAVector = dataPointAVectorCompile(xLineMin,yLineMin);
    let dataPointBVector = dataPointBVectorCompile(xLineMax,yLineMax);

    plot(xMin, xMax, yMin, yMax, plotStep, xScalarPlot, yScalarPlot, xScalarLine1_1b, yScalarLine1_1b,
        xScalarLine2_1b, yScalarLine2_1b, xLineMin, yLineMin, xLineMax, yLineMax, dataLineAVector, dataLineBVector, dataPointAVector, dataPointBVector,
        layoutScalar_7b, layoutVector_7b);
//jQuery to update the plot as the value of the slider changes.
    $("input[type=range]").each(function () {
        /*Allows for live update for display values*/
        $(this).on('input', function(){
            //Displays: (FLT Value) + (Corresponding Unit(if defined))
            $("#"+$(this).attr("id") + "Display").val( $(this).val());
            //NB: Display values are restricted by their definition in the HTML to always display nice number.
            plot(xMin, xMax, yMin, yMax, plotStep, xScalarPlot, yScalarPlot, xScalarLine1_1b, yScalarLine1_1b,
            xScalarLine2_1b, yScalarLine2_1b, xLineMin, yLineMin, xLineMax, yLineMax, dataLineAVector, dataLineBVector, dataPointAVector, dataPointBVector,
            layoutScalar_7b, layoutVector_7b); //Updating the plot is linked with display (Just My preference)
        });

    });

    $('#Function_Selector').on("input", function(){
        //update plots when function is changed
        plot(xMin, xMax, yMin, yMax, plotStep, xScalarPlot, yScalarPlot, xScalarLine1_1b, yScalarLine1_1b,
        xScalarLine2_1b, yScalarLine2_1b, xLineMin, yLineMin, xLineMax, yLineMax, dataLineAVector, dataLineBVector, dataPointAVector, dataPointBVector,
        layoutScalar_7b, layoutVector_7b);
    });
};

$(document).ready(main); //Load setup when document is ready.