let parentFunctions = {};
let config = {};

export let init = (conf, publicFunctions) => {
    config = conf;
    parentFunctions = publicFunctions;
}

let currentFocus = null;

export let windowEvents = {
    onkeydown: (event) => {
        let code = event.which;

        if (code == 37 || code == 38 || code == 39 || code == 40) {
            let selectables = parentFunctions.getSelectablesElements();
            let newSelection = (event.shiftKey) ? parentFunctions.getSelection() : [];
            let lastInDom = parentFunctions.getLastSelectedInDom();
            currentFocus = event.shiftKey && (currentFocus || lastInDom) || null;


            switch (event.which) {
                case 37: // left
                case 38: // up
                    if (!event.shiftKey) {
                        let prev = selectables[selectables.indexOf(lastInDom) - 1];
                        newSelection = (prev) ? [prev] : [lastInDom];
                    } else {
                        //TODO
                    }
                    break;
                case 39: // right
                case 40: // down
                    if (!event.shiftKey) {
                        let next = selectables[selectables.indexOf(lastInDom) + 1];
                        newSelection = (next) ? [next] : [lastInDom];
                    } else {
                        //TODO
                    }
                    break;

                default:
                    return; // exit this handler for other keys
            }

            event.preventDefault();
            if (newSelection[0]) {
                let scrollX = (newSelection[0].offsetLeft + newSelection[0].offsetWidth / 2) - (window.scrollX + window.innerWidth / 2);
                let scrollY = (newSelection[0].offsetTop + newSelection[0].offsetHeight / 2) - (window.scrollY + window.innerHeight / 2);
                window.scrollBy(scrollX, scrollY);
                parentFunctions.updateSelection(newSelection);
            }
            return true;
        }
        return false;
    }
};
