const mkarcmenuId = 'mkarcmenu';
const menuContainerClass = "menu-container";

let customStyle = document.createElement("style");
customStyle.setAttribute('type', "text/css");
customStyle.innerHTML = "." + menuContainerClass + "{position:relative;}";
document.head.insertBefore(customStyle, document.head.firstChild);

export let init = (conf, parentFunctions) => {
    bindContextMenu(conf, parentFunctions);

    if (conf.isMobileDevice) {
        parentFunctions.setProperty('rightClick.startContextMenu', false);
        bindMobileDevice(conf, parentFunctions);
    }
}

export let windowEvents = {
    onkeydown: (event) => {
        let code = event.which;
        if ((code == 37 || code == 38 || code == 39 || code == 40) && menuIsOpen()) {
            event.preventDefault();
            return true;
        }
        return false;
    },
    onclick: (event) => {
        if (event.which === 1) {
            return removeMkaRcMenu();
        }
        return false;
    }
}

let menuIsOpen = () => {
    return !!document.getElementById(mkarcmenuId) && document.getElementById(mkarcmenuId).style.display !== 'none';
}

let removeMkaRcMenu = () => {
    const menu = document.getElementById(mkarcmenuId);
    if (menu && menu.style.display !== 'none') {
        menu.style.display = 'none';
        return true;
    }
    return false;
}

let getMkaRcMenu = () => {
    let menu = document.getElementById(mkarcmenuId);
    if (!menu) {
        menu = document.createElement('div');
        menu.setAttribute('id', mkarcmenuId);
    }
    return menu;
}

let setMenuPosition = (menu, event, parentFunctions) => {
    
    let parentElement = parentFunctions.getScrollableContainer(event.target);
    
    if (!parentElement) {
        parentElement = parentFunctions.getContainer();
    }

    if (!parentElement.classList.contains(menuContainerClass)) {
        parentElement.classList.add(menuContainerClass);
    }

    let left = event.pageX - (parentElement.offsetBodyLeft() - parentElement.scrollLeftTotal() + document.body.scrollLeft);
    let top = event.pageY - (parentElement.offsetBodyTop() - parentElement.scrollTopTotal() + document.body.scrollTop);

    let parentWidth = parentElement.offsetWidth;
    let parentHeight = parentElement.offsetHeight;

    if (left < 3 * parentWidth / 4) {
        menu.style.left = left + 'px';
        menu.style.right = "auto";
    } else {
        menu.style.right = (parentWidth - left) + 'px';
        menu.style.left = "auto";
    }

    if (top < 3 * parentHeight / 4) {
        menu.style.top = top + 'px';
        menu.style.bottom = "auto";
    } else {
        menu.style.bottom = (parentHeight - top) + 'px';
        menu.style.top = "auto";
    }

    menu.style.position = 'absolute';
    menu.style.display = 'block';
    menu.style.zIndex = '20000';

    parentElement.appendChild(menu);
}

let bindContextMenu = (conf, parentFunctions) => {

    // On désactive le click droit sur l'élément principal
    parentFunctions.getContainer().addEventListener('contextmenu', (event) => {
        event.preventDefault();
        if (!parentFunctions.getProperty('rightClick.startContextMenu') && conf.isMobileDevice) {
            return false;
        }

        removeMkaRcMenu();
        const selectableElement = parentFunctions.getSelectableElement(event.target);

        if (selectableElement !== null) {
            if (!parentFunctions.elementIsSelected(selectableElement)) {
                if (conf.isMobileDevice) {
                    return false;
                } else {
                    // Si l'élément n'est pas sélectionné, on restreint la sélection à ce seul élémentœ
                    parentFunctions.updateSelection([selectableElement]);
                }
            }
        } else {
            parentFunctions.updateSelection([]);
        }

        let selection = parentFunctions.getSelection();

        let menu = getMkaRcMenu();
        let htmlMenu = conf.rightClick(selection);

        if (htmlMenu instanceof HTMLElement) {
            menu.innerHTML = '';
            menu.appendChild(htmlMenu);
        } else {
            menu.innerHTML = htmlMenu;
        }

        setMenuPosition(menu, event, parentFunctions);
    });

}

let bindMobileDevice = (conf, parentFunctions) => {
    parentFunctions.getContainer().addEventListener('touchstart', (event) => {
        parentFunctions.setProperty('rightClick.startContextMenu', parentFunctions.elementIsSelected(event.target));

        if (!parentFunctions.elementIsSelected(event.target)) {
            removeMkaRcMenu();
        }

    });

    parentFunctions.getContainer().addEventListener('touchend', () => {
        parentFunctions.setProperty('rightClick.startContextMenu', true);
    });
}
