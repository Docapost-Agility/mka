let parentFunctions = {};
let config = {};
let firstElementIndex = null;

export let init = (conf, publicFunctions) => {
    config = conf;
    config.eltSelectingClass = config.eltSelectingClass || config.eltSelectedClass;
    parentFunctions = publicFunctions;
}

let square = {};
let isInLasso = false;
let canStartLasso = false;
let selecting = [];

export let mkaEvents = {
    onmousedown: (event) => {
        // On démarre la sélection si on utilise le bouton gauche de la souris
        if (event.which === 1) {
            if(!event.shiftKey){
                canStartLasso = true;
                firstElementIndex = null;

                // zone du click
                square.downX = event.pageX + 0;
                square.downY = event.pageY + 0;
                square.upX = event.pageX + 0;
                square.upY = event.pageY + 0;
                orderCoordinate();
            } else {
                let selectableElements = parentFunctions.getSelectablesElements();
                let selection = parentFunctions.getSelection();
                let newSelection = [];

                let element = null;

                selectableElements.forEach(function (elt) {
                    if (elementIsCrossingZone(elt, event.pageX, event.pageY, event.pageX, event.pageY)) {
                        element = elt;
                    }
                });

                if(firstElementIndex === null){
                    firstElementIndex = selectableElements.indexOf(selection[0]);
                }

                if(selection.length > 0){
                    let elementIndex = selectableElements.indexOf(element);

                    for(let i = 0; i < selectableElements.length; i++) {
                        if(i >= elementIndex && i <= firstElementIndex || i <= elementIndex && i >= firstElementIndex){
                            newSelection.push(selectableElements[i]);
                        }
                    }
                } else {
                    newSelection.push(element);
                }

                parentFunctions.updateSelection(newSelection);

            }

            return true;
        }
        return false;
    },
    ondblclick: (event) => {
        isInLasso = false;
        square.delete();
        return false;
    }
};

export let documentEvents = {
    onmousemove: (event) => {
        if (canStartLasso) {
            isInLasso = config.lasso && event.which === 1;
            if (isInLasso) {
                if (!event.ctrlKey && !square.isVisble()) {
                    parentFunctions.updateSelection([]);
                    firstElementIndex = null;
                }
                refreshLasso(event);
                return true;
            } else {
                endLasso();
            }
        }
        return false;
    }
};

export let windowEvents = {
    onmouseup: (event) => {
        if (event.which === 1 && !isInLasso) {
            let element = null;
            Array.from(parentFunctions.getSelectablesElements()).map(elt => {
                if (elementIsCrossingZone(elt, event.pageX, event.pageY, event.pageX, event.pageY)) {
                    element = elt;
                }
            });
            if (!element) {
                parentFunctions.updateSelection([]);
                firstElementIndex = null;
            } else {
                let selection = parentFunctions.getSelection();
                if (selection.length === 0 || !event.ctrlKey) {
                    parentFunctions.updateSelection([element]);
                } else {
                    let newSelection = parentFunctions.getSelection();
                    let index = newSelection.indexOf(element);
                    if (index === -1) {
                        newSelection.push(element);
                    } else {
                        newSelection.splice(index, 1);
                    }
                    parentFunctions.updateSelection(newSelection);
                }
            }
            return true;
        }
        endLasso();
        return false;
    }
};

square = {
    downX: null,
    downY: null,
    upX: null,
    upY: null,
    get: () => {
        let squareId = "selection-square";
        let squareElt = document.getElementById(squareId);
        if (!squareElt) {
            squareElt = document.createElement("div");
            squareElt.id = squareId;
            squareElt.style.position = "absolute";
            squareElt.style.backgroundColor = "rgba(255,0,0,0.5)";
            squareElt.style.border = "1px solid rgba(255,0,0,0.8)";
            squareElt.style.display = "none";
            parentFunctions.getContainer().appendChild(squareElt);
        }
        return squareElt;
    },
    refresh: () => {
        let squareElt = square.get();
        squareElt.style.display = "block";
        squareElt.style.top = square.y1 + "px";
        squareElt.style.left = square.x1 + "px";

        squareElt.style.width = (square.x2 - square.x1) + "px";
        squareElt.style.height = (square.y2 - square.y1) + "px";
    },
    delete: () => {
        square.get().style.display = "none";
    },
    isVisble: () => {
        return square.get().style.display === "block";
    },
    isCrossingElt: (elt) => {
        return elementIsCrossingZone(elt, square.x1, square.y1, square.x2, square.y2);
    }
};

let refreshLasso = (event) => {
    square.upX = event.pageX + 0;
    square.upY = event.pageY + 0;

    orderCoordinate();

    selectLassoItems(event.ctrlKey);
    square.refresh();

};

let endLasso = () => {
    square.delete();
    canStartLasso = false;
    if (isInLasso) {
        isInLasso = false;
        Array.from(selecting).map(elt => {
            elt.classList.remove(config.eltSelectingClass);
        });
        parentFunctions.updateSelection(selecting);
        selecting = [];
    }
}

let orderCoordinate = () => {
    // we order coordinate to simplify
    square.x1 = square.downX;
    square.x2 = square.upX;
    square.y1 = square.downY;
    square.y2 = square.upY;
    // on part vers la gauche
    if (square.downX > square.upX) {
        square.x1 = square.upX;
        square.x2 = square.downX;
    }

    // on part vers le haut
    if (square.downY > square.upY) {
        square.y1 = square.upY;
        square.y2 = square.downY;
    }
}

let selectLassoItems = (ctrlKey) => {
    let mkaElts = parentFunctions.getSelectablesElements();

    selecting = (ctrlKey) ? parentFunctions.getSelection() : [];

    // on parcourt chaque elt pour savoir s'ils sont dans la zone selectionné
    Array.from(mkaElts).map(elt => {
        elt.classList.remove(config.eltSelectingClass);
        if (square.isCrossingElt(elt) && (!ctrlKey || selecting.indexOf(elt) === -1)) {
            selecting.push(elt);
        }
    });
    Array.from(selecting).map(elt => {
        elt.classList.add(config.eltSelectingClass);
    });
}

let elementIsCrossingZone = (elt, x1, y1, x2, y2) => {
    let rect = elt.getBoundingClientRect();
    let zoneElt = {
        x1: elt.offsetLeft,
        x2: (elt.offsetLeft + rect.width),
        y1: elt.offsetTop,
        y2: (elt.offsetTop + rect.height)
    };
    return zoneElt.x2 > x1 && x2 > zoneElt.x1 && zoneElt.y2 > y1 && y2 > zoneElt.y1;
};

