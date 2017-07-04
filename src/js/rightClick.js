let parentFunctions = {};
let config = {};
const mkarcmenuId = 'mkarcmenu';

export let init = (conf, publicFunctions) => {
    config = conf;
    parentFunctions = publicFunctions;

    bindContextMenu();
}

export let windowEvents = {
    onkeydown: (event) => {

    },
    onclick: () => {
        removeMkaRcMenu();
    }
}

let removeMkaRcMenu = () => {
    if (document.getElementById(mkarcmenuId)) {
        document.getElementById(mkarcmenuId).remove();
    }
}

let bindContextMenu = () => {

    // On désactive le click droit sur l'élément principal
    parentFunctions.getContainer().addEventListener('contextmenu', (event) => {
        event.preventDefault();

        const selectableElement = parentFunctions.getSelectableElement(event.target);
        if (selectableElement !== null) {

            if (!parentFunctions.elementIsSelected(selectableElement)) {
                parentFunctions.updateSelection([selectableElement]);
            }

            let mkaEltSelected = parentFunctions.getSelection();
            // Si seulement 1 élément est sélectionné et que il y a des items pour le menu
            if (mkaEltSelected.length === 1 && mkaEltSelected[0].hasAttribute('mka-rc-menu-items')) {

                let newMenu = '<ul>';

                let menuParse = mkaEltSelected[0].getAttribute('mka-rc-menu-items');

                let menu = JSON.parse(menuParse, function (key, value) {
                    if (value
                        && typeof value === "string"
                        && value.substr(0, 8) == "function") {
                        var startBody = value.indexOf('{') + 1;
                        var endBody = value.lastIndexOf('}');
                        var startArgs = value.indexOf('(') + 1;
                        var endArgs = value.indexOf(')');

                        return new Function(value.substring(startArgs, endArgs)
                            , value.substring(startBody, endBody));
                    }
                    return value;
                });

                Array.from(menu).map(item => {
                    newMenu += `<li onclick="${item.action}; anonymous();">${item.title}</li>`;
                });

                newMenu += '</ul>';

                const newDiv = document.createElement('div');
                newDiv.setAttribute('id', mkarcmenuId);
                parentFunctions.getContainer().appendChild(newDiv);
                // Ajout au body d'une div contenant le menu du clic droit
                newDiv.innerHTML = newMenu;

                const mkarcmenu = document.getElementById(mkarcmenuId);

                mkarcmenu.style.position = 'absolute';
                mkarcmenu.style.left = event.pageX + 'px';
                mkarcmenu.style.top = event.pageY + 'px';

                config.focus = "rc";

            }
        }

    });

}
