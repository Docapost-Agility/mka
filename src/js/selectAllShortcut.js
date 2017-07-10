export let init = (conf, parentFunctions) => {
    parentFunctions.setProperty('isMkaContainerFocused', false);
}

export let windowEvents = {
    onkeydown: (e, parentFunctions) => {
        if (e.ctrlKey) {
            let code = e.which;

            if ((code === 65 || code === 97) && parentFunctions.getProperty('isMkaContainerFocused')) {
                let newSelection = parentFunctions.getSelectablesElements();

                parentFunctions.updateSelection(newSelection);

                e.preventDefault();
                return true;
            }
        }
        return false;
    },
    onmousedown: (e, parentFunctions) => {
        parentFunctions.setProperty('isMkaContainerFocused', parentFunctions.isMkaContainerFocused(e.target));
        return false;
    }
}
