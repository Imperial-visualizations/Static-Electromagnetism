/*
function computeBasis(x1, y1,x2,y2 , x3,y3) {
    currentPoint1 = [x1, y1];   
    dx1 = 1
    dy1 = 1
    dx2= 1
    dy2 = 1
    dx3= 1
    dy3 = 1

    if (x1<0 && y1>0){
    dx1=-dx1;
    }else if (x1>0 && y1<0){
    dy1=-dy1;
    }else if (x1<0 && y1<0){
    dx1=-dx1;
    dy1=-dy1;
    }else{}



    //This is how we first declare objects
    x1Vector = new Line2d([[x1, y1], [x1+dx1, y1]]);
    y1Vector = new Line2d([[x1, y1], [x1, y1+dy1]]);
    vertex1  = new Line2d([[0, 0], [x1, y1]]);


    var data = [


        {type:"scatter",
        mode: "lines",
        x: [0,x1],
        y: [0,y1],
        line: {color: black, width: 3, dash: "solid"},
        },


        vertex1.gObject(cherry, 3),
        vertex1.arrowHead(cherry, 3),
     ]
    ;
    return data;
}

//C: Interactivity
*/
//A: Global Initial Parameters:

/* Start by putting in all initial parameters you want and any constants you want to use (e.g. G = 6.67*10**(-11),
any layout properties (which you probably want to keep constant for an individual part of a visualisation
should go here */

const initialPoint = [0, 1];
const initialPoint1 = [1.1, 0.1];
const initialPoint2 = [0.1,1.1];
const initialPoint3 = [1,1];
const layout = {
    autosize: true,
    //width: 450, "height": 500,
    margin: {l:30, r:30, t:30, b:30},
    hovermode: "closest",
    showlegend: false,
    xaxis: {range: [-5, 5], zeroline: true},
    yaxis: {range: [-5, 5], zeroline: true},
    aspectratio: {x:1, y:1},
};
var currentPoint = initialPoint;
var initX1 = 0, initY1 = 0;
var initX2 = 0, initY2 = 0;
var isBlackText = false;


//B: Maths

/*Next comes all the mathematical functions that are used, if you think a library will do a particular job
that's fine, no need to recreate stuff, but any functions you need to construct yourself should go in this
next block*/










function computeBasis(x3) {
    let i;
    dx1 = 5
    dy1 = 1
    dx2= 1
    dy2 = 1
    dx3= 1
    dy3 = 1

    //This is how we first declare objects
    x1Vector = new Line2d([[2 * x3, -2], [2 * x3, -2]]);
    y1Vector = new Line2d([[2 * x3, -2], [2 * x3, -2+dy1]]);
  /*  vertex8  = new Line2d([[-10, -2], [2 * x3, -2]]);
    vertex9  = new Line2d([[-10, -1], [x3, -1]]);
    vertex10  = new Line2d([[-10, 0], [0, 0]]);
    vertex11  = new Line2d([[-10, 1], [-x3, 1]]);
    vertex12  = new Line2d([[-10, 2], [-2*x3, 2]]);*/
    
    vertex8  = new Line2d([[-10, -2], [10, -2]]);
    vertex9  = new Line2d([[-10, -1], [10, -1]]);
    vertex10  = new Line2d([[-10, 0], [10, 0]]);
    vertex11  = new Line2d([[-10, 1], [10, 1]]);
    vertex12  = new Line2d([[-10, 2], [10, 2]]);                            //increasing line length as function of current density slider
    
    circ11 = new Circle(0.5,Math.abs(x3/2.5));//opacity of circle proportional to magnitude of current
    
    circ21 = new Circle(0.5,Math.abs(x3/2.5));
    
    circ31 = new Circle(0.5,Math.abs(x3/2.5));
    
    circ41 = new Circle(0.5,Math.abs(x3/2.5));
    
    circ12 = new Circle(0.25,Math.abs(x3/2.5));
    circ22 = new Circle(0.25,Math.abs(x3/2.5));
    circ32 = new Circle(0.25,Math.abs(x3/2.5));
    circ42 = new Circle(0.25,Math.abs(x3/2.5));
    
    cross11  = new Line2d([[2-0.35355,2-0.35355],[2+0.35355,2+0.35355]]);
    cross12  = new Line2d([[2-0.35355,2+0.35355],[2+0.35355,2-0.35355]]);
    cross21  = new Line2d([[-2-0.35355,2-0.35355],[-2+0.35355,2+0.35355]]);
    cross22  = new Line2d([[-2-0.35355,2+0.35355],[-2+0.35355,2-0.35355]]);
    cross31  = new Line2d([[-2-0.35355,-2-0.35355],[-2+0.35355,-2+0.35355]]);
    cross32  = new Line2d([[-2-0.35355,-2+0.35355],[-2+0.35355,-2-0.35355]]);
    cross41  = new Line2d([[2-0.35355,-2-0.35355],[2+0.35355,-2+0.35355]]);
    cross42  = new Line2d([[2-0.35355,-2+0.35355],[2+0.35355,-2-0.35355]]);
    let arr = [];
   for(i=0;i<10;i++)
     {
        let r = 0.25;
        let opacity=Math.abs(x3/2.5);
        console.log(r,opacity)
        arr.push(new  Circle(r,opacity));}
    

 if (x3<=0)
    { let j;
    var data = [



       // let z = 6 + (2.5*x3);
       // x1Vector.arrowHead(color= cherry,width= 3,wingLen= 5),
        vertex8.arrowHead(cherry, 6),
        vertex8.gObject(black, 1,Math.abs(6 + (2.5*x3))),
        vertex9.gObject(black,1, Math.abs(6 + (1.25*x3))),
        vertex10.gObject(black, 1,Math.abs(6)),
        vertex11.gObject(black,1, Math.abs(6 - (1.25*x3))),
        vertex12.gObject(black,1, Math.abs(6 - (2.5*x3))),
        
        circ11.gObject(cherry,[2,2]),
        circ21.gObject(cherry,[-2,2]),
        circ31.gObject(cherry,[2,-2]),
        circ41.gObject(cherry,[-2,-2]),
       
        cross11.gObject(cherry,Math.abs(x3/2.5),5),
        cross12.gObject(cherry,Math.abs(x3/2.5),5),
        cross21.gObject(cherry,Math.abs(x3/2.5),5),
        cross22.gObject(cherry,Math.abs(x3/2.5),5),
        cross31.gObject(cherry,Math.abs(x3/2.5),5),
        cross32.gObject(cherry,Math.abs(x3/2.5),5),
        cross41.gObject(cherry,Math.abs(x3/2.5),5),
        cross42.gObject(cherry,Math.abs(x3/2.5),5)

    
     ];
     /*for (let j=0;j<10;j++)
    {  let a = arr[j];
        let b = a.gObject(cherry,[-0.5*j,0.5*j]);
        data.push(b);
     }*/
    
    }
    else
    {

    var data = [


   // let z = 6 + (2.5*x3);
   // x1Vector.arrowHead(color= cherry,width= 3,wingLen= 5),
    vertex8.arrowHead(cherry, 6),
    vertex8.gObject(black, 1,Math.abs(6 + (2.5*x3))),
    vertex9.gObject(black, 1,Math.abs(6 + (1.25*x3))),
    vertex10.gObject(black, 1,Math.abs(6)),
    vertex11.gObject(black, 1,Math.abs(6 - (1.25*x3))),
    vertex12.gObject(black, 1,Math.abs(6 - (2.5*x3))),
    
    circ11.gObject(blue,[2,2]),
    circ21.gObject(blue,[-2,2]),
    circ31.gObject(blue,[2,-2]),
    circ41.gObject(blue,[-2,-2]),
   
    circ12.gObject(blue,[2,2]),
    circ22.gObject(blue,[-2,-2]),
    circ32.gObject(blue,[-2,2]),
    circ42.gObject(blue,[2,-2]),
    

 ]; 
/* for (let j=0;j<10;j++){
    let a = arr[j];
    let b = a.gObject(blue,[-0.5*j,0.5*j]);
    data.push(b);
    }*/
 }

    return data;
}

//C: Interactivity

/* We've now got all the functions we need to use such that for a given user input, we have a data output that we'll use.
Now we just have to actually obtain the user input from the HTML file by using JQuery and then plot everything relevant that we want to see*/

function initCarte(type) {
    Plotly.purge("graph");
    initX1 = initialPoint1[0];
    initY1 = initialPoint1[1];
    initX2 = initialPoint2[0];
    initY2 = initialPoint2[1];
    initX3 = initialPoint3[0];
    initY3 = initialPoint3[1];



    $("#x3Controller").val(initX3);
    $("#x3ControllerDisplay").val(initX3);


    /* ~Jquery
    2.  Declare and store the floating values from x/y- sliders.
        Hint:
            - use document.getElementById('idName').value
            - use parseFloat() to make sure you are getting floating points.
    */



    var x3 = parseFloat(document.getElementById('x3Controller').value);
  


    Plotly.newPlot("graph", computeBasis(x3), layout);

    return;
}


//D: Calling

/* Now we have to ask the plots to update every time the user interacts with the visualisation. Here we must both
define what we want it to do when it updates, and then actually ask it to do that. These are the two functions below.
*/

function updatePlot() {
    var data = [];


    var x3 = parseFloat(document.getElementById('x3Controller').value);
   // var y3 = parseFloat(document.getElementById('y3Controller').value);


    data = computeBasis(x3);

    Plotly.animate(
        'graph',
        {data: data},
        {
            fromcurrent: true,
            transition: {duration: 0,},
            frame: {duration: 0, redraw: false,},
            mode: "afterall"
        }
    );
}





function main() {
    computeBasis(initX1, initY1,initX2,initY2 , initialPoint3[0],initialPoint3[1]);

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
     updatePlot();
    });



    });

    /*Tabs*/
    $(function() {
        $('ul.tab-nav li a.button').click(function() {
            var href = $(this).attr('href');
            $('li a.active.button', $(this).parent().parent()).removeClass('active');
            $(this).addClass('active');
            $('.tab-pane.active', $(href).parent()).removeClass('active');
            $(href).addClass('active');

            initCarte(href); //re-initialise when tab is changed
            return false;
        });
    });

    //The First Initialisation - I use 's' rather than 'z' :p
    initCarte("#basis");
    updatePlot(); //Shows initial positions of vectors
    }

$(document).ready(main); //Load main when document is ready.