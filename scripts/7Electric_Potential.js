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


function setLayout(sometitlex, sometitley, sometitlez, Mode){
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
                xaxis: {range: [-100, 100], title: sometitlex, showticklabels: false},
                yaxis: {range: [-100, 100], title: sometitley, showticklabels: false},
                zaxis: {range: [-100, 100], title: sometitlez, showticklabels: false},

                camera: {
                    up: {x: 0, y: 0, z: 1},//sets which way is up
                    eye: {x: 0, y: -1, z: 1}//adjust camera starting view
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
                range: [-100, 100],
                title: "x",
                showticklabels: false
                //title: "Angle"
            },
            yaxis: {
                scaleanchor: "x",
                range: [-100, 100],
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

function GetScalarData(Q, Equation, x_max, PlotStep){
    let x = [];
    let y = [];
    let z = [];
    let inner_z = [];
    let CurrentZ = 0;
    let e = 1.6*10**(-19);
    let C = 4*Math.PI*8.85*10**(-12);

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

        x: x,
        y: y,
        z: z,

    }];

    return ScalarData;
}

function GetVectorData(Q, x_max, PlotStep){
    let ArrowData = [];
    //let z = [];
    let VectorData = [];
    
    let CurrentArrow, LineStuff;

    let x = [];
    let y = [];

    let x2 = 0;
    let y2 = 0;
    
    let e = 1.6*10**(-19);
    let C = 4*Math.PI*8.85*10**(-12);

    
    
    for (let i = -x_max; i <= x_max; i += PlotStep){
        for (let j = -x_max; j <= x_max; j += PlotStep){
            x[0] = i;
            y[0] = j;
            
            x2 = -A*b**2*x[0]*((b*x[0])**2 + (b*y[0])**2)**(-3/2);
            y2 = -A*b**2*y[0]*((b*x[0])**2 + (b*y[0])**2)**(-3/2);
                    

            x2 = x2*4;
            y2 = y2*4;

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

    return VectorData;
}

function GetArrowPoints(x1, y1, Equation, A){
    let x = [x1];
    let y = [y1];

    let x2 = 0;
    let y2 = 0;

    let b = 0;
    let c = 0;
    switch (Equation){
        case "A": //reciprocal 
            b = 1/A;
            x2 = -A*b**2*x1*((b*x1)**2 + (b*y1)**2)**(-3/2);
            y2 = -A*b**2*y1*((b*x1)**2 + (b*y1)**2)**(-3/2);
            break;

        case "B":  //gaussian type
            c = 50;
            b = 1/500;
            x2 = 2*A*b*((x1 - c)*Math.exp(-b*((x1 - c)**2 + y1**2))-(x1 + c)*Math.exp(-b*((x1 + c)**2 + y1**2)));
            y2 = 2*A*b*y1*(Math.exp(-b*((x1 - c)**2 + y1**2))-Math.exp(-b*((x1 + c)**2 + y1**2)));
            break;

        case "C": //cos type
            b = 0.1;
            x2 = -A*b*Math.sin(b*x);
            y2 = 0;
            break;
    }
    x2 = x2*4;
    y2 = y2*4;
    x.push(x1 + x2);
    y.push(y1 + y2);

    return [x, y];
}

function DisplayEquations(Equation){
    document.getElementById("A_function_eqn").style.display = "none";
    document.getElementById("B_function_eqn").style.display = "none";
    document.getElementById("C_function_eqn").style.display = "none";
    document.getElementById("A_grad_eqn").style.display = "none";
    document.getElementById("B_grad_eqn").style.display = "none";
    document.getElementById("C_grad_eqn").style.display = "none";

    switch (Equation){
        case "A": //reciprocal 
            document.getElementById("A_function_eqn").style.display = "block";
            document.getElementById("A_grad_eqn").style.display = "block";
            break;

        case "B":  //gaussian type
            document.getElementById("B_function_eqn").style.display = "block";
            document.getElementById("B_grad_eqn").style.display = "block";
            break;

        case "C": //cos type
            document.getElementById("C_function_eqn").style.display = "block";
            document.getElementById("C_grad_eqn").style.display = "block";
            break;
    }
}

function UpdatePlots(ScalarData, VectorData){
    Plotly.react('Scalar_Graph_1a', ScalarData, setLayout('x', 'y', 'f(x,y)', 'Scalar'));
    Plotly.react('Vector_Graph_1a', VectorData, setLayout('x', 'y', 'Vector2D'));
}

function NewPlots(ScalarData, VectorData){
    Plotly.newPlot('Scalar_Graph_1a', ScalarData, setLayout('x', 'y', 'f(x,y)', 'Scalar'));
    Plotly.newPlot('Vector_Graph_1a', VectorData, setLayout('x', 'y', 'Vector2D'));
}






function GetNewInputs(){
    let A = parseFloat(document.getElementById("Slider_1").value);
    let Function = document.getElementById("Function_Selector").value;
    //expecting to return a character

    return [A, Function];
}

function Refresh(PlotNew = false){
    //Define a few constants
    let x_max = 100; //max x value permitted on graph.  Will be mirrored and also same in y
    let ScalarPlotStep = 2;//x_max/100; //distance between points that are plotted
    let VectorPlotStep = 20;


    let NewInputs = GetNewInputs();
    let A = NewInputs[0]; //coefficient to change gradient
    let Equation = NewInputs[1];
    //A = 100;
    //now plot graphs
    let ScalarData = GetScalarData(A, Equation, x_max, ScalarPlotStep);
    let VectorData = GetVectorData(A, Equation, x_max, VectorPlotStep);
    //GetVectorData(A, Function);

    DisplayEquations(Equation);

    if (PlotNew){
        NewPlots(ScalarData, VectorData);
    }else{
        UpdatePlots(ScalarData, VectorData);
    }
    //UpdateScalarPlot(ScalarData);
    //UpdateVectorPlot();
}



function Setup1a() {
    $('#Slider_1').on("input", function(){
        //update plots when coefficient changed
        $("#" + $(this).attr("id") + "Display").text($(this).val() + $("#" + $(this).attr("id") + "Display").attr("data-unit"));
        Refresh();
    });

    $('#Function_Selector').on("input", function(){
        //update plots when function is changed
        Refresh();
    });

    Refresh(PlotNew = true);
}



$(document).ready(Setup1a); //Load setup when document is ready.