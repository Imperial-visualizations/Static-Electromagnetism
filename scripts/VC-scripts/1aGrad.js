/*jshint esversion: 7 */




function setLayout(sometitlex, sometitley, sometitlez, Mode){
    //set layout of graphs.  'Mode' sets what type of graph you want the layout for
    let new_layout = 0;
    if (Mode == "Scalar"){ //layout for scalar graph
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
    }else if (Mode == "Vector3D"){ //mode == "Vector3D" - for the 3d vector graph (no longer exists)
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
    }else{//mode = Vector2D - layout for 2d vector graph
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

function GetScalarData(A, Equation, x_max, PlotStep){
    //get graph data for scalar graph.
    let x = [];
    let y = [];
    let z = [];
    let inner_z = [];
    let CurrentZ = 0;

    //create data for axes - these are just 1d arrays
    for (let q = -x_max; q <= x_max; q += PlotStep){
        y.push(q);
        x.push(q);
    }

    switch (Equation){
        case "B": //reciprocal 
            for (let j = -x_max; j <= x_max; j += PlotStep){
                for (let i = -x_max; i <= x_max; i += PlotStep){
                    //i is x and j is y.  CurrentZ is the z value at that x,y
                    CurrentZ = A/(Math.sqrt(((1/(A))*i)**2 + ((1/(A))*j)**2));
                    //push z value into array for this particular row along x axis
                    inner_z.push(CurrentZ);
                }
                z.push(inner_z); //push row array into 2d array for whole grid
                inner_z = []; //reset row array for next pass
            }
            break;

        case "A":  //gaussian type
            for (let j = -x_max; j <= x_max; j += PlotStep){
                for (let i = -x_max; i <= x_max; i += PlotStep){
                    CurrentZ = A*Math.exp(-((i + 50)**2 + j**2)/(500)) - A*Math.exp(-((i - 50)**2 + j**2)/(500));
                    inner_z.push(CurrentZ);  
                }
                z.push(inner_z);
                inner_z = [];
            }
            break;

        case "C": //cos type
            for (let j = -x_max; j <= x_max; j += PlotStep){
                for (let i = -x_max; i <= x_max; i += PlotStep){
                    CurrentZ = A*Math.cos(0.05*i);
                    inner_z.push(CurrentZ);
                }
                z.push(inner_z);
                inner_z = [];
            }
            break;
    }

    let ScalarData = [{ //define the data structure required to produce the scalar graph correctly
        type: 'surface',
        // alphahull:5,
        // opacity:0.8,
        // color:'rgb(200,100,300)',
        // type: "mesh3d",
        x: x,
        y: y,
        z: z,
        //showscale: false,
        //hoverinfo: "skip",
        //usecolormap: false,
        // diffuse: 0,
        // roughness: 0,
        // specular: 0,
        // fresnel: 0
        //connectgaps: true
    }];

    return ScalarData;
}

function GetVectorData2(A, Equation, x_max, PlotStep){ //this function was swapped with GetVectorData in order to reduce computation time
    //FUNCTION IS NOT BEING USED - GETVECTORDATA REPLACES IT.  SMALL CHANGE TO TRY TO REDUCE COMPUTATION TIME (DIDNT REALLY WORK)
    let ArrowData = [];
    let VectorData = [];


    let CurrentArrow, LineStuff;
    
    
    for (let i = -x_max; i <= x_max; i += 10*PlotStep){
        for (let j = -x_max; j <= x_max; j += 10*PlotStep){
            ArrowData = GetArrowPoints(i, j, Equation, A);

            CurrentArrow = new Arrow(ArrowData[0][0], ArrowData[1][0], ArrowData[0][1], ArrowData[1][1], 2);
            LineStuff = CurrentArrow.GetDrawData();
           
            VectorData.push(LineStuff[0]);
            VectorData.push(LineStuff[1]);
            VectorData.push(LineStuff[2]);
           
        }
    }


    return VectorData;

}

function GetVectorData(A, Equation, x_max, PlotStep){
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
    
    switch (Equation){ //run different code depending on the equation
        case "B": //reciprocal 
            for (let i = -x_max; i <= x_max; i += PlotStep){
                for (let j = -x_max; j <= x_max; j += PlotStep){
                    x[0] = i; //tail of arrow is at x,y position of interest
                    y[0] = j;
                   
                    b = 1/A; //just a constant for the equation
                    //head of arrow is at x, y given by finding grad of the function
                    //(these are actually horizontal and vertical components of arrows)
                    x2 = -A*b**2*x[0]*((b*x[0])**2 + (b*y[0])**2)**(-3/2); 
                    y2 = -A*b**2*y[0]*((b*x[0])**2 + (b*y[0])**2)**(-3/2);
                            

                    x2 = x2*4; //multiply to make arrows more visible
                    y2 = y2*4;

                    x[1] = x[0] + x2; // add on components to original x, y values to get
                    y[1] = y[0] + y2; //arrow coordinates.
                
                    ArrowData = [x, y];
                    
                    //create a new arrow
                    CurrentArrow = new Arrow(ArrowData[0][0], ArrowData[1][0], ArrowData[0][1], ArrowData[1][1], 2);
                    //get the arrow data from the arrow object
                    LineStuff = CurrentArrow.GetDrawData2D();
                    
                    //push the arrow data into the array for plotting.
                    VectorData.push(LineStuff[0]);
                    VectorData.push(LineStuff[1]);
                    VectorData.push(LineStuff[2]);
                }
            }
            break;


        case "A":  //gaussian type.  see case "A" for explanation
            
            for (let i = -x_max; i <= x_max; i += PlotStep){
                for (let j = -x_max; j <= x_max; j += PlotStep){
                    x[0] = i;
                    y[0] = j;

                    b = 1/500;
                    c = 50;
                    x2 = 2*A*b*((x[0] - c)*Math.exp(-b*((x[0] - c)**2 + y[0]**2))-(x[0] + c)*Math.exp(-b*((x[0] + c)**2 + y[0]**2)));
                    y2 = 2*A*b*y[0]*(Math.exp(-b*((x[0] - c)**2 + y[0]**2))-Math.exp(-b*((x[0] + c)**2 + y[0]**2)));
                            
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

            break;

        case "C": //cos type
            for (let i = -x_max; i <= x_max; i += PlotStep){
                for (let j = -x_max; j <= x_max; j += PlotStep){
                    //ArrowData = GetArrowPoints(i, j, Equation, A);
                    x[0] = i;
                    y[0] = j;
                    
                    b = 0.05;
                    x2 = -A*b*Math.sin(b*x[0]);
                    y2 = 0;
                            
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
            break;
    }

    

    return VectorData;
}

function GetArrowPoints(x1, y1, Equation, A){
    //this function isnt being used anymore because it was compressed into GetVectorData
    //in a pathetic attempt to reduce computation time.
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
    //This function makes sure only the correct equations are being displayed at a particular time
    //first we hide all the equations
    document.getElementById("A_function_eqn_1a").style.display = "none";
    document.getElementById("B_function_eqn_1a").style.display = "none";
    document.getElementById("C_function_eqn_1a").style.display = "none";
    document.getElementById("A_grad_eqn_1a").style.display = "none";
    document.getElementById("B_grad_eqn_1a").style.display = "none";
    document.getElementById("C_grad_eqn_1a").style.display = "none";

    //then we show only the correct equations
    switch (Equation){
        case "A": //reciprocal 
            //need to display both the function and the grad of the function
            document.getElementById("A_function_eqn_1a").style.display = "block";
            document.getElementById("A_grad_eqn_1a").style.display = "block";
            break;

        case "B":  //gaussian type
            document.getElementById("B_function_eqn_1a").style.display = "block";
            document.getElementById("B_grad_eqn_1a").style.display = "block";
            break;

        case "C": //cos type
            document.getElementById("C_function_eqn_1a").style.display = "block";
            document.getElementById("C_grad_eqn_1a").style.display = "block";
            break;
    }
}

function UpdatePlots(ScalarData, VectorData){
    //update plots using react - should be faster than doing newPlot
    Plotly.react('Scalar_Graph_1a', ScalarData, setLayout('x', 'y', 'f(x,y)', 'Scalar'));
    Plotly.react('Vector_Graph_1a', VectorData, setLayout('x', 'y', 'Vector2D'));
}

function NewPlots(ScalarData, VectorData){
    //create plots using newPlot
    Plotly.newPlot('Scalar_Graph_1a', ScalarData, setLayout('x', 'y', 'f(x,y)', 'Scalar'));
    Plotly.newPlot('Vector_Graph_1a', VectorData, setLayout('x', 'y', 'Vector2D'));
}






function GetNewInputs(){
    let A = parseFloat(document.getElementById("Slider_1_1a").value);
    //get coefficient for graphs
    let Function = document.getElementById("Function_Selector_1a").value;
    //get function from drop down menu.  'Function' is just a character like A B or C
    return [A, Function];
}

function Refresh(PlotNew = false){
    //Define a few constants
    let x_max = 100; //max x value permitted on graph.  Will be mirrored and also same in y
    let ScalarPlotStep = 2;//x_max/100; //distance between points that are plotted on scalar graph
    let VectorPlotStep = 20; //distance between plotted points on vector graph


    let NewInputs = GetNewInputs(); //get new inputs from page
    let A = NewInputs[0]; //coefficient to change gradient
    let Equation = NewInputs[1];
    //now get graph data
    //get graph data for scalar graph
    let ScalarData = GetScalarData(A, Equation, x_max, ScalarPlotStep);
    //get graph data for vector graph
    let VectorData = GetVectorData(A, Equation, x_max, VectorPlotStep);

    //display the correct equations on screen
    DisplayEquations(Equation);

    //now plot graphs.  If it's the first time running, newPlot will be used rather than react
    if (PlotNew){
        NewPlots(ScalarData, VectorData);
    }else{
        UpdatePlots(ScalarData, VectorData);
    }
}



function Setup1a() {
    $('#Slider_1_1a').on("input", function(){
        //update plots when coefficient changed
        //update slider 1 text
        $("#" + $(this).attr("id") + "Display").text($(this).val() + $("#" + $(this).attr("id") + "Display").attr("data-unit"));
        //update graph
        Refresh();
    });

    $('#Function_Selector_1a').on("input", function(){
        //update plots when function is changed
        Refresh();
    });

    Refresh(PlotNew = true); //update plots upon setup.  This is the first time graphs are run upon opening the page
}



$(document).ready(Setup1a); //Load setup when document is ready.