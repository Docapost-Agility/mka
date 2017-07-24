app.factory('mkaActionsService', [function () {

    var service = {
        dbClick: dbClick,
        deleteFolders: deleteFolders,
        deleteItems: deleteItems,
        drop: drop,
        getContextMenuFolders: getContextMenuFolders,
        getContextMenuItems: getContextMenuItems,
        pasteFunction: pasteFunction
    }

    function getContextMenuItems(selection) {
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

    function getContextMenuFolders(selection) {
        var htmlMenu = '<ul>' +
            '<li onclick="alert(\'action dossier 1\');">action dossier 1</li>' +
            '<li onclick="alert(\'action dossier 3\');">action dossier 3</li>' +
            '</ul>';

        return htmlMenu;
    }

    function dbClick(elt) {
        alert('dbclick ' + elt);
    }

    function drop(elts, zone) {
        alert('drop ' + elts + ' dropZone ' + zone);
    }

    function deleteItems(elements) {
        elements.forEach(function (elt) {
            if (elt.parentNode) {
                elt.parentNode.removeChild(elt);
            }
        })
    }

    function deleteFolders(elements) {
        elements.forEach(function (elt) {
            if (elt.parentNode && elt.parentNode.parentNode) {
                elt.parentNode.parentNode.removeChild(elt.parentNode);
            }
        })
    }
    
    function pasteFunction(items) {
        console.log(items);
    }

    return service;

}]);
