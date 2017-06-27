/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// principal elt
var mka = document.getElementById("mka");

if (!mka) throw new Error('mka id not found');

// on désactive la selection de text
mka.style.userSelect = "none";

var mkarcmenuId = 'mkarcmenu';

// On désactive le click droit sur l'élément principal
mka.addEventListener('contextmenu', function (event) {
    event.preventDefault();

    var mkaEltSelected = document.getElementsByClassName('mka-elt-selected');
    // Si suelement 1 élément est sélectionné et que il y a des items pour le menu
    if (mkaEltSelected.length === 1 && mkaEltSelected[0].hasAttribute('mka-rc-menu-items')) {

        var newMenu = '<div id="' + mkarcmenuId + '"><ul>';

        var menu = JSON.parse(mkaEltSelected[0].getAttribute('mka-rc-menu-items'));
        menu.forEach(function (item) {
            newMenu += '<li>' + item.title + '</li>';
        });

        newMenu += '</ul></div>';

        mka.innerHTML += newMenu;

        var mkarcmenu = document.getElementById(mkarcmenuId);

        mkarcmenu.style.position = 'absolute';
        mkarcmenu.style.left = event.pageX + 'px';
        mkarcmenu.style.top = event.pageY + 'px';
    }
});

document.body.onmousedown = function () {
    if (document.getElementById(mkarcmenuId)) {
        document.getElementById(mkarcmenuId).remove();
    }
};

var zone = {
    downX: null,
    downY: null,
    upX: null,
    upY: null
};

var selectItem = function selectItem(ctrlKey, isClick) {
    var mkaElts = document.getElementsByClassName("mka-elt");

    var selectedItems = [];

    var isAlreadySelected = false;

    // on parcours chaque elt pour savoir s'ils sont dans la zone selectionné
    Array.from(mkaElts).map(function (elt) {
        var rect = elt.getBoundingClientRect();
        var zoneElt = {
            x1: elt.offsetLeft,
            x2: elt.offsetLeft + rect.width,
            y1: elt.offsetTop,
            y2: elt.offsetTop + rect.height
            // Permet de savoir si la zone de l'elt croise la zone de selection 
        };if (zone.x2 >= zoneElt.x1 && zoneElt.x2 >= zone.x1 && zone.y2 >= zoneElt.y1 && zoneElt.y2 >= zone.y1) {

            // si pour le moment il n'y a pas de eu de déplacement
            if (isClick && elt.classList.contains("mka-elt-selected")) {
                if (ctrlKey) {
                    elt.classList.remove("mka-elt-selected");
                } else {
                    elt.classList.add("mka-elt-selected");
                    selectedItems.push(elt);
                }

                // Le click a eu lieu sur un elt déjà sélectionné on retourn un boulean pour ne pas bind le moove
                isAlreadySelected = true;
            } else {
                elt.classList.add("mka-elt-selected");
                selectedItems.push(elt);
            }
        } else {
            // si la touche ctrl n'est pas appuyée on efface pas
            if (!ctrlKey) {
                elt.classList.remove("mka-elt-selected");
            }
        }
    });

    document.getElementById("mka-count").innerHTML = selectedItems.length;
    return isAlreadySelected;
};

// we add div
var drawSquare = function drawSquare() {
    var node = document.createElement("div");
    node.id = "selection";
    mka.appendChild(node);
    node.style.position = "absolute";
    node.style.backgroundColor = "red";
    return node;
};

var deleteSquare = function deleteSquare() {
    var node = document.getElementById("selection");
    mka.removeChild(node);
};

var orderCoordinate = function orderCoordinate() {
    // we order coordinate to simplify
    zone.x1 = zone.downX;
    zone.x2 = zone.upX;
    zone.y1 = zone.downY;
    zone.y2 = zone.upY;
    // on part vers la gauche
    if (zone.downX > zone.upX) {
        zone.x1 = zone.upX;
        zone.x2 = zone.downX;
    }

    // on part vers le haut
    if (zone.downY > zone.upY) {
        zone.y1 = zone.upY;
        zone.y2 = zone.downY;
    }
};

var refreshSquare = function refreshSquare(node) {
    node.style.top = zone.y1 + "px";
    node.style.left = zone.x1 + "px";

    node.style.width = zone.x2 - zone.x1 + "px";
    node.style.height = zone.y2 - zone.y1 + "px";
};

var activeLasso = function activeLasso() {
    // Lors de la pression sur la souris on bind l'action de déplacement
    mka.onmousedown = function (event) {
        // On démarre la sélection si on utilise le bouton gauche de la souris ou le clic droit
        if (event.which === 1 || event.which === 3) {
            // zone du click
            zone.downX = event.pageX;
            zone.downY = event.pageY;

            var node = drawSquare();

            var startLasso = function startLasso(event, isClick) {
                zone.upX = event.pageX;
                zone.upY = event.pageY;

                orderCoordinate();
                refreshSquare(node);

                return selectItem(event.ctrlKey, isClick);
            };
            // on lance le lasso car il peut ne pas y avoir de mouve
            var isAlreadySelected = startLasso(event, true);

            // Si le down a lieu sur un elt déjà focus on ne peut pas déclancher le moove
            // On démarre le lasso seulement si on utilise le bouton gauche de la souris
            if (!isAlreadySelected && event.which === 1) {
                document.body.onmousemove = function (event) {
                    startLasso(event, false);
                };
            }
        }
    };

    window.onmouseup = function () {
        // Si on relache le cllic (gauche ou droit)
        if (event.which === 1 || event.which === 3) {
            // on unbind le mousemove
            document.body.onmousemove = function () {};
            // on supprime la selection
            deleteSquare();
        }
    };
};

document.onkeydown = function (e) {
    // On peut utiliser les touches du clavier seulement si le menu du click droit est fermé
    if (!document.getElementById(mkarcmenuId)) {

        var code = e.which;
        if (code == 37 || code == 38 || code == 39 || code == 40) {

            // on recupere le dernier elt selectionné dans le DOM
            var selectedArray = document.getElementsByClassName("mka-elt-selected");
            var last = selectedArray[selectedArray.length - 1];

            // si la touche ctrl n'est pas appuyée on efface pas
            if (!event.ctrlKey) {
                // on clean les éléments déjà sélectionné
                var mkaElts = document.getElementsByClassName("mka-elt");
                Array.from(mkaElts).map(function (elt) {
                    elt.classList.remove("mka-elt-selected");
                });
            }

            switch (e.which) {
                case 37:
                    // left
                    console.log("left");
                    break;

                case 38:
                    // up
                    console.log("up");
                    last.previousElementSibling.classList.add("mka-elt-selected");
                    break;
                case 39:
                    // right
                    console.log("right");
                    break;

                case 40:
                    // down
                    last.nextElementSibling.classList.add("mka-elt-selected");
                    break;

                default:
                    return; // exit this handler for other keys
            }
        }
    }
};

activeLasso();

/***/ })
/******/ ]);
//# sourceMappingURL=main.bundle.js.map