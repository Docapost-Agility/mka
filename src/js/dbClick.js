let parentFunctions = {};
let config = {};

export let init = (conf, publicFunctions) => {
    config = conf;
    parentFunctions = publicFunctions;
}

export let mkaEvents = {
    ondblclick: (e) => {
        let element = parentFunctions.getSelectableElement(e.target);
        if (!!element && typeof config.dbClick === 'function') {
            parentFunctions.updateSelection([element]);
            config.dbClick(element);
            return true;
        }
        return false;
    }
}
