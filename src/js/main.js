import * as rightClick from './rightClick';
import * as dndHandler from './DragAndDrop';
import * as select from './select';
import * as copyPaste from './copyPaste';
import * as deleteShortcut from './deleteShortcut';
import * as selectAllShortcut from './selectAllShortcut';

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
    "selectAllShortcut": true,
    "copyPaste": true,
    "deleteShortcut": true,
    "dropFunction": function (ids) {
        console.log(ids);
        console.log("Default drop function, think to implement this function");
    },
    "pasteFunction": (items) => {
        console.log(items);
        console.log("Default past function, think to implement this function");
    },
    "deleteFunction": function (items) {
        console.log(items);
        console.log("Default delete function, think to implement this function");
    }
}

config.actions = [];

document.onkeydown = (e) => {
    config.actions[config.focus + '-arrow'](e);
}

let selectables = document.getElementsByClassName("mka-elt");
let selection = [];
let components = [];

HTMLElement.prototype.mkaInit = function (clientConfig) {
    Object.keys(clientConfig).map((i) => {
        config[i] = clientConfig[i];
    });

    let mouseEventsList = ["onmousedown", "onmousemove", "onmouseup"];
    let mouseEventsTargets = [
        {name: "windowEvents", value: window},
        {name: "documentEvents", value: document.body},
        {name: "mkaEvents", value: mka}
    ];

    let keyEventsList = ["keydown", "keypress", "keyup"];


    if (config.rightClik) {
        components.push(rightClick);
    }

    if (config.dragNdrop) {
        components.push(dndHandler);
    }

    if (config.copyPaste) {
        components.push(copyPaste);
    }

    components.push(select);

    let publicFunctions = {
        getContainer: () => {
            return mka;
        },
        elementIsSelected: (elt) => {
            if (elt.classList && elt.classList.contains("mka-elt-selected")) {
                return true;
            }
            while (elt.parentNode) {
                elt = elt.parentNode;
                if (elt.classList && elt.classList.contains("mka-elt-selected")) {
                    return true;
                }
            }
            return false;
        },
        getSelectablesElements: () => {
            return selectables;
        },
        getSelection: () => {
            return selection;
        },
        updateSelection: (newSelection) => {
            selection = newSelection;
            Array.from(selectables).map(elt => {
                elt.classList.remove("mka-elt-selected");
            });
            Array.from(selection).map(elt => {
                elt.classList.add("mka-elt-selected");
            });
            Array.from(components).map(component => {
                component.onSelectionUpdate && component.onSelectionUpdate(selection);
            });
        }
    };

    Array.from(components).map(component => {
        component.init && component.init(config, publicFunctions);
    });

    let bindComponentsEvents = (target, eventName) => {
        target.value[eventName] = (event) => {
            let stop = false;
            Array.from(components).map(component => {
                if (!stop) {
                    stop = component[target.name] && component[target.name][eventName] && component[target.name][eventName](event) || false;
                }
            });
        }
    }

    Array.from(mouseEventsTargets).map(mouseEventTarget => {
        Array.from(mouseEventsList).map(mouseEventName => {
            bindComponentsEvents(mouseEventTarget, mouseEventName);
        });
    });

    Array.from(keyEventsList).map(keyEventName => {
        bindComponentsEvents({name: "windowEvents", value: window}, keyEventName);
    });
};
