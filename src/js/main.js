import * as dbClick from './dbClick';
import * as rightClick from './rightClick';
import * as dndHandler from './DragAndDrop';
import * as select from './select';
import * as copyPaste from './copyPaste';
import * as count from './count';
import * as arrows from './arrows';
import * as deleteShortcut from './deleteShortcut';
import * as selectAllShortcut from './selectAllShortcut';

let defaultConfigs = {
    "eltsSelectable": '',
    "eltSelectedClass": "mka-elt-selected",
    "eltSelectingClass": "mka-elt-selecting",
    "onDragItemClass": null,
    "dragNdrop": false,
    "droppableElements": '',
    "rightClick": false,
    "dbClick": false,
    "lasso": true,
    "selectAllShortcut": true,
    "copyPaste": true,
    "arrows": true,
    "deleteShortcut": false,
    "count": "",
    "pasteFunction": (items) => {
        console.log(items);
        console.log("Default past function, think to implement this function");
    }
}

let updateSelection = (container, newSelection, actionId) => {
    let configs = container.mkaParams.configs;
    let components = container.mkaParams.components;
    let selectables = container.mkaParams.selectables;

    let sameSelection = false;
    if (container.mkaParams.selection.length === newSelection.length) {
        sameSelection = true;
        container.mkaParams.selection.forEach(elt => {
            if (newSelection.indexOf(elt) === -1) {
                sameSelection = false;
            }
        });
    }
    if (!sameSelection) {
        container.mkaParams.selection = newSelection;
        selectables.forEach(elt => {
            elt.classList.remove(configs.eltSelectedClass);
        });
        container.mkaParams.selection.forEach(elt => {
            elt.classList.add(configs.eltSelectedClass);
        });
        let params = {
            selection: container.mkaParams.selection,
            selectables: container.mkaParams.selectables,
            configs: container.mkaParams.configs,
            parentFunctions: getPublicFunctions(container),
            actionId: actionId
        }
        components.forEach(component => {
            component.onSelectionUpdate && component.onSelectionUpdate(params);
        });
    }
}

let getConfigs = (clientConfigs) => {
    let configs = {};
    Object.keys(defaultConfigs).forEach((i) => {
        configs[i] = (typeof clientConfigs[i] !== 'undefined') ? clientConfigs[i] : defaultConfigs[i];
    });
    return configs;
}

let pushComponents = (container) => {
    let configs = container.mkaParams.configs;

    container.mkaParams.components = [];

    if (!!configs.dbClick) {
        container.mkaParams.components.push(dbClick);
    }

    if (!!configs.rightClick) {
        container.mkaParams.components.push(rightClick);
    }

    if (configs.dragNdrop) {
        container.mkaParams.components.push(dndHandler);
    }

    if (configs.selectAllShortcut) {
        container.mkaParams.components.push(selectAllShortcut);
    }

    if (configs.copyPaste) {
        container.mkaParams.components.push(copyPaste);
    }

    if (!!configs.deleteShortcut) {
        container.mkaParams.components.push(deleteShortcut);
    }

    if (!!configs.arrows) {
        container.mkaParams.components.push(arrows);
    }
    if (!!configs.count) {
        container.mkaParams.components.push(count);
    }

    container.mkaParams.components.push(select);
}

let getPublicFunctions = (container) => {
    let configs = container.mkaParams.configs;
    let components = container.mkaParams.components;

    container.mkaParams.customProperties = container.mkaParams.customProperties || {};

    return {
        getContainer: () => {
            return container;
        },
        setProperty: (key, value) => {
            container.mkaParams.customProperties[key] = value;
        },
        getProperty: (key) => {
            return container.mkaParams.customProperties[key];
        },
        elementIsSelected: (elt) => {
            if (elt.classList && elt.classList.contains(configs.eltSelectedClass)) {
                return true;
            }
            while (elt.parentNode) {
                elt = elt.parentNode;
                if (elt.classList && elt.classList.contains(configs.eltSelectedClass)) {
                    return true;
                }
            }
            return false;
        },
        getSelectableElement: (elt) => {
            let selectables = container.mkaParams.selectables;
            if (elt.classList && selectables.indexOf(elt) !== -1) {
                return elt;
            }
            while (elt.parentNode) {
                elt = elt.parentNode;
                if (elt.classList && selectables.indexOf(elt) !== -1) {
                    return elt;
                }
            }
            return null;
        },
        getSelectablesElements: () => {
            return container.mkaParams.selectables;
            ;
        },
        getLastSelectedInDom: () => {
            let last = null;
            container.mkaParams.selection.forEach(elt => {
                if (!last || elt.offsetTop > last.offsetTop || elt.offsetTop === last.offsetTop && elt.offsetLeft > last.offsetLeft) {
                    last = elt;
                }
            });
            return last;
        },
        getSelection: () => {
            let copy = [];
            container.mkaParams.selection.forEach(elt => {
                copy.push(elt);
            });
            return copy;
        },
        updateSelection: (newSelection, actionId) => {
            updateSelection(container, newSelection, actionId);
        },
        removeElements: (elements) => {
            elements.forEach(elt => {
                let index = container.mkaParams.selectables.indexOf(elt);
                if (index !== -1) {
                    container.mkaParams.selectables.splice(index, 1);
                }
                index = container.mkaParams.selection.indexOf(elt);
                if (index !== -1) {
                    container.mkaParams.selection.splice(index, 1);
                }
                elt.parentNode.removeChild(elt);
            });
            components.forEach(component => {
                component.onSelectionUpdate && component.onSelectionUpdate(container.mkaParams.selection, container.mkaParams.selectables);
            });
        },
        isMkaContainerFocused: (target) => {
            if (target === container) {
                return true;
            }

            while (target.parentNode) {
                target = target.parentNode;

                if (target === container) {
                    return true;
                }
            }

            return false;
        }
    }
}

let initComponents = (container) => {
    let configs = container.mkaParams.configs;
    let components = container.mkaParams.components;

    components.forEach(component => {
        component.init && component.init(configs, getPublicFunctions(container));
    });
}

let bindEvents = (container) => {
    let publicFunctions = getPublicFunctions(container);
    let components = container.mkaParams.components;

    let bindComponentsEvents = (target, eventName) => {
        let saveIfAlreadyExists = target.value[eventName];
        target.value[eventName] = (event) => {
            let stop = false;
            if (saveIfAlreadyExists && typeof saveIfAlreadyExists === 'function') {
                stop = saveIfAlreadyExists(event).forceStop;
            }
            components.forEach(component => {
                if (!stop) {
                    stop = component[target.name] && component[target.name][eventName] && component[target.name][eventName](event, publicFunctions, container.mkaParams.configs) || false;
                }
            });
            return {forceStop: stop};
        }
    }

    let mouseEventsList = ["onmousedown", "onmousemove", "onmouseup", "onclick", "ondblclick"];
    let mouseEventsTargets = [
        {name: "windowEvents", value: window},
        {name: "documentEvents", value: document.body},
        {name: "mkaEvents", value: container}
    ];

    let keyEventsList = ["onkeydown", "onkeypress", "onkeyup"];

    mouseEventsTargets.forEach(mouseEventTarget => {
        mouseEventsList.forEach(mouseEventName => {
            bindComponentsEvents(mouseEventTarget, mouseEventName);
        });
    });

    keyEventsList.forEach(keyEventName => {
        bindComponentsEvents({name: "windowEvents", value: window}, keyEventName);
    });
}

let refreshComponents = (container) => {
    let components = container.mkaParams.components;

    components.forEach(component => {
        component.refresh && component.refresh(container.mkaParams.selectables, container.mkaParams.configs);
    });
}

let updateSelectableElements = (container, elements) => {
    if (container.mkaParams.selectables) {
        container.mkaParams.selectables.forEach(elt => {
            elt.mkaSelectable = false;
        });
    }
    elements.forEach(elt => {
        elt.mkaSelectable = true;
    });
    container.mkaParams.selectables = elements;
}

let mkaRefresh = (container) => {
    let newSelectables = [].slice.call(container.querySelectorAll(container.mkaParams.configs.eltsSelectable));
    let newSelection = [];
    container.mkaParams.selection.forEach(elt => {
        if (newSelectables.indexOf(elt) !== -1) {
            newSelection.push(elt);
        }
    });
    updateSelection(container, newSelection);

    updateSelectableElements(container, newSelectables);

    refreshComponents(container);
}

let listenContainerDOMChange = (container) => {
    let containsSelectableElement = (node) => {
        //Check if removed node is selectable
        if (!!node.mkaSelectable) {
            return true;
        }

        //Check if added node is selectable
        let parentNode = node.parentNode;
        if (parentNode) {
            let selectablesNodes = parentNode.querySelectorAll(container.mkaParams.configs.eltsSelectable);
            for (let i = 0; i < selectablesNodes.length; i++) {
                if (selectablesNodes.item(i) === node) {
                    return true;
                }
            }
        }

        //Check if current node contains selectables elements
        if (node.querySelectorAll && node.querySelectorAll(container.mkaParams.configs.eltsSelectable).length > 0) {
            return true;
        }

        return false;

    }

    // Function to detect when dom change for refresh selectable elements
    if (typeof MutationObserver !== "undefined") {
        var observer = new MutationObserver(function (mutations) {
            let needToRefresh = false;
            mutations.forEach(function (mutation) {
                if (!needToRefresh) {
                    // If new element are added
                    if (mutation.addedNodes) {
                        for (let i = 0; i < mutation.addedNodes.length; i++) {
                            needToRefresh = containsSelectableElement(mutation.addedNodes.item(i));
                        }
                    }
                    // If element are removed
                    if (mutation.removedNodes) {
                        for (let i = 0; i < mutation.removedNodes.length; i++) {
                            needToRefresh = containsSelectableElement(mutation.removedNodes.item(i));
                        }
                    }
                }
            });
            if (needToRefresh) {
                mkaRefresh(container);
            }
        });

        observer.observe(container, {childList: true, subtree: true});
    } else {
        //IE < 11
        container.addEventListener('DOMNodeRemoved', function (event) {
            if (containsSelectableElement(event.target)) {
                setTimeout(() => {
                    mkaRefresh(container);
                }, 0);
            }
        });
        container.addEventListener('DOMNodeInserted', function (event) {
            if (containsSelectableElement(event.target)) {
                setTimeout(() => {
                    mkaRefresh(container);
                }, 0);
            }
        });
    }
}

HTMLElement.prototype.mkaInit = function (clientConfigs) {
    let container = this;
    container.style.userSelect = "none";
    container.style['-moz-user-select'] = 'none';
    container.style['-webkit-user-select'] = 'none';
    container.style['-ms-user-select'] = 'none';

    let configs = getConfigs(clientConfigs);

    let selectables = [].slice.call(container.querySelectorAll(configs.eltsSelectable));

    container.mkaParams = {
        configs: configs,
        selection: []
    };
    updateSelectableElements(container, selectables);

    pushComponents(container);

    initComponents(container);

    bindEvents(container);

    listenContainerDOMChange(container);

};

HTMLElement.prototype.mkaRefresh = function () {
    let container = this;

    if (!container.mkaParams || !container.mkaParams.configs) {
        console.log("No MKA found on this element, call mkaInit first");
        return false;
    }

    mkaRefresh(container);

}

let getOffsetBody = (elt, offsetType) => {
    let offset = elt[offsetType];
    while (!!elt.offsetParent && elt.offsetParent !== document.body) {
        elt = elt.offsetParent;
        offset = offset + elt[offsetType];
    }
    return offset;
}

HTMLElement.prototype.offsetBodyLeft = function () {
    return getOffsetBody(this, "offsetLeft");
}

HTMLElement.prototype.offsetBodyTop = function () {
    return getOffsetBody(this, "offsetTop");
}

HTMLElement.prototype.offsetBodyRight = function () {
    return getOffsetBody(this, "offsetRight");
}

HTMLElement.prototype.offsetBodyBottom = function () {
    return getOffsetBody(this, "offsetBottom");
}

let getScrollTotal = (elt, scrollType) => {
    let scroll = elt[scrollType];
    while (elt.parentNode && elt.parentNode !== document.body) {
        elt = elt.parentNode;
        scroll = scroll + elt[scrollType];
    }
    scroll = scroll + document.body[scrollType];
    return scroll;
}

HTMLElement.prototype.scrollTopTotal = function () {
    return getScrollTotal(this, "scrollTop");
}

HTMLElement.prototype.scrollLeftTotal = function () {
    return getScrollTotal(this, "scrollLeft");
}
