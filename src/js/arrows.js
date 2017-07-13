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
                    let scrollableContainer = null;
                    let currentElt = elt
                    while (!!currentElt.parentNode && !scrollableContainer) {
                        currentElt = currentElt.parentNode;
                        if (currentElt.scrollHeight > currentElt.offsetHeight || currentElt.scrollWidth > currentElt.offsetWidth || currentElt === document.body) {
                            scrollableContainer = currentElt;
                        }
                    }
                    if (scrollableContainer) {
                        if (scrollableContainer === document.body) {
                            let scrollY = elt.offsetBodyTop() - scrollableContainer.offsetBodyTop() + (elt.offsetHeight - window.innerHeight) / 2;
                            let scrollX = elt.offsetBodyLeft() - scrollableContainer.offsetBodyLeft() + (elt.offsetWidth - window.innerWidth) / 2;
                            window.scrollTo(scrollX, scrollY);
                        } else {
                            let scrollY = elt.offsetBodyTop() - scrollableContainer.offsetBodyTop() + (elt.offsetHeight - scrollableContainer.offsetHeight) / 2;
                            let scrollX = elt.offsetBodyLeft() - scrollableContainer.offsetBodyLeft() + (elt.offsetHeight - window.innerHeight) / 2;
                            scrollableContainer.scrollTop = scrollY;
                            scrollableContainer.scrollLeft = scrollX;
                        }
                        centerScroll(scrollableContainer);
                    } else {
                        return false;
                    }
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
    let selectablesElements = parentFunctions.getSelectablesElements();
    let indexElt = selectablesElements.indexOf(fromElement);
    if (indexElt === -1) {
        return null;
    } else if (code === 37) {
        //left
        return (selectablesElements[indexElt - 1]) ? selectablesElements[indexElt - 1] : null;
    } else if (code === 39) {
        //right
        return (selectablesElements[indexElt + 1]) ? selectablesElements[indexElt + 1] : null;
    }

    let interval = 10;
    let rect = fromElement.getBoundingClientRect();
    let posX = fromElement.offsetBodyLeft() + rect.width / 2 - fromElement.scrollLeftTotal();
    let posY = fromElement.offsetBodyTop() + ((code === 40) ? rect.height : 0);
    let updateY = (code === 40) ? interval : -interval;

    posY = posY + updateY - fromElement.scrollTopTotal();

    let getNextElement = () => {
        let target = document.elementFromPoint(posX, posY);
        let selectableElement = parentFunctions.getSelectableElement(target);
        if (!selectableElement) {
            if (parentFunctions.isMkaContainerFocused(target)) {
                posY = posY + updateY;
                return getNextElement();
            } else {
                return null;
            }
        }
        return selectableElement;
    }
    let nextElement = getNextElement();
    return nextElement;
}
