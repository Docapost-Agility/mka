app.controller('selectCtrl', ['$scope', function ($scope) {

    var vm = this;

    vm.mkaCountFolders = 'mka-count-folders-select';
    vm.mkaCountItems = 'mka-count-items-select';
    vm.showFolders = false;

    $scope.$on('$includeContentLoaded', function () {

        $scope.$on('ngRepeatFilesCompleted', function () {

            document.getElementById('select').getElementsByClassName('itemsList').item(0).mkaInit({
                "eltsSelectable": "li",
                "lasso": true,
                "selectAllShortcut": false,
                "copyPaste": false,
                "count": vm.mkaCountItems,
            });

        });

    });

}]);
