// principal elt
let mka = document.getElementById("mka");

if (!mka) throw new Error('mka id not found');

// on désactive la selection de text
mka.style.userSelect = "none";

const mkarcmenuId = 'mkarcmenu'

// On désactive le click droit sur l'élément principal
mka.addEventListener('contextmenu', function (event) {
    event.preventDefault();

    let mkaEltSelected = document.getElementsByClassName('mka-elt-selected')
    // Si suelement 1 élément est sélectionné et que il y a des items pour le menu
    if(mkaEltSelected.length === 1 && mkaEltSelected[0].hasAttribute('mka-rc-menu-items')) {

        mka.innerHTML +=
            '<div id="' + mkarcmenuId + '"><ul>' +
            '<li>White</li>' +
            '<li>Green</li>' +
            '<li>Yellow</li>' +
            '<li>Orange</li>' +
            '<li>Red</li>' +
            '<li>Blue</li>' +
            '</ul></div>';

        const menu = JSON.parse(mkaEltSelected[0].getAttribute('mka-rc-menu-items'));
        // console.log('menu', menu);
        menu.forEach(function (item) {
            // console.log('item', item);
        });

        const mkarcmenu = document.getElementById(mkarcmenuId);

        mkarcmenu.style.position = 'absolute';
        mkarcmenu.style.left = event.pageX + 'px';
        mkarcmenu.style.top = event.pageY + 'px';

    }

});

document.body.onmousedown = () => {
    if (document.getElementById(mkarcmenuId)) {
        document.getElementById(mkarcmenuId).remove();
    }
};

let zone = {
    downX: null,
    downY: null,
    upX: null,
    upY: null,
};

let selectItem = (ctrlKey, isClick) => {
    let mkaElts = document.getElementsByClassName("mka-elt");

    let selectedItems = [];

    let isAlreadySelected = false;

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

            // si pour le moment il n'y a pas de eu de déplacement
            if (isClick && elt.classList.contains("mka-elt-selected")) {
                if (ctrlKey) {
                    elt.classList.remove("mka-elt-selected");
                } else {
                    elt.classList.add("mka-elt-selected");
                    selectedItems.push(elt);
                }

                // Le click a eu lieu sur un elt déjà sélectionné on retourn un boulean pour ne pas bind le moove
                isAlreadySelected = true;
            } else {
                elt.classList.add("mka-elt-selected");
                selectedItems.push(elt);
            }
        } else {
             // si la touche ctrl n'est pas appuyée on efface pas
            if (!ctrlKey) {
                elt.classList.remove("mka-elt-selected");
            }

        }
    });

    document.getElementById("mka-count").innerHTML = selectedItems.length;
    return isAlreadySelected;
};

// we add div
let drawSquare = () => {
    let node = document.createElement("div");
    node.id = "selection";
    mka.appendChild(node);
    node.style.position = "absolute";
    node.style.backgroundColor = "red";
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
        // On démarre la sélection si on utilise le bouton gauche de la souris ou le clic droit
        if (event.which === 1 || event.which === 3) {
            // zone du click
            zone.downX = event.pageX;
            zone.downY = event.pageY;

            let node = drawSquare();

            let startLasso = (event, isClick) => {
                zone.upX = event.pageX;
                zone.upY = event.pageY;

                orderCoordinate();
                refreshSquare(node);

                return selectItem(event.ctrlKey, isClick);
            };
            // on lance le lasso car il peut ne pas y avoir de mouve
            let isAlreadySelected = startLasso(event, true);

            // Si le down a lieu sur un elt déjà focus on ne peut pas déclancher le moove
            // On démarre le lasso seulement si on utilise le bouton gauche de la souris
            if (!isAlreadySelected && event.which === 1) {
                document.body.onmousemove = (event) => {
                    startLasso(event, false);
                };
            }
        }
    };

    window.onmouseup = () => {
        // Si on relache le cllic (gauche ou droit)
        if (event.which === 1 || event.which === 3) {
            // on unbind le mousemove
            document.body.onmousemove = () => { };
            // on supprime la selection
            deleteSquare();
        }
    }
}

document.onkeydown = (e) => {
    // On peut utiliser les touches du clavier seulement si le menu du click droit est fermé
    if(!document.getElementById(mkarcmenuId)) {

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
}

activeLasso();



