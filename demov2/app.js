console.log('app');
var app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: "views/home.html",
            controller: "homeCtrl as homeCtrl"
        })
        .otherwise({
            redirectTo: '/home'
        })
}]);

app.controller('homeCtrl', ['$scope', function () {
    console.log('homeCtrl');
}]);
