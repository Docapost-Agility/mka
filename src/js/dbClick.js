export let mkaEvents = {
    ondblclick: (e, parentFunctions, conf) => {
        let element = parentFunctions.getSelectableElement(e.target);
        if (!!element && typeof conf.dbClick === 'function') {
            parentFunctions.updateSelection([element]);
            conf.dbClick(element);
            return true;
        }
        return false;
    }
}
