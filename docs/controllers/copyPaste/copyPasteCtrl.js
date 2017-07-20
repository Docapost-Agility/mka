app.controller('copyPasteCtrl', ['$scope', 'mkaActionsService', function ($scope, mkaActionsService) {

    var vm = this;

    vm.grid = false;
    vm.mkaCountFolders = 'mka-count-folders-dragNDrop';
    vm.mkaCountItems = 'mka-count-items-dragNDrop';

    $scope.$on('$includeContentLoaded', function () {

        document.getElementById('copyPaste').getElementsByClassName('itemsList').item(0).mkaInit({
            "eltsSelectable": "li",
            "lasso": false,
            "selectAllShortcut": false,
            "copyPaste": true,
            "count": vm.mkaCountItems,
            "pasteFunction": mkaActionsService.pasteFunction
        });

        document.getElementById('copyPaste').getElementsByClassName('folders-container').item(0).mkaInit({
            "eltsSelectable": ".folder",
            "lasso": false,
            "selectAllShortcut": false,
            "copyPaste": true,
            "count": vm.mkaCountFolders,
            "pasteFunction": mkaActionsService.pasteFunction
        });

    });

}]);
