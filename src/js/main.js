import * as rightClick from './rightClick';
import * as dndHandler from './DragAndDrop';
import * as select from './select';
import * as copyPaste from './copyPaste';

// principal elt
let mka = document.getElementById("mka");
if (!mka) throw new Error('mka id not found');

let config = {
    "focus": "mka",
    "eltSelectedClass": null,
    "onDragItemClass": null,
    "dragNdrop": true,
    "rightClik": true,
    "lasso": true,
    "dropFunction": (ids) => {
        console.log(ids);
        console.log("Default drop function, think to implement this function");
    },
    "pasteFunction": (items) => {
        console.log(items);
        console.log("Default past function, think to implement this function");
    }
}

config.actions = [];

document.onkeydown = (e) => {
    config.actions[config.focus + '-arrow'](e);
}


HTMLElement.prototype.mkaInit = function (clientConfig) {
    Object.keys(clientConfig).map((i) => {
        config[i] = clientConfig[i];
    });

    if (config.rightClik) {
        rightClick.active(mka, config);
    }
    if (config.dragNdrop) {
        dndHandler.active(mka, config);
    }
    if (config.copyPaste) {
        copyPaste.active(config);
    }
    select.active(mka, config);
};