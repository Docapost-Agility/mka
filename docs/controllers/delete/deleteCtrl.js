app.controller('deleteCtrl', ['$scope', 'mkaActionsService', function ($scope, mkaActionsService) {

    var vm = this;

    vm.grid = false;
    vm.mkaCountFolders = 'mka-count-folders-delete';
    vm.mkaCountItems = 'mka-count-items-delete';

    $scope.$on('$includeContentLoaded', function () {

        document.getElementById('delete').getElementsByClassName('itemsList').item(0).mkaInit({
            "eltsSelectable": "li",
            "lasso": true,
            "selectAllShortcut": false,
            "copyPaste": false,
            "count": vm.mkaCountItems,
            "deleteShortcut": mkaActionsService.deleteItems
        });

        document.getElementById('delete').getElementsByClassName('folders-container').item(0).mkaInit({
            "eltsSelectable": ".folder",
            "lasso": true,
            "selectAllShortcut": false,
            "copyPaste": false,
            "count": vm.mkaCountFolders,
            "deleteShortcut": mkaActionsService.deleteFolders
        });

    });

}]);
