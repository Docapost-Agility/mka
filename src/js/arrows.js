export let init = (conf, parentFunctions) => {
    parentFunctions.setProperty('arrows.currentFocus', null);
    parentFunctions.setProperty('arrows.isContainerFocused', false);
}

export let onSelectionUpdate = (params) => {
    let selection = params.selection;
    let parentFunctions = params.parentFunctions;
    if (selection && parentFunctions) {
        if (selection.length > 0) {
            parentFunctions.setProperty('arrows.lastSelected', selection[selection.length - 1]);
            if (selection.length === 1) {
                parentFunctions.setProperty('arrows.currentFocus', selection[0]);
            } else if (params.actionId !== 'arrows.shift') {
                parentFunctions.setProperty('arrows.currentFocus', null);
            }
        } else {
            parentFunctions.setProperty('arrows.lastSelected', null);
            parentFunctions.setProperty('arrows.currentFocus', null);
        }
    }
}

export let windowEvents = {
    onmousedown: (e, parentFunctions) => {
        parentFunctions.setProperty('arrows.isContainerFocused', parentFunctions.isMkaContainerFocused(e.target));
        return false;
    },
    onkeydown: (event, parentFunctions) => {
        let code = event.which;
        //37=left , 38=top , 39=right , 40=bottom
        if (code == 37 || code == 38 || code == 39 || code == 40) {
            let lastSelected = parentFunctions.getProperty('arrows.lastSelected');

            if (!lastSelected) {
                if (parentFunctions.getProperty('arrows.isContainerFocused')) {
                    let firstElement = parentFunctions.getSelectablesElements()[0];
                    if (firstElement) {
                        parentFunctions.updateSelection([firstElement]);
                    }
                }
            } else {
                event.preventDefault();
                let centerScroll = (elt) => {
                    let scrollX = (elt.offsetBodyLeft() + elt.offsetWidth / 2) - (window.scrollX + window.innerWidth / 2);
                    let scrollY = (elt.offsetBodyTop() + elt.offsetHeight / 2) - (window.scrollY + window.innerHeight / 2);
                    window.scrollBy(scrollX, scrollY);
                }
                centerScroll(lastSelected);

                let nextElement = calculateNextElement(lastSelected, code, parentFunctions);

                if (!!nextElement) {
                    let newSelection = [];

                    if (event.shiftKey && parentFunctions.getProperty('arrows.currentFocus')) {
                        newSelection = parentFunctions.getSelection();
                        let index = newSelection.indexOf(nextElement);
                        if (code == 37 || code == 39) {
                            if (index === -1) {
                                newSelection.push(nextElement);
                            } else {
                                newSelection.splice(newSelection.length - 1, 1);
                            }
                        } else {
                            let newElements = [];
                            let searchNextElement = lastSelected;
                            while (searchNextElement && searchNextElement !== nextElement) {
                                searchNextElement = calculateNextElement(searchNextElement, (code == 38) ? 37 : 39, parentFunctions);
                                if (searchNextElement) {
                                    newElements.push(searchNextElement);
                                }
                            }
                            if (index === -1) {
                                newSelection = newSelection.concat(newElements);
                            } else {
                                newSelection.splice(index + 1);
                            }

                        }
                        parentFunctions.updateSelection(newSelection, 'arrows.shift');
                    } else {
                        newSelection = [nextElement];
                        parentFunctions.updateSelection(newSelection);
                    }

                    centerScroll(nextElement);
                    return true;
                }
            }
        }
        return false;
    }
};

let calculateNextElement = (fromElement, code, parentFunctions) => {
    let interval = 10;
    let rect = fromElement.getBoundingClientRect();
    let posX = 0;
    let posY = 0;
    let updateX = 0;
    let updateY = 0;
    // let updateLine = 0;

    switch (code) {
        //left
        case 37 :
            posX = fromElement.offsetBodyLeft();
            posY = fromElement.offsetBodyTop() + rect.height / 2;
            updateX = -interval;
            break;
        //up
        case 38 :
            posX = fromElement.offsetBodyLeft() + rect.width / 2;
            posY = fromElement.offsetBodyTop();
            updateY = -interval;
            break;
        //right
        case 39 :
            posX = fromElement.offsetBodyLeft() + rect.width;
            posY = fromElement.offsetBodyTop() + rect.height / 2;
            updateX = interval;
            break;
        //down
        case 40 :
            posX = fromElement.offsetBodyLeft() + rect.width / 2;
            posY = fromElement.offsetBodyTop() + rect.height;
            updateY = interval;
            break;
    }

    posX = posX + updateX;
    posY = posY + updateY - window.scrollY;
    let lineChanged = false;
    let container = parentFunctions.getContainer();

    let isSameLineThanOrigin = (elt) => {
        let eltCenterY = elt.offsetBodyTop() + elt.getBoundingClientRect().height / 2;
        if (code === 37) {
            return eltCenterY >= fromElement.offsetBodyTop();
        } else if (code === 39) {
            return eltCenterY <= fromElement.offsetBodyTop() + rect.height;
        }
    }


    let getNextElement = (isNewLine) => {
        lineChanged = lineChanged || isNewLine;
        let target = document.elementFromPoint(posX, posY);
        let selectableElement = parentFunctions.getSelectableElement(target);
        if (!selectableElement || lineChanged && isSameLineThanOrigin(selectableElement)) {
            if (parentFunctions.isMkaContainerFocused(target)) {
                posX = posX + updateX;
                posY = posY + updateY;
                return getNextElement();
            } else {
                if (code === 38 || code === 40 || isNewLine) {
                    return null;
                } else {
                    if (code === 37) {
                        posY = (!lineChanged) ? fromElement.offsetBodyTop() - interval - window.scrollY : posY - interval;
                        posX = container.offsetBodyLeft() + container.getBoundingClientRect().width - interval;
                    } else {
                        posY = (!lineChanged) ? fromElement.offsetBodyTop() + rect.height + interval - window.scrollY : posY + interval;
                        posX = container.offsetBodyLeft() + interval;
                    }
                    return getNextElement(true);
                }
            }
        }
        return selectableElement;
    }
    let nextElement = getNextElement();
    return nextElement;
}
