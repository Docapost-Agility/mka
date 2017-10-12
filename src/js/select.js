const lassoContainerClass = "lasso-container";

let customStyle = document.createElement("style");
customStyle.setAttribute('type', "text/css");
customStyle.innerHTML = "." + lassoContainerClass + "{position:relative;}";
document.head.insertBefore(customStyle, document.head.firstChild);

export let init = (conf, parentFunctions) => {
    parentFunctions.setProperty('focusedElementIndex', null);
    parentFunctions.setProperty('selecting', []);

    if (conf.isMobileDevice) {
        parentFunctions.setProperty('select.startLongPress', null);
        bindMobileDevice(conf, parentFunctions);
    }

    let squareId = "selection-square-" + Math.floor(Math.random() * 100000);

    let square = {
        downX: null,
        downY: null,
        upX: null,
        upY: null,
        get: () => {
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
            square.get().remove();
        },
        isVisble: () => {
            return square.get().style.display === "block";
        },
        isCrossingElt: (elt) => {
            let container = parentFunctions.getContainer();
            let scrollTop = container.scrollTopTotal() - document.body.scrollTopTotal();
            let scrollLeft = container.scrollLeftTotal() - document.body.scrollLeftTotal();
            return elementIsCrossingZone(elt, square.x1 + scrollLeft, square.y1, square.x2 + scrollLeft, square.y2 + scrollTop,parentFunctions);
        }
    };
    parentFunctions.setProperty('square', square);
}

export let mkaEvents = {
    onmousedown: (event, parentFunctions) => {
        // On démarre la sélection si on utilise le bouton gauche de la souris
        if (event.which === 1) {
            if (!event.shiftKey) {
                parentFunctions.setProperty('focusedElementIndex', null);

                let square = parentFunctions.getProperty('square');
                let scrollableContainer = parentFunctions.getScrollableContainer(event.target) || parentFunctions.getContainer();
                
                if (!scrollableContainer.classList.contains(lassoContainerClass)) {
                    scrollableContainer.classList.add(lassoContainerClass);
                }
                
                let left = event.pageX - (scrollableContainer.offsetBodyLeft() - scrollableContainer.scrollLeftTotal() + document.body.scrollLeftTotal());
                let top = event.pageY - (scrollableContainer.offsetBodyTop() - scrollableContainer.scrollTopTotal() + document.body.scrollTopTotal());
                
                // zone du click
                square.downX = +left;
                square.downY = +top;
                square.upX = +left;
                square.upY = +top;
                parentFunctions.setProperty('square', square);

                parentFunctions.setProperty('canStartLasso', true);

                orderCoordinate(square);
            } else {
                let selectableElements = parentFunctions.getSelectablesElements();
                let selection = parentFunctions.getSelection();
                let newSelection = [];

                let element = parentFunctions.getSelectableElement(event.target);

                if (element) {
                    let focusedElementIndex = parentFunctions.getProperty('focusedElementIndex') || selectableElements.indexOf(selection[0]);
                    parentFunctions.setProperty('focusedElementIndex', focusedElementIndex);

                    if (selection.length > 0) {
                        let elementIndex = selectableElements.indexOf(element);
                        let firstIndex = Math.min(focusedElementIndex, elementIndex);
                        let lastIndex = Math.max(focusedElementIndex, elementIndex);
                        if (event.ctrlKey) {
                            selection.forEach(elt => {
                                let eltIndex = selectableElements.indexOf(elt);
                                if (eltIndex < firstIndex) {
                                    firstIndex = eltIndex;
                                }
                                if (eltIndex > lastIndex) {
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
    ondblclick: (event, parentFunctions, conf) => {
        endLasso(parentFunctions, conf);
        return false;
    }
};

export let documentEvents = {
    onmousemove: (event, parentFunctions, conf) => {
        if (parentFunctions.getProperty('canStartLasso')) {
            let isInLasso = conf.lasso && event.which === 1;
            parentFunctions.setProperty('isInLasso', isInLasso);
            if (isInLasso) {
                if (!event.ctrlKey && !parentFunctions.getProperty('square').isVisble()) {
                    parentFunctions.updateSelection([]);
                    parentFunctions.setProperty('focusedElementIndex', null);
                }
                refreshLasso(event, parentFunctions, conf);
                return true;
            } else {
                endLasso(parentFunctions, conf);
            }
        }
        return false;
    }
};

export let windowEvents = {
    onmousedown: (event, parentFunctions, conf) => {
        clearSelecting(parentFunctions, conf);
        if (event.which === 1) {
            if (!event.shiftKey) {
                let selectableElt = parentFunctions.getSelectableElement(event.target);
                if (selectableElt) {
                    let lastSelection = parentFunctions.getSelection();
                    let index = lastSelection.indexOf(selectableElt);
                    let newSelection = [selectableElt];

                    if (event.ctrlKey || (conf.isMobileDevice && index !== -1)) {
                        newSelection = lastSelection;
                        if (index !== -1) {
                            newSelection.splice(index, 1);
                        } else {
                            newSelection.push(selectableElt);
                        }
                    }

                    let selecting = [];
                    newSelection.forEach(elt => {
                        selecting.push(elt);
                        elt.classList.add(conf.eltSelectingClass);
                    });
                    parentFunctions.setProperty('selecting', selecting);

                } else if (!event.ctrlKey) {
                    parentFunctions.updateSelection([]);
                }
            }
        }
        return false;
    },
    onmouseup: (event, parentFunctions, conf) => {
        if (event.which === 1) {
            pushSelectingElements(parentFunctions, conf);
            endLasso(parentFunctions, conf);
        }
        return false;
    }
};

let bindMobileDevice = (conf, parentFunctions) => {
    parentFunctions.getContainer().addEventListener('touchstart', (event) => {
        let dateStart = new Date();
        parentFunctions.setProperty('select.startLongPress', dateStart);
        setTimeout(() => {
            if (parentFunctions.getProperty('select.startLongPress') === dateStart) {
                let selection = parentFunctions.getSelection();
                let eltSelectable = parentFunctions.getSelectableElement(event.target);

                if (eltSelectable) {
                    const indexElt = selection.indexOf(eltSelectable);
                    if (indexElt === -1) {
                        selection.push(eltSelectable);
                    }
                    parentFunctions.updateSelection(selection);
                }
            }
        }, conf.longPressDelay);
    });

    parentFunctions.getContainer().addEventListener('touchend', () => {
        parentFunctions.setProperty('select.startLongPress', null);
    });

    parentFunctions.getContainer().addEventListener('touchmove', () => {
        parentFunctions.setProperty('select.startLongPress', null);
    });
};

let refreshLasso = (event, parentFunctions, conf) => {
    let square = parentFunctions.getProperty('square');
    let scrollableContainer = parentFunctions.getScrollableContainer(event.target) || parentFunctions.getContainer();
    if (!scrollableContainer.classList.contains(lassoContainerClass)) {
        scrollableContainer.classList.add(lassoContainerClass);
    }
    let left = event.pageX - (scrollableContainer.offsetBodyLeft() - scrollableContainer.scrollLeftTotal() + document.body.scrollLeftTotal());
    let top = event.pageY - (scrollableContainer.offsetBodyTop() - scrollableContainer.scrollTopTotal() + document.body.scrollTopTotal());
    
    square.upX = +left;
    square.upY = +top;
    parentFunctions.setProperty('square', square);

    orderCoordinate(square);

    selectLassoItems(event.ctrlKey, square, parentFunctions, conf);
    square.refresh();

};

let endLasso = (parentFunctions, conf) => {
    parentFunctions.getProperty('square').remove();
    parentFunctions.setProperty('canStartLasso', false);

    if (parentFunctions.getProperty('isInLasso')) {
        parentFunctions.setProperty('isInLasso', false);
        pushSelectingElements(parentFunctions, conf);
    }
}

let pushSelectingElements = (parentFunctions, conf) => {
    if (parentFunctions.getProperty('selecting').length) {
        parentFunctions.updateSelection(parentFunctions.getProperty('selecting'));
        clearSelecting(parentFunctions, conf);
    }
}

let clearSelecting = (parentFunctions, conf) => {
    parentFunctions.getProperty('selecting').forEach(elt => {
        elt.classList.remove(conf.eltSelectingClass);
    });
    parentFunctions.setProperty('selecting', []);
}

let orderCoordinate = (square) => {
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

let selectLassoItems = (ctrlKey, square, parentFunctions, conf) => {
    let mkaElts = parentFunctions.getSelectablesElements();

    let selecting = (ctrlKey) ? parentFunctions.getSelection() : [];

    // on parcourt chaque elt pour savoir s'ils sont dans la zone selectionné
    mkaElts.forEach(elt => {
        elt.classList.remove(conf.eltSelectingClass);
        if (square.isCrossingElt(elt) && (!ctrlKey || selecting.indexOf(elt) === -1)) {
            selecting.push(elt);
            elt.classList.add(conf.eltSelectingClass);
        }
    });
    parentFunctions.setProperty('selecting', selecting);
}

let elementIsCrossingZone = (elt, x1, y1, x2, y2,parentFunctions) => {
    let rect = elt.getBoundingClientRect();
    let scrollableContainer = parentFunctions.getScrollableContainer(elt) || parentFunctions.getContainer();
    if (!scrollableContainer.classList.contains(lassoContainerClass)) {
        scrollableContainer.classList.add(lassoContainerClass);
    }
    let zoneElt = {
        x1: elt.offsetBodyLeft() - scrollableContainer.offsetBodyLeft(),
        x2: (elt.offsetBodyLeft() + rect.width - scrollableContainer.offsetBodyLeft()),
        y1: elt.offsetBodyTop() - scrollableContainer.offsetBodyTop(),
        y2: (elt.offsetBodyTop() + rect.height - scrollableContainer.offsetBodyTop())
    };
    return zoneElt.x2 > x1 && x2 > zoneElt.x1 && zoneElt.y2 > y1 && y2 > zoneElt.y1;
};

