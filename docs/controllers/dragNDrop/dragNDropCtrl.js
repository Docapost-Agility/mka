app.controller('dragNDropCtrl', ['$scope', 'mkaActionsService', function ($scope, mkaActionsService) {

    var vm = this;

    vm.grid = false;
    vm.mkaCountFolders = 'mka-count-folders-dragNDrop';
    vm.mkaCountItems = 'mka-count-items-dragNDrop';

    $scope.$on('$includeContentLoaded', function () {

        document.getElementById('dragNDrop').getElementsByClassName('itemsList').item(0).mkaInit({
            "eltsSelectable": "li",
            "onDragItemClass": "drag-class-sample",
            "dragNdrop": mkaActionsService.drop,
            "droppableElements": ".folders-container .folder",
            "lasso": false,
            "selectAllShortcut": false,
            "copyPaste": false,
            "count": vm.mkaCountItems
        });

        document.getElementById('dragNDrop').getElementsByClassName('folders-container').item(0).mkaInit({
            "eltsSelectable": ".folder",
            "onDragItemClass": "drag-class-sample",
            "dragNdrop": true,
            "lasso": false,
            "selectAllShortcut": false,
            "copyPaste": false,
            "count": vm.mkaCountFolders
        });

    });

}]);
