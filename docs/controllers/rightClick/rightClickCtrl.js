app.controller('rightClickCtrl', ['$scope', 'mkaActionsService', function ($scope, mkaActionsService) {

    var vm = this;

    vm.grid = false;
    vm.mkaCountFolders = 'mka-count-folders-rightClick';
    vm.mkaCountItems = 'mka-count-items-rightClick';

    $scope.$on('$includeContentLoaded', function () {

        document.getElementById('rightClick').getElementsByClassName('itemsList').item(0).mkaInit({
            "eltsSelectable": "li",
            "rightClick": mkaActionsService.getContextMenuItems,
            "lasso": false,
            "selectAllShortcut": false,
            "copyPaste": false,
            "count": vm.mkaCountItems
        });

        document.getElementById('rightClick').getElementsByClassName('folders-container').item(0).mkaInit({
            "eltsSelectable": ".folder",
            "onDragItemClass": "drag-class-sample",
            "rightClick": mkaActionsService.getContextMenuFolders,
            "lasso": true,
            "selectAllShortcut": true,
            "copyPaste": true,
            "count": vm.mkaCountFolders
        });

    });

}]);
