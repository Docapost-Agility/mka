export let active = (mka, config) => {
    config.actions["rc-arrow"] = onkeydown;
    const mkarcmenuId = 'mkarcmenu'
    // On désactive le click droit sur l'élément principal
    mka.addEventListener('contextmenu', (event) => {
        event.preventDefault();

        let mkaEltSelected = document.getElementsByClassName('mka-elt-selected')
        // Si suelement 1 élément est sélectionné et que il y a des items pour le menu
        if (mkaEltSelected.length === 1 && mkaEltSelected[0].hasAttribute('mka-rc-menu-items')) {

            let newMenu = `<div id="${mkarcmenuId}"><ul>`;

            const menu = JSON.parse(mkaEltSelected[0].getAttribute('mka-rc-menu-items'));
            menu.forEach(function (item) {
                newMenu += '<li>' + item.title + '</li>';
            });

            newMenu += '</ul></div>';

            mka.innerHTML += newMenu;

            const mkarcmenu = document.getElementById(mkarcmenuId);

            mkarcmenu.style.position = 'absolute';
            mkarcmenu.style.left = event.pageX + 'px';
            mkarcmenu.style.top = event.pageY + 'px';

            config.focus = "rc";

        }
    });

    document.body.onmousedown = () => {
        if (document.getElementById(mkarcmenuId)) {
            document.getElementById(mkarcmenuId).remove();
        }
    };


}

let onkeydown = (e) => {
    console.log(e);
}


