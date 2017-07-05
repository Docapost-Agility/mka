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
    if (document.getElementById(mkarcmenuId)) {
        document.getElementById(mkarcmenuId).remove();
        return true;
    }
    return false;
}

let bindContextMenu = () => {

    // On désactive le click droit sur l'élément principal
    parentFunctions.getContainer().addEventListener('contextmenu', (event) => {
        event.preventDefault();
        removeMkaRcMenu();
        const selectableElement = parentFunctions.getSelectableElement(event.target);
        if (selectableElement !== null) {

            if (!parentFunctions.elementIsSelected(selectableElement)) {
                parentFunctions.updateSelection([selectableElement]);
            }

            let selection = parentFunctions.getSelection();

            let contextMenu = config.rightClick(selection);

            let newMenu = document.createElement('ul');

            Array.from(contextMenu).map(item => {
                let li = document.createElement('li');
                li.innerHTML = item.title;
                li.onclick = item.action;
                newMenu.appendChild(li);
            });


            const newDiv = document.createElement('div');
            newDiv.setAttribute('id', mkarcmenuId);
            newDiv.style.position = 'absolute';
            newDiv.style.left = event.pageX + 'px';
            newDiv.style.top = event.pageY + 'px';

            newDiv.appendChild(newMenu);

            parentFunctions.getContainer().appendChild(newDiv);

        }
    });

}
