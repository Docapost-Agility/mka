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
    "selectAllShortcut": false,
    "dropFunction": function (ids) {
        console.log(ids);
        console.log("Default drop function, think to implement this function");
    },
    "deleteFunction": function (ids) {
        console.log(ids);
        console.log("Default delete function, think to implement this function");
    }
}
config.actions = [];

document.onkeydown = (e) => {
    config.actions[config.focus + '-arrow'](e);
}
import * as rightClick from './rightClick';
import * as dndHandler from './DragAndDrop';
import * as select from './select';

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
    select.active(mka, config);
};