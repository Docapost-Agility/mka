export let init = (conf, parentFunctions) => {
    parentFunctions.setProperty('dbClick.lastTouchDate', null);

    if (conf.isMobileDevice) {
        bindMobileDevice(conf, parentFunctions);
    }
}

export let mkaEvents = {
    ondblclick: (e, parentFunctions, conf) => {
        return launchDbClick(e, parentFunctions, conf);
    }
}

let bindMobileDevice = (conf, parentFunctions) => {
    parentFunctions.getContainer().addEventListener('touchstart', (e) => {
        let currentDate = new Date();
        let lastTouchDate = parentFunctions.getProperty('dbClick.lastTouchDate');
        if (lastTouchDate && (currentDate - lastTouchDate) < conf.dbClickDelay && e.touches.length === 1) {
            e.preventDefault();
            launchDbClick(e, parentFunctions, conf);
            parentFunctions.setProperty('dbClick.lastTouchDate', null);
        } else {
            parentFunctions.setProperty('dbClick.lastTouchDate', currentDate);
        }
    });
}

let launchDbClick = (e, parentFunctions, conf) => {
    let element = parentFunctions.getSelectableElement(e.target);
    if (!!element && typeof conf.dbClick === 'function') {
        parentFunctions.updateSelection([element]);
        conf.dbClick(element);
        return true;
    }
    return false;
}
