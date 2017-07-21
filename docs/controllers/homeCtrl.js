app.controller('homeCtrl', ['$scope', 'angularLoad', function ($scope, angularLoad) {

    $scope.$on('$includeContentLoaded', function () {
        angularLoad.loadScript('js/prism.js');
    });

}]);
