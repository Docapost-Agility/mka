let parentFunctions = {};
let config = {};

export let init = (conf, publicFunctions) => {
    config = conf;
    parentFunctions = publicFunctions;
}
export let windowEvents = {
    onkeyup: (e) => {

        let selection = parentFunctions.getSelection();

        if(e.which == '46' && selection.length > 0) {
            config.deleteFunction(selection);

            selection.forEach(function (elt) {
               elt.parentNode.removeChild(elt);
            });

            return true;
        }

        return false;
    }
}