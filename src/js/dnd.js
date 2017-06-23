(function (){

    let dndHandler = {

        draggedElement: null,

        applyDragEvents: function (element) {
            element.draggable = true;

            let dndHandler = this;

            element.addEventListener('dragstart', function(e) {
                dndHandler.draggedElement = e.target;  //On sauvegarde l'élément en cours de déplacement
                e.dataTransfer.setData('text/plain', ''); // Nécessaire pour Firefox
            });

            element.addEventListener('drag', function(e) {
                element.classList.add("on-drag");
            });

            element.addEventListener('dragend', function(e) {
                element.classList.remove("on-drag");
            });

            element.addEventListener('drop', function(e) {
                element.classList.remove("on-drag");
                e.stopPropagation(); //Stoppe la propagation de l'event pour éviter la dropzone d'agir
            });
        },

        applyDropEvents: function(dropper) {

            dropper.addEventListener('dragover', function(e) {
               e.preventDefault();
                this.className = 'mka-dropzone mka-dropzone-hover'; //Ajout de la classe pour le hover de la dropzone
            });

            dropper.addEventListener('dragleave', function() {
               this.className = 'mka-dropzone';
            });

            dropper.addEventListener('drop', function(e) {

                var target = e.target,
                    draggedElement = dndHandler.draggedElement; // Récupération de l'élément concerné

                while (target.className.indexOf('mka-dropzone') == -1) { // Cette boucle permet de remonter jusqu'à la zone de drop parente
                    target = target.parentNode;
                }

                target.className = 'mka-dropzone'; // Application du style par défaut


                draggedElement.parentNode.removeChild(draggedElement); // Suppression de l'élément d'origine

            });
        }
    };

    let elements = document.querySelectorAll('.mka-elt'), elementsLength = elements.length;

    for(let i = 0; i < elementsLength; i++) {
        dndHandler.applyDragEvents(elements[i]); //Application du drag event pour chaque element ayant la classe mka-elt
    }

    let droppers = document.querySelectorAll('.mka-dropzone'), droppersLength = droppers.length;

    for(let i = 0; i < droppersLength; i++){
        dndHandler.applyDropEvents(droppers[i]); //Application du drop event pour chaque element ayant la classe mka-dropzone
    }


})();