app.controller('copyPasteCtrl', ['$scope', 'mkaActionsService', function ($scope, mkaActionsService) {

    var vm = this;

    vm.mkaCountFolders = 'mka-count-folders-copyPaste';
    vm.mkaCountFiles = 'mka-count-files-copyPaste';
    vm.showFolders = true;

    $scope.$on('$includeContentLoaded', function () {

        $scope.$on('ngRepeatFilesCompleted', function () {

            document.getElementById('copyPaste').getElementsByClassName('files-container').item(0).mkaInit({
                "eltsSelectable": "#copyPaste li",
                "lasso": false,
                "selectAllShortcut": false,
                "copyPaste": true,
                "count": vm.mkaCountFiles,
                "pasteFunction": mkaActionsService.pasteFunction
            });

        });

        $scope.$on('ngRepeatFoldersCompleted', function () {

            document.getElementById('copyPaste').getElementsByClassName('folders-container').item(0).mkaInit({
                "eltsSelectable": "#copyPaste .folder",
                "lasso": false,
                "selectAllShortcut": false,
                "copyPaste": true,
                "count": vm.mkaCountFolders,
                "pasteFunction": mkaActionsService.pasteFunction
            });

        });

    });

}]);
