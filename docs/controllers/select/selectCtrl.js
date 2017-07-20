app.controller('selectCtrl', ['$scope', 'mkaActionsService', function ($scope, mkaService) {

    var vm = this;

    vm.grid = false;
    vm.mkaCountFolders = 'mka-count-folders-select';
    vm.mkaCountItems = 'mka-count-items-select';

    $scope.$on('$includeContentLoaded', function () {
        document.getElementById('select').getElementsByClassName('itemsList').item(0).mkaInit({
            "eltsSelectable": "li",
            "onDragItemClass": "drag-class-sample",
            "dragNdrop": mkaService.drop,
            "droppableElements": ".folders-container .folder",
            "rightClick": mkaService.getContextMenuItems,
            "dbClick": mkaService.dbClick,
            "lasso": true,
            "selectAllShortcut": true,
            "copyPaste": true,
            "deleteShortcut": mkaService.deleteItems,
            "count": vm.mkaCountItems,
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

        document.getElementById('select').getElementsByClassName('folders-container').item(0).mkaInit({
            "eltsSelectable": ".folder",
            "onDragItemClass": "drag-class-sample",
            "dragNdrop": true,
            "rightClick": mkaService.getContextMenuFolders,
            "dbClick": mkaService.dbClick,
            "lasso": true,
            "selectAllShortcut": true,
            "copyPaste": true,
            "deleteShortcut": mkaService.deleteFolders,
            "count": vm.mkaCountFolders,
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
    });

}]);
