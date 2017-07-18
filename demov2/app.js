console.log('app');
var app = angular.module('app', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            views: {
                'mainView': {
                    templateUrl: 'views/home.html',
                    controller: 'homeCtrl as homeCtrl'
                }
            }
        })
}]);

app.controller('homeCtrl', ['$scope', function () {
    console.log('homeCtrl');
}]);
