let mka = document.getElementById("mka");
let copyElts;

export let active = (config) => {
    document.onkeyup = (e) => {
        if (e.which == '67' && e.ctrlKey) {
            // on utilise array from pour faire une copie dans un tableau,
            // car lors du ctrl v il ne faut pas prendre en compte la selection actuel
            copyElts = Array.from(document.getElementsByClassName("mka-elt-selected"));
        } else if (e.which == '86' && e.ctrlKey) {
            config.pasteFunction(copyElts);
        }
    }
}