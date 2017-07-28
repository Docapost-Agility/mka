app.controller('selectCtrl', ['$scope', function ($scope) {

    var vm = this;

    vm.mkaCountFolders = 'mka-count-folders-select';
    vm.mkaCountFiles = 'mka-count-files-select';
    vm.showFolders = false;

    $scope.$on('$includeContentLoaded', function () {

        $scope.$on('ngRepeatFilesCompleted', function () {

            document.getElementById('select').getElementsByClassName('files-container').item(0).mkaInit({
                "eltsSelectable": "#select li",
                "lasso": true,
                "selectAllShortcut": false,
                "copyPaste": false,
                "count": vm.mkaCountFiles,
            });

        });

    });

}]);
