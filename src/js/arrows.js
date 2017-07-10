let parentFunctions = {};
let config = {};

export let init = (conf, publicFunctions) => {
    config = conf;
    parentFunctions = publicFunctions;
}

let currentFocus = null;

export let windowEvents = {
    onkeydown: (event) => {
        let code = event.which;
        if (code == 37 || code == 38 || code == 39 || code == 40) {
            let lastSelectedInDom = parentFunctions.getLastSelectedInDom();
            //currentFocus = event.shiftKey && (currentFocus || lastInDom) || null;

            if (!!lastSelectedInDom) {

                let centerScroll = (elt) => {
                    let scrollX = (elt.offsetBodyLeft() + elt.offsetWidth / 2) - (window.scrollX + window.innerWidth / 2);
                    let scrollY = (elt.offsetBodyTop() + elt.offsetHeight / 2) - (window.scrollY + window.innerHeight / 2);
                    window.scrollBy(scrollX, scrollY);
                }
                centerScroll(lastSelectedInDom);

                let interval = 10;
                let rect = lastSelectedInDom.getBoundingClientRect();
                let posX = 0;
                let posY = 0;
                let updateX = 0;
                let updateY = 0;
                // let updateLine = 0;

                switch (code) {
                    //left
                    case 37 :
                        posX = lastSelectedInDom.offsetBodyLeft();
                        posY = lastSelectedInDom.offsetBodyTop() + rect.height / 2;
                        updateX = -interval;
                        break;
                    //up
                    case 38 :
                        posX = lastSelectedInDom.offsetBodyLeft() + rect.width / 2;
                        posY = lastSelectedInDom.offsetBodyTop();
                        updateY = -interval;
                        break;
                    //right
                    case 39 :
                        posX = lastSelectedInDom.offsetBodyLeft() + rect.width;
                        posY = lastSelectedInDom.offsetBodyTop() + rect.height / 2;
                        updateX = interval;
                        break;
                    //down
                    case 40 :
                        posX = lastSelectedInDom.offsetBodyLeft() + rect.width / 2;
                        posY = lastSelectedInDom.offsetBodyTop() + rect.height;
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
                        return eltCenterY >= lastSelectedInDom.offsetBodyTop();
                    } else if (code === 39) {
                        return eltCenterY <= lastSelectedInDom.offsetBodyTop() + rect.height;
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
                                    posY = (!lineChanged) ? lastSelectedInDom.offsetBodyTop() - interval - window.scrollY : posY - interval;
                                    posX = container.offsetBodyLeft() + container.getBoundingClientRect().width - interval;
                                } else {
                                    posY = (!lineChanged) ? lastSelectedInDom.offsetBodyTop() + rect.height + interval - window.scrollY : posY + interval;
                                    posX = container.offsetBodyLeft() + interval;
                                }
                                return getNextElement(true);
                            }
                        }
                    }
                    return selectableElement;
                }
                let nextElement = getNextElement();

                event.preventDefault();
                if (!!nextElement) {
                    centerScroll(nextElement);
                    parentFunctions.updateSelection([nextElement]);
                    return true;
                }
            }
        }
        return false;
    }
};
