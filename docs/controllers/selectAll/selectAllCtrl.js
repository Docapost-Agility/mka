app.controller('selectAllCtrl', ['$scope', function ($scope) {

    var vm = this;

    vm.mkaCountFolders = 'mka-count-folders-select-all';
    vm.mkaCountItems = 'mka-count-items-select-all';

    $scope.$on('$includeContentLoaded', function () {

        document.getElementById('selectAll').getElementsByClassName('itemsList').item(0).mkaInit({
            "eltsSelectable": "li",
            "lasso": false,
            "selectAllShortcut": true,
            "copyPaste": false,
            "count": vm.mkaCountItems
        });

        document.getElementById('selectAll').getElementsByClassName('folders-container').item(0).mkaInit({
            "eltsSelectable": ".folder",
            "lasso": false,
            "selectAllShortcut": true,
            "copyPaste": false,
            "count": vm.mkaCountFolders
        });

    });

}]);
