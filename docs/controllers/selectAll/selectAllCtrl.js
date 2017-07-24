app.controller('selectAllCtrl', ['$scope', function ($scope) {

    var vm = this;

    vm.mkaCountFolders = 'mka-count-folders-select-all';
    vm.mkaCountItems = 'mka-count-items-select-all';
    vm.showFolders = false;

    $scope.$on('$includeContentLoaded', function () {

        $scope.$on('ngRepeatFilesCompleted', function () {

            document.getElementById('selectAll').getElementsByClassName('itemsList').item(0).mkaInit({
                "eltsSelectable": "li",
                "lasso": false,
                "selectAllShortcut": true,
                "copyPaste": false,
                "count": vm.mkaCountItems
            });

        });

    });

}]);
