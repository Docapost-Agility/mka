app.controller('longPressCtrl', ['$scope', function ($scope) {

    var vm = this;

    vm.mkaCountFolders = 'mka-count-folders-longPress';
    vm.mkaCountFiles = 'mka-count-files-longPress';
    vm.showFolders = false;

    $scope.$on('$includeContentLoaded', function () {

        $scope.$on('ngRepeatFilesCompleted', function () {

            document.getElementById('longPress').getElementsByClassName('files-container').item(0).mkaInit({
                "eltsSelectable": "#longPress li",
                "lasso": true,
                "selectAllShortcut": false,
                "copyPaste": false,
                "count": vm.mkaCountFiles,
                "longPressDelay": 550
            });

        });

    });

}]);
