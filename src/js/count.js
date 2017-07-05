let parentFunctions = {};
let config = {};

export let init = (conf, publicFunctions) => {
    config = conf;
    parentFunctions = publicFunctions;
}

export let onSelectionUpdate = (selection) => {
// si l'élément HTML mka-count existe
    if (!!document.getElementById(config.count)) {
        document.getElementById(config.count).innerHTML = selection.length;
    }
}
