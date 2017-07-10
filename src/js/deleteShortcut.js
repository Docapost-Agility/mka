let parentFunctions = {};
let config = {};

export let init = (conf, publicFunctions) => {
    config = conf;
    parentFunctions = publicFunctions;
}
export let windowEvents = {
    onkeyup: (e) => {

        let selection = parentFunctions.getSelection();

        if(e.which == '46' && selection.length > 0 && typeof config.deleteShortcut === 'function') {
            config.deleteShortcut(selection);
            return true;
        }

        return false;
    }
}
