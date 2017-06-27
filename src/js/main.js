import * as dndHandler from './modules/DragAndDrop';
// principal elt
const mka = document.getElementById("mka");
let mkaSelectedElts = mka.getElementsByClassName("mka-elt-selected");

let longTouch, touchTimeout;

if (!mka){
    throw new Error('mka id not found');
}

// on désactive la selection de text
mka.style.userSelect = "none";

// On désactive le click droit sur l'élément principal
mka.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

let zone = {
    downX: null,
    downY: null,
    upX: null,
    upY: null,
};

let selectItem = (ctrlKey) => {
    let mkaElts = document.getElementsByClassName("mka-elt");

    let selectedItems = [];
    // on parcours chaque elt pour savoir s'ils sont dans la zone selectionné
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
            elt.classList.add("mka-elt-selected");
            selectedItems.push(elt);
        } else {
            if (!ctrlKey) {
                elt.classList.remove("mka-elt-selected");
            }
        }
    });

    document.getElementById("mka-count").innerHTML = mkaSelectedElts.length;
};

let unselectItems = () => {
    //Pour chaque element du tableau, on vire la classe CSS de séléction d'item
    Array.from(mkaSelectedElts).map(elt => { elt.classList.remove("mka-elt-selected") });
    document.getElementById("mka-count").innerHTML = mkaSelectedElts.length;
};

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

let deleteSquare = () => {
    if(document.getElementById("selection")){
        const node = document.getElementById("selection");
        mka.removeChild(node);
    } else {
        unselectItems();
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

let isClickedElementSelected = (event) => {
    let path = event.path;
    let isElementSelected = false;

    path.forEach(function(block) {
        if(block.classList){
            let classList = block.classList;

            classList.forEach(function (cssClass) {
                if(cssClass === "mka-elt-selected"){
                    isElementSelected = true;
                }
            });
        }
    });

    return isElementSelected;
}

let activeLasso = () => {
    // Lors de la pression sur la souris on bind l'action de déplacement
    mka.onmousedown = (event) => {
        let isElementSelected = isClickedElementSelected(event);

        touchTimeout = setTimeout(function() {
            longTouch = true;
        }, 200);

        // On démarre la sélection seulement si on utilise le bouton gauche de la souris
        if (event.which === 1) {
            // zone du click
            zone.downX = event.pageX;
            zone.downY = event.pageY;

            // si la touche ctrl n'est pas appuyée on efface pas
            if (!event.ctrlKey) {
                // on clean les éléments déjà sélectionné
                let mkaElts = document.getElementsByClassName("mka-elt");
                Array.from(mkaElts).map(elt => {
                    elt.classList.remove("mka-elt-selected")
                });
            }


            let node = drawSquare();

            let startLasso = (event) => {
                if(!isElementSelected){
                    zone.upX = event.pageX;
                    zone.upY = event.pageY;

                    orderCoordinate();
                    refreshSquare(node);
                }
                selectItem(event.ctrlKey);

            };
            // on lance le lasso car il peut ne pas y avoir de mouve
            startLasso(event);

            document.body.onmousemove = (event) => {
                startLasso(event);
            };
        }
    };

    // lorsqu'on relache le clic
    window.onmouseup = () => {
        // Si on relache le bouton gauche de la souris
        if (event.which === 1) {

            //On repasse le longTouch à false et on réinit le touchTimeout
            longTouch = false;
            clearTimeout(touchTimeout);

            // on unbind le mousemove
            document.body.onmousemove = () => { };
            // on supprime la selection
            deleteSquare();
        }
    }
}

document.onkeydown = (e) => {
    let code = e.which;
    if (code == 37 || code == 38 || code == 39 || code == 40) {

        // on recupere le dernier elt selectionné dans le DOM
        let selectedArray = document.getElementsByClassName("mka-elt-selected");
        let last = selectedArray[selectedArray.length - 1];

        // si la touche ctrl n'est pas appuyée on efface pas
        if (!event.ctrlKey) {
            // on clean les éléments déjà sélectionné
            const mkaElts = document.getElementsByClassName("mka-elt");
            Array.from(mkaElts).map(elt => { elt.classList.remove("mka-elt-selected") });
        }


        switch (e.which) {
            case 37: // left
                break;

            case 38: // up
                last.previousElementSibling.classList.add("mka-elt-selected");
                break;
            case 39: // right
                break;

            case 40: // down
                last.nextElementSibling.classList.add("mka-elt-selected");
                break;

            default: return; // exit this handler for other keys
        }
    }



}

let elements = document.querySelectorAll('.mka-elt');
let droppers = document.querySelectorAll('.mka-dropzone');

//Application du drag event pour chaque element ayant la classe mka-elt
Array.from(elements).every(elt => dndHandler.applyDragEvents(elt, mkaSelectedElts));

//Application du drop event pour chaque element ayant la classe mka-dropzone
Array.from(droppers).map(elt => dndHandler.applyDropEvents(elt, mkaSelectedElts));

activeLasso();