app.controller('deleteCtrl', ['$scope', 'mkaActionsService', function ($scope, mkaActionsService) {

    var vm = this;

    vm.mkaCountFolders = 'mka-count-folders-delete';
    vm.mkaCountFiles = 'mka-count-files-delete';
    vm.showFolders = true;

    $scope.$on('$includeContentLoaded', function () {

        $scope.$on('ngRepeatFilesCompleted', function () {

            document.getElementById('delete').getElementsByClassName('files-container').item(0).mkaInit({
                "eltsSelectable": "#delete li",
                "lasso": true,
                "selectAllShortcut": false,
                "copyPaste": false,
                "count": vm.mkaCountFiles,
                "deleteShortcut": mkaActionsService.deleteItems
            });

        });

        $scope.$on('ngRepeatFoldersCompleted', function () {

            document.getElementById('delete').getElementsByClassName('folders-container').item(0).mkaInit({
                "eltsSelectable": "#delete .folder",
                "lasso": true,
                "selectAllShortcut": false,
                "copyPaste": false,
                "count": vm.mkaCountFolders,
                "deleteShortcut": mkaActionsService.deleteFolders
            });

        });

    });

}]);
