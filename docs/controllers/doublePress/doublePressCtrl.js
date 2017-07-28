app.controller('doublePressCtrl', ['$scope', function ($scope) {

    var vm = this;

    vm.mkaCountFiles = 'mka-count-files-doublePress';
    vm.showFolders = false;

    $scope.$on('$includeContentLoaded', function () {

        $scope.$on('ngRepeatFilesCompleted', function () {

            document.getElementById('doublePress').getElementsByClassName('files-container').item(0).mkaInit({
                "eltsSelectable": "#doublePress li",
                "lasso": true,
                "selectAllShortcut": false,
                "copyPaste": false,
                "count": vm.mkaCountFiles,
                "dbClickDelay": 400
            });

        });

    });

}]);
