app.controller('dbClickCtrl', ['$scope', 'mkaActionsService', function ($scope, mkaActionsService) {

    var vm = this;

    vm.grid = false;
    vm.mkaCountFolders = 'mka-count-folders-dbClick';
    vm.mkaCountItems = 'mka-count-items-dbClick';

    $scope.$on('$includeContentLoaded', function () {

        document.getElementById('dbClick').getElementsByClassName('itemsList').item(0).mkaInit({
            "eltsSelectable": "li",
            "dbClick": mkaActionsService.dbClick,
            "lasso": false,
            "selectAllShortcut": false,
            "copyPaste": false,
            "count": vm.mkaCountItems
        });

        document.getElementById('dbClick').getElementsByClassName('folders-container').item(0).mkaInit({
            "eltsSelectable": ".folder",
            "dbClick": mkaActionsService.dbClick,
            "lasso": false,
            "selectAllShortcut": false,
            "copyPaste": false,
            "count": vm.mkaCountFolders
        });

    });

}]);
