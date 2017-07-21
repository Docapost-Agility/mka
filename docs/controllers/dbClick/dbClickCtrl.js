app.controller('dbClickCtrl', ['$scope', 'mkaActionsService', function ($scope, mkaActionsService) {

    var vm = this;

    vm.mkaCountFolders = 'mka-count-folders-dbClick';
    vm.mkaCountItems = 'mka-count-items-dbClick';
    vm.showFolders = false;

    $scope.$on('$includeContentLoaded', function () {

        document.getElementById('dbClick').getElementsByClassName('itemsList').item(0).mkaInit({
            "eltsSelectable": "li",
            "dbClick": mkaActionsService.dbClick,
            "lasso": false,
            "selectAllShortcut": false,
            "copyPaste": false,
            "count": vm.mkaCountItems
        });

    });

}]);
