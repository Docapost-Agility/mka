app.controller('rightClickCtrl', ['$scope', 'mkaActionsService', function ($scope, mkaActionsService) {

    var vm = this;

    vm.mkaCountFolders = 'mka-count-folders-rightClick';
    vm.mkaCountItems = 'mka-count-items-rightClick';
    vm.showFolders = false;

    $scope.$on('$includeContentLoaded', function () {

        document.getElementById('rightClick').getElementsByClassName('itemsList').item(0).mkaInit({
            "eltsSelectable": "li",
            "rightClick": mkaActionsService.getContextMenuItems,
            "lasso": false,
            "selectAllShortcut": false,
            "copyPaste": false,
            "count": vm.mkaCountItems
        });

    });

}]);
