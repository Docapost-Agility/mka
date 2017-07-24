app.controller('dragNDropCtrl', ['$scope', 'mkaActionsService', function ($scope, mkaActionsService) {

    var vm = this;

    vm.mkaCountFolders = 'mka-count-folders-dragNDrop';
    vm.mkaCountItems = 'mka-count-items-dragNDrop';
    vm.showFolders = true;

    $scope.$on('$includeContentLoaded', function () {

        $scope.$on('ngRepeatFilesCompleted', function () {

            document.getElementById('dragNDrop').getElementsByClassName('itemsList').item(0).mkaInit({
                "eltsSelectable": "#dragNDrop li",
                "onDragItemClass": "drag-class-sample",
                "dragNdrop": mkaActionsService.drop,
                "droppableElements": "#dragNDrop .folders-container .folder",
                "lasso": false,
                "selectAllShortcut": false,
                "copyPaste": false,
                "count": vm.mkaCountItems
            });

        });

        $scope.$on('ngRepeatFoldersCompleted', function () {

            document.getElementById('dragNDrop').getElementsByClassName('folders-container').item(0).mkaInit({
                "eltsSelectable": "#dragNDrop .folder",
                "onDragItemClass": "drag-class-sample",
                "dragNdrop": true,
                "lasso": false,
                "selectAllShortcut": false,
                "copyPaste": false,
                "count": vm.mkaCountFolders
            });

        });

    });

}]);
