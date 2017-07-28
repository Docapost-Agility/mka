app.controller('dbClickCtrl', ['$scope', 'mkaActionsService', function ($scope, mkaActionsService) {

    var vm = this;

    vm.mkaCountFolders = 'mka-count-folders-dbClick';
    vm.mkaCountFiles = 'mka-count-files-dbClick';
    vm.showFolders = false;

    $scope.$on('$includeContentLoaded', function () {

        $scope.$on('ngRepeatFilesCompleted', function () {

            document.getElementById('dbClick').getElementsByClassName('files-container').item(0).mkaInit({
                "eltsSelectable": "#dbClick li",
                "dbClick": mkaActionsService.dbClick,
                "lasso": false,
                "selectAllShortcut": false,
                "copyPaste": false,
                "count": vm.mkaCountFiles
            });

        });

    });

}]);
