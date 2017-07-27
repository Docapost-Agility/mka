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
            title: "Action file 1",
            action: function () {
                alert("Action file 1");
            }
        });
        menu.push({
            title: "Action file 3",
            action: function () {
                alert("Action file 3");
            }
        });
        if (selection.length > 1) {
            menu.push({
                title: "Multiple action for files",
                action: function () {
                    alert("Multiple action for files");
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

    function getContextMenuFolders() {
        return '<ul>' +
            '<li onclick="alert(\'Action folder 1\');">Action folder 1</li>' +
            '<li onclick="alert(\'Action folder 3\');">Action folder 3</li>' +
            '</ul>';
    }

    function dbClick(elt) {
        alert('dbclick ' + elt);
    }

    function drop(elts, zone) {
        var alertMessage = 'You have drop on "' + zone.getElementsByTagName('h5')[0]['innerText'] + '" folder:\n';

        elts.forEach(function (elt) {
            alertMessage += '- ' + elt.getElementsByTagName('h6')[0]['innerText'] + '\n';
        })

        alert(alertMessage);
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
