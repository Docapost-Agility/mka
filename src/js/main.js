// principal elt
let mka = document.getElementById("mka");

if (!mka) throw new Error('mka id not found');

// on désactive la selection de text
mka.style.userSelect = "none";

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
        // console.log(rect);
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

    document.getElementById("mka-count").innerHTML = selectedItems.length;
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
    let node = document.getElementById("selection");
    mka.removeChild(node);
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

let activeLasso = () => {
    // Lors de la pression sur la souris on bind l'action de déplacement
    mka.onmousedown = (event) => {
        // zone du click 
        zone.downX = event.pageX;
        zone.downY = event.pageY;

        // si la touche ctrl n'est pas appuyée on efface pas
        if (!event.ctrlKey) {
            // on clean les éléments déjà sélectionné
            let mkaElts = document.getElementsByClassName("mka-elt");
            Array.from(mkaElts).map(elt => { elt.classList.remove("mka-elt-selected") });
        }


        let node = drawSquare();

        let startLasso = (event) => {
            zone.upX = event.pageX;
            zone.upY = event.pageY;

            orderCoordinate();
            refreshSquare(node);
            selectItem(event.ctrlKey);
        };
        // on lance le lasso car il peut ne pas y avoir de mouve
        startLasso(event);

        document.body.onmousemove = (event) => {
            startLasso(event);
        };
    };

    // lorsqu'on relache le clic
    window.onmouseup = () => {
        // on unbind le mousemove
        document.body.onmousemove = () => { };
        // on supprime la selection
        deleteSquare();
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
            let mkaElts = document.getElementsByClassName("mka-elt");
            Array.from(mkaElts).map(elt => { elt.classList.remove("mka-elt-selected") });
        }


        switch (e.which) {
            case 37: // left
                console.log("left");
                break;

            case 38: // up
                console.log("up");
                last.previousElementSibling.classList.add("mka-elt-selected");
                break;
            case 39: // right
                console.log("right");
                break;

            case 40: // down
                last.nextElementSibling.classList.add("mka-elt-selected");
                break;

            default: return; // exit this handler for other keys
        }
    }



}

activeLasso();