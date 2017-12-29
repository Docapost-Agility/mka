export let init = (conf, parentFunctions) => {
    parentFunctions.setProperty('copyElts', []);
}

export let windowEvents = {
    onkeyup: (e, parentFunctions, conf) => {
        if (e.which == '67' && (e.ctrlKey || e.metaKey)) {
            parentFunctions.setProperty('copyElts', parentFunctions.getSelection());
        } else if (e.which == '86' && e.ctrlKey) {
            conf.pasteFunction(parentFunctions.getProperty('copyElts'));
        }
    }
}
