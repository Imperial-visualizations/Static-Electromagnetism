
/* Start by putting in all initial parameters you want and any constants you want to use (e.g. G = 6.67*10**(-11),
any layout properties (which you probably want to keep constant for an individual part of a visualisation
should go here */

const initialPoint = [1, 0];
const initialPoint3 = [1,0];
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

//B: Maths

/*Next comes all the mathematical functions that are used, if you think a library will do a particular job
that's fine, no need to recreate stuff, but any functions you need to construct yourself should go in this
next block*/


function inner_product(first_vector , second_vector){
    // Returns the inner product of two vectors
    var sum = 0;
    for (var i=0; i<2; i++) {
        sum += first_vector[i] * second_vector[i];
    }
    return sum;
}

function orthogonal(vector_a , vector_b, tolerance = 0){
    //Returns whether vectors a and b are orthogonal
    dot = inner_product(vector_a , vector_b);
    if (dot === 0){
        return true;
        }
    else {
        return false;
        }
    }


function normalised(vector){
    // Returns whether a vector has a normalised basis
    dot = inner_product(vector, vector);
    if (dot === 1){
        return true;
        }
    else {
        return false;
        }
    }

function find_xy(resulting_vector, base_1 , base_2){
    // Finds the projection of "resulting vector" into base_1 and base_2 and returns the
    //coefficients that are needed such the reconstruct the result from the two bases
    b1 = resulting_vector[0];
    b2 = resulting_vector[1];
    p1 = base_1[0];
    p2 = base_1[1];
    q1 = base_2[0];
    q2 = base_2[1];

    if (p1 === 0){
        y = b1 / q1;
        x = (q1*b2 - b1*q2)/p2;
    }
    else if (p1*q2 === p2**2){
        y = (p1*b2 - b1)/(p2**2 - q1*p2);
        x = (b1 - y*q1)/(p1);
    }
    else{
        y = (p1*b2 - p2*b1)/(p1*q2 - p2**2);
        x = (b1/p1) - y*p2;
    }
    return x,y;
}

function projection(target_vector, base_vector){
    //Finds the distance along 'base_vector' the vector 'target_vector' is projected
    dot_product = inner_product(target_vector ,base_vector);
    base_size = Math.sqrt(inner_product(base_vector, base_vector));
    span = dot_product / base_size;
    return span;
}

function scale_vector(original_vector, scale){
    // Multiplies the each component of the original vector by 'scale'
    new_1 = scale * original_vector[0];
    new_2 = scale * original_vector[1];
    new_vector = [new_1, new_2];
    return new_vector;
}

function unpackVertices (vertices) {
    //to unpack the array of vertices allowing us to operate and place them on the graph with ease of control
    for (i=0; i<vertices.length-1; i++) {
        let current_vertex = vertices[i];
        current_vertex.gObject(green, 3),
        current_vertex.arrowHead(green, 3);
    }
    return;
}

function computeBasis(x3,y3) {
    currentPoint3 = [x3, y3];

    rho3 = Math.sqrt(x3**2+y3**2);
    phi3 = Math.atan(x3/y3);

    dx3 = 1;
    dy3 = 1;


    if (x3<0 && y3>0){
    dx3=-dx3;
    }else if (x3>0 && y3<0){
    dy3=-dy3;
    }else if (x3<0 && y3<0){
    dx3=-dx3;
    dy3=-dy3;
    }else{}

    //This is how we first declare objects

    let vnumber =4;
    let hnumber = 4;



    let lhsx = [];
    let rhsx = [];
    let lhsy = [];
    let rhsy = [];
    let widths = [];

    for (i=0; i<hnumber;i++){
        for (j=0;j<vnumber;j++){
            for (let jj=0; jj<2;jj++){
                for (let ii=0;ii<2;ii++) {
                    if (x3 >= 0) {
                        console.log('blah')
                        lhsx.push(((-1) ** ii) * x3 * (i));
                        rhsx.push(((-1) ** ii) * x3 * (i + 1));
                        lhsy.push(((-1) ** jj) * j*y3);
                        rhsy.push(((-1) ** jj) * j*y3);
                        widths.push(Math.abs((hnumber-i)*x3));
                    } else {
                        console.log('blah blah')
                        lhsx.push(((-1) ** ii) * x3 * (i+1));
                        rhsx.push(((-1) ** ii) * x3 * (i));
                        lhsy.push(((-1) ** jj) * j*y3);
                        rhsy.push(((-1) ** jj) * j*y3);
                        widths.push(Math.abs((hnumber-i)*x3));
                    }
                }
            }
        }
     }
    let vertices = [];

    for (i=0; i<lhsx.length; i++){
        let a = new Line2d([[lhsx[i], lhsy[i]], [rhsx[i], rhsy[i]]]);
        vertices.push(a.gObject(blue, widths[i]));
        vertices.push(a.arrowHead(blue, widths[i]));
    }

        function isPositive(x){
        if (Math.abs(x) === x) {
        return true;
        } else {
        return false;
        }
    }

    var data = [];

    for (i=0;i<vertices.length; i++){
        data.push(vertices[i])
        }
    return data;
}

//C: Interactivity

/* We've now got all the functions we need to use such that for a given user input, we have a data output that we'll use.
Now we just have to actually obtain the user input from the HTML file by using JQuery and then plot everything relevant that we want to see*/

function initCarte(type) {
    Plotly.purge("graph");
    initX3 = initialPoint3[0];
    initY3 = initialPoint3[0];


    $("#x3Controller").val(initX3);
    $("#x3ControllerDisplay").val(initX3);
    $("#y3Controller").val(initY3);
    $("#y3ControllerDisplay").val(initY3);
    $("#y3Controller").hide();

    /* ~Jquery
    2.  Declare and store the floating values from x/y- sliders.
        Hint:
            - use document.getElementById('idName').value
            - use parseFloat() to make sure you are getting floating points.
    */


    var x3 = parseFloat(document.getElementById('x3Controller').value);
    var y3 = parseFloat(document.getElementById('y3Controller').value);


    Plotly.newPlot("graph", computeBasis(x3, y3), layout);

    return;
}


//D: Calling

/* Now we have to ask the plots to update every time the user interacts with the visualisation. Here we must both
define what we want it to do when it updates, and then actually ask it to do that. These are the two functions below.
*/

function updatePlot() {
    var data = [];

    var x3 = parseFloat(document.getElementById('x3Controller').value);
    var y3 = parseFloat(document.getElementById('y3Controller').value);


    data = computeBasis(x3,y3);

    Plotly.animate(
        'graph',
        {data: data},
        {
            fromcurrent: true,
            transition: {duration: 0,},
            frame: {duration: 0, redraw: false,},
            mode: "immediate"
        }
    );
}

function main() {
    computeBasis(initialPoint3[0],initialPoint3[1]);

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


    });

    $("#x3ControllerDisplay").change(function () {
     var value = this.value;
     $("#x3Controller").val(value);
     updatePlot();
    });

    $("#y3ControllerDisplay").change(function () {
     var value = this.value;
     $("#y3Controller").val(value);
     $("#y3Controller").hide();
     updatePlot();
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