export let bindDragEvents = (element) => {
    // element.draggable = true;

    // element.addEventListener('dragstart', function (e) {
    //     console.log("ici");
    //     // let multipleDragContainer = this.cloneNode(true);

    //     // if (selection.length > 1) {

    //     //     multipleDragContainer = getDraggedContainerStyle(multipleDragContainer);

    //     //     document.body.appendChild(multipleDragContainer);
    //     //     e.dataTransfer.setDragImage(multipleDragContainer, 0, 0);
    //     // }

    //     // e.dataTransfer.setData('text/plain', ''); // Nécessaire pour Firefox

    //     // element.classList.add("on-drag");
    // });
    // element.addEventListener('dragend', function (e) {
    //     element.classList.remove("on-drag");
    // });

    // element.addEventListener('drop', function (e) {

    //     console.log(element);
    //     element.style.display = "none";
    //     console.log(element);
    //     element.classList.remove("on-drag");
    //     console.log(element);
    //     e.stopPropagation(); //Stoppe la propagation de l'event pour éviter la dropzone d'agir
    // });
}

export function applyDropEvents(dropper, selection) {

    dropper.addEventListener('dragover', function (e) {
        e.preventDefault();
        this.className = 'mka-dropzone mka-dropzone-hover'; //Ajout de la classe pour le hover de la dropzone
    });

    dropper.addEventListener('dragleave', function () {
        this.className = 'mka-dropzone';
    });

    dropper.addEventListener('drop', function (e) {
        let target = e.target;

        while (target.className.indexOf('mka-dropzone') == -1) { // Cette boucle permet de remonter jusqu'à la zone de drop parente
            target = target.parentNode;
        }

        target.className = 'mka-dropzone'; // Application du style par défaut

        Array.from(selection).map(elt => {
            elt.parentNode.removeChild(elt); // Suppression des éléments selectionnés
        });
    });
}

function getDraggedContainerStyle(multipleDragContainer) {
    multipleDragContainer.style.width = "250px";
    multipleDragContainer.style.backgroundColor = "#f8f8f8";
    multipleDragContainer.style.border = "1px solid #ededed";
    multipleDragContainer.style.opacity = "1";


    return multipleDragContainer;
}

export let active = (mka) => {

    let elements = document.querySelectorAll('.mka-elt');
    // let droppers = document.querySelectorAll('.mka-dropzone');
    // let mkaSelectedElts = mka.getElementsByClassName("mka-elt-selected");


    //Application du drag event pour chaque element ayant la classe mka-elt
    Array.from(elements).map(elt => {
        bindDragEvents(elt);
    });

    // //Application du drop event pour chaque element ayant la classe mka-dropzone
    // Array.from(droppers).map(elt => dndHandler.applyDropEvents(elt, mkaSelectedElts));
};