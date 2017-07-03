let mka = document.getElementById("mka");

export let active = (config) => {
    document.onkeyup = (e) => {
        let selection = document.getElementsByClassName("mka-elt-selected");

        if (e.which == '46' && selection.length > 0) {
            config.deleteFunction(selection);

            Array.from(selection).map(elt => {
                elt.parentNode.removeChild(elt);
            });
        }
    }
}