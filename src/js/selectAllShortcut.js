let mka = document.getElementById("mka");

export let active = () => {
    let isElementFocused = false;

    document.onkeyup = (e) => {

        isElementFocused = setMkaElementFocus(event.target);

        //Si la touche 'Ctrl' est pressée
        if (event.ctrlKey) {
            //Si on appuie sur 'a' ou 'A' que selectAllShortcut = true et que mka est focus
            if ((code === 65 || code === 97) && config.selectAllShortcut && isElementFocused) {
                //Evite que le Ctrl + A sélectionne tous les blocs de la page
                e.preventDefault();

                let mkaElts = document.getElementsByClassName("mka-elt");
                //On applique la classe selected à tous les éléments, de plus chaques éléments devient draggable
                Array.from(mkaElts).map(elt => {
                    elt.classList.add("mka-elt-selected");
                    elt.draggable = true;
                });

                //On inidque le nombre d'éléments sélectionnés
                document.getElementById("mka-count").innerHTML = mkaElts.length;
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