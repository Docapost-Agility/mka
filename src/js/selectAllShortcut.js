let parentFunctions = {};
let config = {};
let isMkaContainerFocused = false;

export let init = (conf, publicFunctions) => {
    config = conf;
    parentFunctions = publicFunctions;
}

export let windowEvents = {
    onkeydown : (e) => {

        if(e.ctrlKey) {
            let code = e.which;

            if((code === 65 || code === 97) && isMkaContainerFocused) {
                let newSelection = parentFunctions.getSelectablesElements();

                parentFunctions.updateSelection(newSelection);

                e.preventDefault();
            }
            return true;
        }

        return false;
    },
    onmousedown : (e) => {
        isMkaContainerFocused = parentFunctions.isMkaContainerFocused(e.target);
    }
}