const mkarcmenuId = 'mkarcmenu';

export let init = (conf, parentFunctions) => {
    bindContextMenu(conf, parentFunctions);
}

export let windowEvents = {
    onkeydown: (event) => {
        let code = event.which;
        if ((code == 37 || code == 38 || code == 39 || code == 40) && !!document.getElementById(mkarcmenuId)) {
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
        document.body.appendChild(menu);
    }
    return menu;
}

let bindContextMenu = (conf, parentFunctions) => {

    // On désactive le click droit sur l'élément principal
    parentFunctions.getContainer().addEventListener('contextmenu', (event) => {
        event.preventDefault();
        removeMkaRcMenu();
        const selectableElement = parentFunctions.getSelectableElement(event.target);

        if (selectableElement !== null) {
            // Si l'élément n'est pas sélectionné, on restreint la sélection à ce seul élémentœ
            if (!parentFunctions.elementIsSelected(selectableElement)) {
                parentFunctions.updateSelection([selectableElement]);
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

        menu.style.position = 'absolute';
        menu.style.left = event.pageX + 'px';
        menu.style.top = event.pageY + 'px';
        menu.style.display = 'block';
    });

}
