export let onSelectionUpdate = (selection, selectables, conf) => {
// si l'élément HTML mka-count existe
    if (!!document.getElementById(conf.count)) {
        document.getElementById(conf.count).innerHTML = selection.length;
    }
}
