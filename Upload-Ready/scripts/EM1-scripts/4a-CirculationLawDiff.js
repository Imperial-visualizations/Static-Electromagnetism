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
        x3 = parseFloat(document.getElementById('x3Controller').value);
        Plotly.newPlot("graph-holder", computeBasis(x3), layout);
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