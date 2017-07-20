app.factory('mkaService', [function () {

    var service = {
        getContextMenuItems: getContextMenuItems
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

    return service;

}]);
