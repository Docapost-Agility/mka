app.controller('homeCtrl', [function () {

    var vm = this;

    vm.grid = false;

    var getContextMenuItems = function (selection) {
        var menu = [];

        menu.push({
            title: "action 1",
            action: function () {
                alert("action 1");
            }
        });
        menu.push({
            title: "action 3",
            action: function () {
                alert("action 3");
            }
        });
        if (selection.length > 1) {
            menu.push({
                title: "action multiple",
                action: function () {
                    alert("action multiple");
                }
            });
        }

        var htmlMenu = document.createElement('ul');

        menu.forEach(function (item) {
            var li = document.createElement('li');
            li.innerHTML = item.title;
            li.onclick = item.action;
            htmlMenu.appendChild(li);
        });

        return htmlMenu;
    }

    var getContextMenuFolders = function (selection) {
        var htmlMenu = '<ul>' +
            '<li onclick="alert(\'action dossier 1\');">action dossier 1</li>' +
            '<li onclick="alert(\'action dossier 3\');">action dossier 3</li>' +
            '</ul>';

        return htmlMenu;
    }

    var dbClick = function (elt) {
        alert('dbclick ' + elt);
    }

    var drop = function (elts, zone) {
        alert('drop ' + elts + ' dropZone ' + zone);
    }

    var deleteItems = function (elements) {
        elements.forEach(function (elt) {
            if (elt.parentNode) {
                elt.parentNode.removeChild(elt);
            }
        })
    }

    var deleteFolders = function (elements) {
        elements.forEach(function (elt) {
            if (elt.parentNode && elt.parentNode.parentNode) {
                elt.parentNode.parentNode.removeChild(elt.parentNode);
            }
        })
    }

    document.getElementById('itemsList').mkaInit({
        "eltsSelectable": "li",
        "onDragItemClass": "drag-class-sample",
        "dragNdrop": drop,
        "droppableElements": ".folders-container .folder",
        "rightClick": getContextMenuItems,
        "dbClick": dbClick,
        "lasso": true,
        "selectAllShortcut": true,
        "copyPaste": true,
        "deleteShortcut": deleteItems,
        "count": "mka-count-items",
        "pasteFunction": function (items) {
            console.log(items);
            var data = [];
            items.forEach(function (elt) {
                console.log(elt.getAttribute("item-id"));
                data.push(elt.getAttribute("item-id"));
            });
            console.group("Call WS with :");
            console.group(data);
            console.groupEnd();
        }
        // "dropFunction" : function(ids) {
        //     console.log(ids);
        //     console.log("drop du client");
        // }
    });

    document.getElementsByClassName('folders-container').item(0).mkaInit({
        "eltsSelectable": ".folder",
        "onDragItemClass": "drag-class-sample",
        "dragNdrop": true,
        "rightClick": getContextMenuFolders,
        "dbClick": dbClick,
        "lasso": true,
        "selectAllShortcut": true,
        "copyPaste": true,
        "deleteShortcut": deleteFolders,
        "count": "mka-count-folders",
        "pasteFunction": function (items) {
            console.log(items);
            var data = [];
            items.forEach(function (elt) {
                console.log(elt.getAttribute("item-id"));
                data.push(elt.getAttribute("item-id"));
            });
            console.group("Call WS with :");
            console.group(data);
            console.groupEnd();
        }
        // "dropFunction" : function(ids) {
        //     console.log(ids);
        //     console.log("drop du client");
        // }
    });

}]);
