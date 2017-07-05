let parentFunctions = {};
let config = {};
let copyElts;

export let init = (conf, publicFunctions) => {
    config = conf;
    parentFunctions = publicFunctions;
}

export let windowEvents = {
    onkeyup: (e) => {
        if(e.which == '67' && e.ctrlKey) {
            copyElts = parentFunctions.getSelection();
        } else if (e.which == '86' && e.ctrlKey) {
            config.pasteFunction(copyElts);
        }
    }
}