const elements = document.getElementsByClassName("mouseAndKeyboardActions");
Array.from(elements).forEach(function (elem) {
    elem.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        console.log('e', e);
    }, false);
})
