let config = null;
const mka = document.getElementById("mka");

export let bindDragEvents = (element) => {
    // On recupere les élts sélectionnés 
    let selection = mka.getElementsByClassName("mka-elt-selected");

    element.addEventListener('dragstart', function (e) {
        // on ajoute une class pour modifier le style de la selection
        Array.from(selection).map((elt) => elt.classList.add("on-drag"));

        let innerCode = "";
        let wrapper = document.createElement('div');
        const wrapperSize = selection[0].scrollWidth;

        //On rajoute le code html de chaque éléments dans une variable
        Array.from(selection).map((elt) => {
            innerCode += elt.innerHTML;
        });

        //On set le innerHTML avec tous les éléments récupérés précedemment
        wrapper.innerHTML = innerCode;
        wrapper.id = "wrapper-drag";
        wrapper.style.width = wrapperSize + "px";

        //On set la position sur absolute et on sort le wrapper de la page sinon ce dernier s'affiche lors du drag
        wrapper.style.position = "absolute";
        wrapper.style.top = "-10000px";

        wrapper = setWrapperStyle(wrapper);

        document.body.appendChild(wrapper);

        e.dataTransfer.setDragImage(wrapper, 0, 0);

        e.dataTransfer.setData('text/plain', '');

    });

    element.addEventListener('dragend', function (e) {
        // On supprime la div avec l'id wrapper-drag
        document.getElementById("wrapper-drag").outerHTML = "";

        // on retire la class
        Array.from(selection).map((elt) => elt.classList.remove("on-drag"));
    });
}

export function bindDropEvents(dropper) {

    dropper.addEventListener('dragover', function (e) {
        //Ajout de la classe pour le hover de la dropzone
        // Cela permet de voir les zone qui peut recevoir la selection
        this.classList.add('zone-hover');

        // Il faut absolument laisser le preventDefault pour que le drop sur la zone s'execute
        e.preventDefault();
    });

    dropper.addEventListener('dragleave', function () {
        // On retire la class
        this.classList.remove('zone-hover');
    });

    dropper.addEventListener('drop', function (e) {

        // Lorsque l'utilisateur relache la sélection sur la zone dropable 
        // on execute l'action défini par l'utilsateur
        let selection = mka.getElementsByClassName("mka-elt-selected");
        config.dropFunction([1, 2]);
        // Suppression des éléments selectionnés
        // On recupere les élts sélectionnés 
        Array.from(selection).map(elt => {
            elt.parentNode.removeChild(elt);
        });
    });
}


let setWrapperStyle = (wrapper) => {
    //On récupère les éléments enfants du wrapper qui servira pour le drag
    let wrapperChildren = wrapper.children;
    //On choisit le nombre de pixels qui séparera les éléments en fonction du nombre d'éléments dans la liste
    let childDistance = wrapperChildren.length > 15 ? 1 : 2;

    wrapper.style.opacity = "1";

    // Pour chaque élément du wrapper
    for(let i = 0; i < wrapperChildren.length; i++) {
        let child = wrapperChildren[i];

        //Si l'utilisateur a configuré le onDragItemsClass, on applique la classe en question
        if(config.onDragItemClass){
            child.classList.add(config.onDragItemClass);
        } else {
            //Sinon on force un style par défaut si l'utilisateur n'a pas configuré le onDragItemsClass
            child.style.color = "black";
            child.style.backgroundColor = "white";
            child.style.border = "1px solid grey";
            child.style.padding = "5px";
            child.style.textAlign = "center";
            child.style.width = "100%";



            console.log("You can use your own class");
        }


        // Chaque élément a une position abolute
        // On multiplie i par un nombre de pixels pour indiquer le décalage et avoir un effet d'empilement
        child.style.position = "absolute";
        child.style.top = (i * childDistance) + "px";
        child.style.left = (i * childDistance) + "px";

        //Lorsqu'on parcourt le dernier élément et qu'il y a plus d'un élement
        if(i === wrapperChildren.length -1 && wrapperChildren.length > 1){
            //On crée une span qui contiendra le nombre d'élements selectionnés
            let span = document.createElement("span");
            span.innerHTML = wrapperChildren.length;
            span.style.height = "25px";
            span.style.width = "25px";
            span.style.lineHeight = "25px";
            span.style.position = "absolute";
            span.style.right = "-10px";
            span.style.top = "-5px";
            span.style.zIndex = "25";
            span.style.borderRadius = "15px";
            span.style.textAlign = "center";

            //Si on n'a pas configuré le onDragItemClass alors on applique un style par défaut
            if(!config.onDragItemClass){
                span.style.backgroundColor = "red";
                span.style.color = "white";
            }
            child.appendChild(span);
        }
    }

    return wrapper;
}

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