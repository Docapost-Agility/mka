app.controller('selectCtrl', ['$scope', function ($scope) {

    var vm = this;

    vm.mkaCountFolders = 'mka-count-folders-select';
    vm.mkaCountItems = 'mka-count-items-select';

    $scope.$on('$includeContentLoaded', function () {

        document.getElementById('select').getElementsByClassName('itemsList').item(0).mkaInit({
            "eltsSelectable": "li",
            "lasso": true,
            "selectAllShortcut": false,
            "copyPaste": false,
            "count": vm.mkaCountItems,
        });

        document.getElementById('select').getElementsByClassName('folders-container').item(0).mkaInit({
            "eltsSelectable": ".folder",
            "lasso": true,
            "selectAllShortcut": false,
            "copyPaste": false,
            "count": vm.mkaCountFolders,
        });

    });

}]);
