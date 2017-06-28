let config = null;
export let bindDragEvents = (element) => {
    // On recupere les élts sélectionnés 
    let selection = mka.getElementsByClassName("mka-elt-selected");

    element.addEventListener('dragstart', function (e) {
        // on ajoute une class pour modifier le style de la selection
        Array.from(selection).map((elt) => elt.classList.add("on-drag"));

        // Dans le cas ou il y a plus d'un élt sélectionné on deplace l'ensemble 
        // et on ajoute un effet de regroupement 
        // if (selection.length > 1) {
        //     let multipleDragContainer = this.cloneNode(true);
        //     multipleDragContainer = getDraggedContainerStyle(multipleDragContainer);
        //     document.body.appendChild(multipleDragContainer);
        //     e.dataTransfer.setDragImage(multipleDragContainer, 0, 0);
        // }

        // e.dataTransfer.setData('text/plain', ''); 
    });

    element.addEventListener('dragend', function (e) {
        // on retire la class
        Array.from(selection).map((elt) => elt.classList.remove("on-drag"));
    });

    // element.addEventListener('drop', function (e) {
    //         // e.preventDefault();
    //     // console.log(element);
    //     // element.style.display = "none";
    //     // console.log(element);
    //     // element.classList.remove("on-drag");
    //     // console.log(element);
    //     // e.stopPropagation(); //Stoppe la propagation de l'event pour éviter la dropzone d'agir
    // });
}

export function bindDropEvents(dropper) {

    dropper.addEventListener('dragover', function (e) {
        //Ajout de la classe pour le hover de la dropzone
        // Cela permet de voir les zone qui peut recevoir la selection
        this.classList.add('mka-dropzone-hover');

        // Il faut absolument laisser le preventDefault pour que le drop sur la zone s'execute
        e.preventDefault();
    });

    dropper.addEventListener('dragleave', function () {
        // On retire la class
        this.classList.remove('mka-dropzone-hover');
    });

    dropper.addEventListener('drop', function (e) {

        // Lorsque l'utilisateur relache la sélection sur la zone dropable 
        // on execute l'action défini par l'utilsateur
        let selection = mka.getElementsByClassName("mka-elt-selected");
        console.log(selection);
        alert("Voulez vous vraiment ... ");
        config.dropFunction([1, 2]);
        // Suppression des éléments selectionnés
        // On recupere les élts sélectionnés 
        Array.from(selection).map(elt => {
            elt.parentNode.removeChild(elt);
        });
    });
}

// function getDraggedContainerStyle(multipleDragContainer) {
//     multipleDragContainer.style.width = "250px";
//     multipleDragContainer.style.backgroundColor = "#f8f8f8";
//     multipleDragContainer.style.border = "1px solid #ededed";
//     multipleDragContainer.style.opacity = "1";


//     return multipleDragContainer;
// }

export let active = (mka, conf) => {
    config = conf;
    let elements = document.querySelectorAll('.mka-elt');
    let droppers = document.querySelectorAll('.mka-dropzone');

    //Application du drag event pour chaque element ayant la classe mka-elt
    Array.from(elements).map(elt => {
        bindDragEvents(elt);
    });

    //Application du drop event pour chaque element ayant la classe mka-dropzone
    Array.from(droppers).map(elt => bindDropEvents(elt));
};