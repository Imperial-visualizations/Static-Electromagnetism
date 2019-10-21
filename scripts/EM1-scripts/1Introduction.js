document.getElementsByClassName("tabLeft")[0].addEventListener(
    "click",
    function () {
        document.getElementsByClassName("tabLeft")[0].classList.add('shaded');
        document.getElementsByClassName("tabRight")[0].classList.remove('shaded');
    });

document.getElementsByClassName("tabRight")[0].addEventListener(
    "click",
    function () {
        document.getElementsByClassName("tabRight")[0].classList.add('shaded');
        document.getElementsByClassName("tabLeft")[0].classList.remove('shaded');
    });