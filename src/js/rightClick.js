export let active = (mka, config) => {
    config.actions["rc-arrow"] = onkeydown;
    const mkarcmenuId = 'mkarcmenu'
    // On désactive le click droit sur l'élément principal
    mka.addEventListener('contextmenu', (event) => {
        event.preventDefault();

        let mkaEltSelected = document.getElementsByClassName('mka-elt-selected')
        // Si seulement 1 élément est sélectionné et que il y a des items pour le menu
        if (mkaEltSelected.length === 1 && mkaEltSelected[0].hasAttribute('mka-rc-menu-items')) {

            let newMenu = `<div id="${mkarcmenuId}"><ul>`;

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

            menu.forEach(function (item) {
                newMenu += `<li onclick="${item.action}; anonymous();">${item.title}</li>`;
            });

            newMenu += '</ul></div>';

            document.body.innerHTML += newMenu;

            const mkarcmenu = document.getElementById(mkarcmenuId);

            mkarcmenu.style.position = 'absolute';
            mkarcmenu.style.left = event.pageX + 'px';
            mkarcmenu.style.top = event.pageY + 'px';

            config.focus = "rc";

        }
    });

    window.onclick = () => {
        if (document.getElementById(mkarcmenuId)) {
            document.getElementById(mkarcmenuId).remove();
        }
    };
}

let onkeydown = (e) => {
    console.log(e);
}


