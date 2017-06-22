const elements = document.getElementsByClassName("mouseAndKeyboardActions");
Array.from(elements).forEach(function (elem) {
    elem.addEventListener('contextmenu', function (e) {
        e.preventDefault();

        document.getElementById('main').innerHTML +=
            '<div id="rmenu">' +
            '<ul>' +
            '<li>White</li>' +
            '<li>Green</li>' +
            '<li>Yellow</li>' +
            '<li>Orange</li>' +
            '<li>Red</li>' +
            '<li>Blue</li>' +
            '</ul>' +
            '</div>';

        $("#rmenu").css(
            {
                position: "absolute",
                top: e.pageY,
                left: e.pageX
            }
        );
    }, false);
})


$(document).bind("click", function (event) {
    if (document.getElementById("rmenu")) {
        document.getElementById("rmenu").remove();
    }
});
