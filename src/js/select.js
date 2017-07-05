let parentFunctions = {};
let config = {};
let focusedElementIndex = null;

export let init = (conf, publicFunctions) => {
    config = conf;
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
                if (!event.shiftKey) {
                    focusedElementIndex = null;

                    // zone du click
                    square.downX = event.pageX + 0;
                    square.downY = event.pageY + 0;
                    square.upX = event.pageX + 0;
                    square.upY = event.pageY + 0;

                    canStartLasso = true;

                    orderCoordinate();
                } else {
                    let selectableElements = parentFunctions.getSelectablesElements();
                    let selection = parentFunctions.getSelection();
                    let newSelection = [];

                    let element = parentFunctions.getSelectableElement(event.target);

                    if (element) {
                        focusedElementIndex = focusedElementIndex || selectableElements.indexOf(selection[0]);

                        if (selection.length > 0) {
                            let elementIndex = selectableElements.indexOf(element);
                            let firstIndex = Math.min(focusedElementIndex,elementIndex);
                            let lastIndex = Math.max(focusedElementIndex,elementIndex);
                            if(event.ctrlKey) {
                                Array.from(selection).map(elt => {
                                    let eltIndex = selectableElements.indexOf(elt);
                                    if(eltIndex < firstIndex) {
                                        firstIndex = eltIndex;
                                    }
                                    if(eltIndex > lastIndex) {
                                        lastIndex = eltIndex;
                                    }
                                });
                            }

                            for (let i = firstIndex; i <= lastIndex; i++) {
                                    newSelection.push(selectableElements[i]);
                            }
                        } else {
                            newSelection.push(element);
                        }

                        parentFunctions.updateSelection(newSelection);
                    }
                }

                return true;
            }
            return false;
        },
        ondblclick: () => {
            endLasso();
            return false;
        }
    }
    ;

export let documentEvents = {
    onmousemove: (event) => {
        if (canStartLasso) {
            isInLasso = config.lasso && event.which === 1;
            if (isInLasso) {
                if (!event.ctrlKey && !square.isVisble()) {
                    parentFunctions.updateSelection([]);
                    focusedElementIndex = null;
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
    onclick: () => {
        endLasso();
        return false;
    },
    onmousedown: (event) => {
        clearSelecting();
        if (event.which === 1) {
            if (!event.shiftKey) {
                let selectableElt = parentFunctions.getSelectableElement(event.target);
                if (selectableElt) {
                    let lastSelection = parentFunctions.getSelection();
                    let index = lastSelection.indexOf(selectableElt);
                    let newSelection = [selectableElt];

                    if (event.ctrlKey) {
                        newSelection = lastSelection;
                        if (index !== -1) {
                            newSelection.splice(index, 1);
                        } else {
                            newSelection.push(selectableElt);
                        }
                    }

                    if (index !== -1) {
                        Array.from(newSelection).map(elt => {
                            selecting.push(elt);
                            elt.classList.add(config.eltSelectingClass);
                        });
                    } else {
                        parentFunctions.updateSelection(newSelection);
                    }

                } else if (!event.ctrlKey) {
                    parentFunctions.updateSelection([]);
                }
            }
        }
    },
    onmouseup: (event) => {
        if (event.which === 1) {
            pushSelectingElements();
        }
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
    remove: () => {
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
    square.remove();
    canStartLasso = false;
    if (isInLasso) {
        isInLasso = false;
        pushSelectingElements();
    }
}

let pushSelectingElements = () => {
    if (selecting.length) {
        parentFunctions.updateSelection(selecting);
        clearSelecting();
    }
}

let clearSelecting = () => {
    Array.from(selecting).map(elt => {
        elt.classList.remove(config.eltSelectingClass);
    });
    selecting = [];
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
            elt.classList.add(config.eltSelectingClass);
        }
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

