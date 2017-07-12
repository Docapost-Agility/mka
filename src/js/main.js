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
    },
    "longPressDelay": 500,
    "dbClickDelay": 350
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

    if (configs.dragNdrop && !configs.isMobileDevice) {
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

let isMobileDevice = () => {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
            check = true
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

HTMLElement.prototype.mkaInit = function (clientConfigs) {
    let container = this;
    container.style.userSelect = "none";
    container.style['-moz-user-select'] = 'none';
    container.style['-webkit-user-select'] = 'none';
    container.style['-ms-user-select'] = 'none';

    let configs = getConfigs(clientConfigs);
    configs.isMobileDevice = isMobileDevice();

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
