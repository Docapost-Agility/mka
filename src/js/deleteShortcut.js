export let windowEvents = {
    onkeyup: (e, parentFunctions, conf) => {

        let selection = parentFunctions.getSelection();

        if(e.which == '46' && selection.length > 0 && typeof conf.deleteShortcut === 'function') {
            conf.deleteShortcut(selection);
            return true;
        }

        return false;
    }
}
