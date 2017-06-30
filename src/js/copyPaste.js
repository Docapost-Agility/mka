let mka = document.getElementById("mka");
let copyElts;

document.onkeyup = (e) => {

    if (e.which == '67' && e.ctrlKey) {
        // on utilise array from pour faire une copie dans un tableau, car lors du ctrl v il ne faut pas prendre en compte la selection actuel
        copyElts = Array.from(document.getElementsByClassName("mka-elt-selected"));
        console.log(copyElts);
    } else if (e.which == '86' && e.ctrlKey) {
        console.log(copyElts);
    }
}