export let active = () => {
    let isElementFocused = false;

    document.onmousedown = (event) => {
        isElementFocused = setMkaElementFocus(event.target);
    }

    document.onkeyup = (e) => {
        //Si la touche 'Ctrl' est pressée
        if (event.ctrlKey) {
            let code = e.which;

            //Si on appuie sur 'a' ou 'A' que selectAllShortcut = true et que mka est focus
            if ((code === 65 || code === 97) && isElementFocused) {

                let mkaElts = document.getElementsByClassName("mka-elt");
                //On applique la classe selected à tous les éléments, de plus chaques éléments devient draggable
                Array.from(mkaElts).map(elt => {
                    elt.classList.add("mka-elt-selected");
                    elt.draggable = true;
                });

                //On inidque le nombre d'éléments sélectionnés
                document.getElementById("mka-count").innerHTML = mkaElts.length;

                return false;
            }
        }
    }
}

//Fonction qui retourne true ou false si l'id de l'élément ou d'un de ses parents est valide
let setMkaElementFocus = (target) => {
    //Si la target possède la bonne id > return true
    if (target.id === "mka") {
        return true;
    }

    //Tant qu'il y a des éléments parents on cherche l'id souhaitée
    while (target.parentNode) {
        target = target.parentNode;

        if (target.id === "mka") {
            return true;
        }
    }

    return false;
}