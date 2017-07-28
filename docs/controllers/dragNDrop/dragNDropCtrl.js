app.controller('dragNDropCtrl', ['$scope', 'mkaActionsService', function ($scope, mkaActionsService) {

    var vm = this;

    vm.mkaCountFolders = 'mka-count-folders-dragNDrop';
    vm.mkaCountFiles = 'mka-count-files-dragNDrop';
    vm.showFolders = true;

    $scope.$on('$includeContentLoaded', function () {

        $scope.$on('ngRepeatFilesCompleted', function () {

            document.getElementById('dragNDrop').getElementsByClassName('files-container').item(0).mkaInit({
                "eltsSelectable": "#dragNDrop li",
                "onDragItemClass": "drag-class-sample",
                "dragNdrop": mkaActionsService.drop,
                "droppableElements": "#dragNDrop .folders-container .folder",
                "lasso": false,
                "selectAllShortcut": false,
                "copyPaste": false,
                "count": vm.mkaCountFiles
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
