let O11 = 3;
let sliderVal = document.getElementById("myRange").value;
let BsliderVal = document.getElementById("B_slide").value;
let AsliderVal = document.getElementById("A_slide").value;
let NsliderVal = document.getElementById("N_slide").value;
let button_no = 0;

document.getElementById("myRange").oninput = function () {
    sliderVal = this.value;
    document.getElementById('myRangeDisplay').innerHTML = this.value
};

document.getElementById("A_slide").oninput = function () {
    AsliderVal = this.value;
    document.getElementById('A_slideDisplay').innerHTML = this.value
};

document.getElementById("B_slide").oninput = function () {
    BsliderVal = this.value;
    document.getElementById('B_slideDisplay').innerHTML = this.value
};

document.getElementById("N_slide").oninput = function () {
    NsliderVal = this.value;
    document.getElementById('N_slideDisplay').innerHTML = this.value
};