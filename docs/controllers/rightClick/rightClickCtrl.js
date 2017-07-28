app.controller('rightClickCtrl', ['$scope', 'mkaActionsService', function ($scope, mkaActionsService) {

    var vm = this;

    vm.mkaCountFolders = 'mka-count-folders-rightClick';
    vm.mkaCountItems = 'mka-count-items-rightClick';
    vm.showFolders = true;

    $scope.$on('$includeContentLoaded', function () {

        $scope.$on('ngRepeatFilesCompleted', function () {

            document.getElementById('rightClick').getElementsByClassName('files-container').item(0).mkaInit({
                "eltsSelectable": "#rightClick li",
                "rightClick": mkaActionsService.getContextMenuItems,
                "lasso": false,
                "selectAllShortcut": false,
                "copyPaste": false,
                "count": vm.mkaCountItems
            });

        });

        $scope.$on('ngRepeatFoldersCompleted', function () {

            document.getElementById('rightClick').getElementsByClassName('folders-container').item(0).mkaInit({
                "eltsSelectable": "#rightClick .folder",
                "rightClick": mkaActionsService.getContextMenuFolders,
                "lasso": true,
                "selectAllShortcut": false,
                "copyPaste": false,
                "count": vm.mkaCountFolders
            });

        });

    });

}]);
