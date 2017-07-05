import * as rightClick from './rightClick';
import * as dndHandler from './DragAndDrop';
import * as select from './select';
import * as copyPaste from './copyPaste';
import * as count from './count';
import * as arrows from './arrows';
import * as deleteShortcut from './deleteShortcut';
import * as selectAllShortcut from './selectAllShortcut';

// principal elt
let mka = document.getElementById("mka");
if (!mka) throw new Error('mka id not found');

let config = {
    "eltSelectableClass": "mka-elt",
    "eltSelectedClass": "mka-elt-selected",
    "onDragItemClass": null,
    "dragNdrop": true,
    "rightClick": false,
    "lasso": true,
    "selectAllShortcut": true,
    "copyPaste": true,
    "arrows": true,
    "deleteShortcut": true,
    "count": "",
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

let selectables = [];
let selection = [];
let components = [];

HTMLElement.prototype.mkaInit = function (clientConfig) {
    Object.keys(clientConfig).map((i) => {
        config[i] = clientConfig[i];
    });

    selectables = [].slice.call(document.getElementsByClassName(config.eltSelectableClass));

    // on désactive la selection de text
    mka.style.userSelect = "none";


    if (!!config.rightClick) {
        components.push(rightClick);
    }

    if (config.dragNdrop) {
        components.push(dndHandler);
    }

    if(config.selectAllShortcut){
        components.push(selectAllShortcut);
    }

    if (config.copyPaste) {
        components.push(copyPaste);
    }

    if (!!config.arrows) {
        components.push(arrows);
    }
    if (!!config.count) {
        components.push(count);
    }

    // if(config.deleteShortcut) {
    //     deleteShortcut.active(config);
    // }

    components.push(select);

    let publicFunctions = {
        getContainer: () => {
            return mka;
        },
        elementIsSelected: (elt) => {
            if (elt.classList && elt.classList.contains(config.eltSelectedClass)) {
                return true;
            }
            while (elt.parentNode) {
                elt = elt.parentNode;
                if (elt.classList && elt.classList.contains(config.eltSelectedClass)) {
                    return true;
                }
            }
            return false;
        },
        getSelectableElement: (elt) => {
            if (elt.classList && elt.classList.contains(config.eltSelectableClass)) {
                return elt;
            }
            while (elt.parentNode) {
                elt = elt.parentNode;
                if (elt.classList && elt.classList.contains(config.eltSelectableClass)) {
                    return elt;
                }
            }
            return null;
        },
        getSelectablesElements: () => {
            return selectables;
        },
        getLastSelectedInDom: () => {
            let last = null;
            Array.from(selection).map(elt => {
                if (!last || elt.offsetTop > last.offsetTop || elt.offsetTop === last.offsetTop && elt.offsetLeft > last.offsetLeft) {
                    last = elt;
                }
            });
            return last;
        },
        getSelection: () => {
            let copy = [];
            Array.from(selection).map(elt => {
                copy.push(elt);
            });
            return copy;
        },
        updateSelection: (newSelection) => {
            let sameSelection = false;
            if (selection.length === newSelection.length) {
                sameSelection = true;
                Array.from(selection).map(elt => {
                    if (newSelection.indexOf(elt) === -1) {
                        sameSelection = false;
                    }
                });
            }
            if (!sameSelection) {
                selection = newSelection;
                Array.from(selectables).map(elt => {
                    elt.classList.remove(config.eltSelectedClass);
                });
                Array.from(selection).map(elt => {
                    elt.classList.add(config.eltSelectedClass);
                });
                Array.from(components).map(component => {
                    component.onSelectionUpdate && component.onSelectionUpdate(selection);
                });
            }
        },
        removeElements: (elements) => {
            Array.from(elements).map(elt => {
                let index = selectables.indexOf(elt);
                if (index !== -1) {
                    selectables.splice(index, 1);
                }
                index = selection.indexOf(elt);
                if (index !== -1) {
                    selection.splice(index, 1);
                }
                elt.parentNode.removeChild(elt);
            });
            Array.from(components).map(component => {
                component.onSelectionUpdate && component.onSelectionUpdate(selection);
            });
        },
        isMkaContainerFocused: (target) => {
            if (target.id === config.focus) {
                return true;
            }

            while (target.parentNode) {
                target = target.parentNode;

                if (target.id === config.focus) {
                    return true;
                }
            }

            return false;
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

    let mouseEventsList = ["onmousedown", "onmousemove", "onmouseup", "onclick", "ondblclick"];
    let mouseEventsTargets = [
        {name: "windowEvents", value: window},
        {name: "documentEvents", value: document.body},
        {name: "mkaEvents", value: mka}
    ];

    let keyEventsList = ["onkeydown", "onkeypress", "onkeyup"];

    Array.from(mouseEventsTargets).map(mouseEventTarget => {
        Array.from(mouseEventsList).map(mouseEventName => {
            bindComponentsEvents(mouseEventTarget, mouseEventName);
        });
    });

    Array.from(keyEventsList).map(keyEventName => {
        bindComponentsEvents({name: "windowEvents", value: window}, keyEventName);
    });
};
