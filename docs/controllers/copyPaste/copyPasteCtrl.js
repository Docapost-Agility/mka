app.controller('copyPasteCtrl', ['$scope', 'mkaActionsService', function ($scope, mkaActionsService) {

    var vm = this;

    vm.mkaCountFolders = 'mka-count-folders-dragNDrop';
    vm.mkaCountItems = 'mka-count-items-dragNDrop';
    vm.showFolders = true;

    $scope.$on('$includeContentLoaded', function () {

        $scope.$on('ngRepeatFilesCompleted', function () {

            document.getElementById('copyPaste').getElementsByClassName('itemsList').item(0).mkaInit({
                "eltsSelectable": "li",
                "lasso": false,
                "selectAllShortcut": false,
                "copyPaste": true,
                "count": vm.mkaCountItems,
                "pasteFunction": mkaActionsService.pasteFunction
            });

        });

        $scope.$on('ngRepeatFoldersCompleted', function () {

            document.getElementById('copyPaste').getElementsByClassName('folders-container').item(0).mkaInit({
                "eltsSelectable": ".folder",
                "lasso": false,
                "selectAllShortcut": false,
                "copyPaste": true,
                "count": vm.mkaCountFolders,
                "pasteFunction": mkaActionsService.pasteFunction
            });

        });

    });

}]);
