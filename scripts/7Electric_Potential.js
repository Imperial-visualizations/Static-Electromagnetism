/*jshint esversion: 7 */



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

}


function setLayout(sometitlex, sometitley, sometitlez, Mode, x_max){
    let new_layout = 0;
    if (Mode == "Scalar"){
        new_layout = {//layout of 3D graph
            showlegend: false,
            showscale: false,
            uirevision: 'dataset',
            margin: {
                l: 10, r: 10, b: 10, t: 1, pad: 0
            },
            dragmode: 'turntable',
            scene: {
                aspectmode: "cube",
                xaxis: {range: [-x_max, x_max], title: sometitlex, showticklabels: false},
                yaxis: {range: [-x_max, x_max], title: sometitley, showticklabels: false},
                zaxis: {range: [-x_max, x_max], title: sometitlez, showticklabels: false},

                camera: {
                    up: {x: 0, y: 0, z: 1},//sets which way is up
                    eye: {x: 0, y: -2, z: 0.4}//adjust camera starting view
                }
            },
        };
    }else if (Mode == "Vector3D"){ //mode == "Vector3D"
        new_layout = {//layout of 3D graph
            showlegend: false,
            showscale: false,
            margin: {
                l: 10, r: 10, b: 10, t: 1, pad: 0
            },
            dragmode: 'orbit',
            scene: {
                aspectmode: "cube",
                xaxis: {range: [-100, 100], title: sometitlex},
                yaxis: {range: [-100, 100], title: sometitley},
                zaxis: {range: [-10, 10], title: sometitlez},

                camera: {
                    up: {x: 0, y: 0, z: 1},//sets which way is up
                    eye: {x: -5, y: -5, z: 5}//adjust camera starting view
                }
            },
        };
    }else{//mode = Vector2D
        new_layout = {
            //autosize: true,
            
            showlegend: false,
            xaxis: {
                constrain: "domain",
                range: [-x_max, x_max],
                title: "x",
                showticklabels: false
                //title: "Angle"
            },
            yaxis: {
                scaleanchor: "x",
                range: [-x_max, x_max],
                showticklabels: false,
                title: "y"
            },
            margin: {
                l: 1, r: 1, b: 30, t: 10, pad: 1
            },
            // legend: {
            //     x: 0, y: 10,
            //     orientation: "h"
            // },
            // font: {
            //     family: "Fira Sans",
            //     size: 16
            // }
        };
    }
    return new_layout;
}

function GetScalarData(Q, x_max, PlotStep){
    let x = [];
    let y = [];
    let z = [];
    let inner_z = [];
    let CurrentZ = 0;
    let e = 1;//1.6*10**(-19);
    let C = 1;  //4*Math.PI*8.85*10**(-12);

    for (let k = -x_max; k <= x_max; k += PlotStep){
        y.push(k);
        x.push(k);
    }

   
    for (let j = -x_max; j <= x_max; j += PlotStep){
        for (let i = -x_max; i <= x_max; i += PlotStep){
            CurrentZ = (Q*e)/(C*Math.sqrt(i**2 + j**2));
            inner_z.push(CurrentZ);
        }
        z.push(inner_z);
        inner_z = [];
    }

    let ScalarData = [{
        type: 'surface',
        showscale: false,
        hoverinfo: "skip",
        x: x,
        y: y,
        z: z,

    }];
    
    //attempt to draw sphere to represent charge
    // let spherex = [];
    // let spherey = [];
    // let spherez = [];
    
    // for (let phi = 0; phi <= 2*Math.PI; phi += Math.PI/4){
    //     for (let theta = 0; theta <= (3/4)*Math.PI; theta += Math.PI/4){
        
    //         spherex.push(Math.cos(phi));
    //         spherey.push(Math.sin(phi));
    //         spherez.push(Math.cos(theta));

    //         spherex.push(Math.cos(phi));
    //         spherey.push(Math.sin(phi));
    //         spherez.push(Math.cos(theta + Math.PI/4));

    //         spherex.push(Math.cos(phi + Math.PI/4));
    //         spherey.push(Math.sin(phi + Math.PI/4));
    //         spherez.push(Math.cos(theta + Math.PI/4));

    //     }
    // }


    // let SphereData = {
    //     type: "mesh3d",
    //     x: spherex,
    //     y: spherey,
    //     z: spherez
        
       
    // };

    // ScalarData.push(SphereData);

    return ScalarData;
}

function GetVectorData(Q, x_max, PlotStep){
    let ArrowData = [];

    let VectorData = [];
    
    let CurrentArrow, LineStuff;

    let x = [];
    let y = [];

    let x2 = 0;
    let y2 = 0;
    let Temp = 0;
    
    let e = 1; //1.6*10**(-19);
    let C = 1;//4*Math.PI*8.85*10**(-12);

    for (let i = -x_max; i <= x_max; i += PlotStep){
        for (let j = -x_max; j <= x_max; j += PlotStep){
            x[0] = i;
            y[0] = j;
            
            Temp = (Q*e)/(C*(i**2 + j**2)**(3/2));
            x2 = Temp*i;
            y2 = Temp*j;

            x2 = 2*x2;
            y2 = 2*y2;

            x[1] = x[0] + x2;
            y[1] = y[0] + y2;
        
            ArrowData = [x, y];

            CurrentArrow = new Arrow(ArrowData[0][0], ArrowData[1][0], ArrowData[0][1], ArrowData[1][1], 0.5);
            LineStuff = CurrentArrow.GetDrawData2D();
            
            VectorData.push(LineStuff[0]);
            VectorData.push(LineStuff[1]);
            VectorData.push(LineStuff[2]);
        }
    }

    return VectorData;
}


function UpdatePlots(ScalarData, VectorData, x_max){
    Plotly.react('Scalar_Graph_7a', ScalarData, setLayout('x', 'y', 'f(x,y)', 'Scalar', x_max));
    Plotly.react('Vector_Graph_7a', VectorData, setLayout('x', 'y', 'Vector2D', x_max));
}

function NewPlots(ScalarData, VectorData, x_max){
    Plotly.newPlot('Scalar_Graph_7a', ScalarData, setLayout('x', 'y', 'f(x,y)', 'Scalar', x_max));
    Plotly.newPlot('Vector_Graph_7a', VectorData, setLayout('x', 'y', 'Vector2D', x_max));
}

function GetNewInputs(){
    let Q = parseFloat(document.getElementById("Slider_1_7a").value);

    return Q;
}

function Refresh(PlotNew = false){
    //Define a few constants
    let x_max = 10; //max x value permitted on graph.  Will be mirrored and also same in y
    let ScalarPlotStep = 0.25;//x_max/100; //distance between points that are plotted
    let VectorPlotStep = 2.5;


    let Q = GetNewInputs();//coefficient to change gradient
    //now get graph data
    let ScalarData = GetScalarData(Q, x_max, ScalarPlotStep);
    let VectorData = GetVectorData(Q, x_max, VectorPlotStep);

    if (PlotNew){
        NewPlots(ScalarData, VectorData, x_max);
    }else{
        console.log(ScalarData);
        UpdatePlots(ScalarData, VectorData, x_max);
    }
}



function Setup7Potential() {
    $('#Slider_1_7a').on("input", function(){
        //update plots when coefficient changed
        $("#" + $(this).attr("id") + "Display").text($(this).val() + $("#" + $(this).attr("id") + "Display").attr("data-unit"));
        Refresh();
    });

    Refresh(PlotNew = true);
    //Refresh();
}



$(document).ready(Setup7Potential); //Load setup when document is ready.