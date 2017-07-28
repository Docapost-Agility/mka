app.controller('selectAllCtrl', ['$scope', function ($scope) {

    var vm = this;

    vm.mkaCountFolders = 'mka-count-folders-select-all';
    vm.mkaCountFiles = 'mka-count-files-select-all';
    vm.showFolders = false;

    $scope.$on('$includeContentLoaded', function () {

        $scope.$on('ngRepeatFilesCompleted', function () {

            document.getElementById('selectAll').getElementsByClassName('files-container').item(0).mkaInit({
                "eltsSelectable": "#selectAll li",
                "lasso": false,
                "selectAllShortcut": true,
                "copyPaste": false,
                "count": vm.mkaCountFiles
            });

        });

    });

}]);
