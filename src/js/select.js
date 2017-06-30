let mka = null;
let zone = {
    downX: null,
    downY: null,
    upX: null,
    upY: null,
};

let hasMoved = false;
let isElementFocused = false;

// we add div
let drawSquare = () => {
    let node = document.createElement("div");
    node.id = "selection";
    mka.appendChild(node);
    node.style.position = "absolute";
    node.style.backgroundColor = "rgba(255,0,0,0.5)";
    node.style.border = "1px solid rgba(255,0,0,0.8)";

    return node;
};
let node = null;

let isClickedElementSelected = (event) => {
    let path = event.path;
    let isElementSelected = false;

    path.forEach(function (block) {
        if (block.classList) {
            let classList = block.classList;

            classList.forEach(function (cssClass) {
                if (cssClass === "mka-elt-selected") {
                    isElementSelected = true;
                }
            });
        }
    });

    return isElementSelected;
}

let startLasso = (event, isClick) => {
    zone.upX = event.pageX + 0;
    zone.upY = event.pageY + 0;

    orderCoordinate();

    isElementFocused = setMkaElementFocus(event.target);

    if (!isClickedElementSelected(event) || isClick) {
        selectItem(event.ctrlKey, isClick);
        refreshSquare(node);
        return false;
    }
    return true;
};

export let active = (mkaElt, config) => {
    mka = mkaElt;

    // on désactive la selection de text
    mka.style.userSelect = "none";
    // Lors de la pression sur la souris on bind l'action de déplacement
    mka.onmousedown = (event) => {
        hasMoved = false;
        // On démarre la sélection si on utilise le bouton gauche de la souris ou le clic droit
        if (event.which === 1 || event.which === 3) {
            // zone du click
            zone.downX = event.pageX + 0;
            zone.downY = event.pageY + 0;

            // Si le down a lieu sur un elt déjà focus on ne peut pas déclancher le moove
            // On démarre le lasso seulement si on utilise le bouton gauche de la souris
            if (!isClickedElementSelected(event) && event.which === 1) {
                node = drawSquare();

                document.body.onmousemove = (event) => {
                    hasMoved = true;
                    startLasso(event, false);
                };
            }
        }
    };

    window.onmouseup = (event) => {
        if (!hasMoved) {
            startLasso(event, true);
        }
        hasMoved = false;
        let mkaElts = document.getElementsByClassName("mka-elt");
        Array.from(mkaElts).map(elt => {
            if (config.dragNdrop) {
                elt.draggable = elt.classList.contains('mka-elt-selected');
            }
        });
        // Si on relache le clic (gauche ou droit)
        if (event.which === 1 || event.which === 3) {
            // on unbind le mousemove
            document.body.onmousemove = () => { };
            // on supprime la selection
            deleteSquare();
        }
    }

    config.actions['mka-suppr'] = (e) => {
        let code = e.which;

        if(code == 46) {
            let selectedArray = document.getElementsByClassName("mka-elt-selected");
            console.log(selectedArray);
        }
    };

    config.actions['mka-arrow'] = (e) => {
        // On peut utiliser les touches du clavier seulement si le menu du click droit est fermé
        // if(!document.getElementById(mkarcmenuId)) {

        let code = e.which;

        if (code == 37 || code == 38 || code == 39 || code == 40) {

            // on recupere le dernier elt selectionné dans le DOM
            let selectedArray = document.getElementsByClassName("mka-elt-selected");
            let last = selectedArray[selectedArray.length - 1];

            // si la touche ctrl n'est pas appuyée on efface pas
            if (!event.ctrlKey) {
                // on clean les éléments déjà sélectionné
                let mkaElts = document.getElementsByClassName("mka-elt");
                Array.from(mkaElts).map(elt => { elt.classList.remove("mka-elt-selected") });
            }


            if (!!last) {
                switch (e.which) {
                    case 37: // left
                        console.log("left");
                        break;

                    case 38: // up
                        console.log("up");
                        let prev = last.previousElementSibling;
                        if (!!prev) {
                            prev.classList.add("mka-elt-selected");
                            prev.draggable = true;
                        }
                        break;
                    case 39: // right
                        console.log("right");
                        break;

                    case 40: // down
                        let next = last.nextElementSibling;
                        if (!!next) {
                            next.classList.add("mka-elt-selected");
                            next.draggable = true;
                        }
                        break;

                    default: return; // exit this handler for other keys
                }
            }
        }

        //Si la touche 'Ctrl' est pressée
        if (event.ctrlKey){
            //Si on appuie sur 'a' ou 'A' que selectAllShortcut = true et que mka est focus
            if((code === 65 || code === 97) && config.selectAllShortcut && isElementFocused) {
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

        // }
    };

    mka.onclick = () => {
        config.focus = "mka";
    }
}


let selectItem = (ctrlKey, isClick) => {
    let mkaElts = document.getElementsByClassName("mka-elt");

    let isAlreadySelected = false;

    let countselectedItems;

    // on parcourt chaque elt pour savoir s'ils sont dans la zone selectionné
    Array.from(mkaElts).map(elt => {
        let rect = elt.getBoundingClientRect();
        let zoneElt = {
            x1: elt.offsetLeft,
            x2: (elt.offsetLeft + rect.width),
            y1: elt.offsetTop,
            y2: (elt.offsetTop + rect.height)
        }

        // Permet de savoir si la zone de l'elt croise la zone de selection 
        if (zone.x2 >= zoneElt.x1 && zoneElt.x2 >= zone.x1 && zone.y2 >= zoneElt.y1 && zoneElt.y2 >= zone.y1) {

            // si pour le moment il n'y a pas de eu de déplacement
            if (isClick && elt.classList.contains("mka-elt-selected")) {
                if (ctrlKey) {
                    elt.classList.remove("mka-elt-selected");
                } else {
                    elt.classList.add("mka-elt-selected");
                }

                // Le click a eu lieu sur un elt déjà sélectionné on retourn un boulean pour ne pas bind le moove
                isAlreadySelected = true;
            } else {
                elt.classList.add("mka-elt-selected");
            }
        } else {
            // si la touche ctrl n'est pas appuyée on efface pas
            if (!ctrlKey) {
                elt.classList.remove("mka-elt-selected");
            }

        }
    });

    countselectedItems=document.getElementById("mka").getElementsByClassName("mka-elt-selected").length;

    document.getElementById("mka-count").innerHTML = countselectedItems;
    return isAlreadySelected;
};

let deleteSquare = () => {
    console.log("delete");
    let node = document.getElementById("selection");
    if (!!node) {
        mka.removeChild(node);
    }
}

let orderCoordinate = () => {
    // we order coordinate to simplify
    zone.x1 = zone.downX;
    zone.x2 = zone.upX;
    zone.y1 = zone.downY;
    zone.y2 = zone.upY;
    // on part vers la gauche
    if (zone.downX > zone.upX) {
        zone.x1 = zone.upX;
        zone.x2 = zone.downX;
    }

    // on part vers le haut
    if (zone.downY > zone.upY) {
        zone.y1 = zone.upY;
        zone.y2 = zone.downY;
    }
}

let refreshSquare = (node) => {
    node.style.top = zone.y1 + "px";
    node.style.left = zone.x1 + "px";

    node.style.width = (zone.x2 - zone.x1) + "px";
    node.style.height = (zone.y2 - zone.y1) + "px";
}

//Fonction récursive qui retourne true ou false si l'id de l'élément ou d'un de ses parents est valide
let setMkaElementFocus = (target) => {
    //Si la target possède la bonne id > return true
    if(target.id === "mka"){
        return true;
    }

    //Tant qu'il y a des éléments parents on cherche l'id souhaitée
    while(target.parentNode){
        target = target.parentNode;

        if(target.id === "mka"){
            return true;
        }
    }

    return false;
}
