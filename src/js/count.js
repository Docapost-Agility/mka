export let onSelectionUpdate = (params) => {
// si l'élément HTML mka-count existe
    if (params.selection && params.configs && !!document.getElementById(params.configs.count)) {
        document.getElementById(params.configs.count).innerHTML = params.selection.length;
    }
}
