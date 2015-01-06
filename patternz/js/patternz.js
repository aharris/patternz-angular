(function () {
    var app = window.app;
    // debugger;
    // app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    //     $routeProvider
    //         .when('patternz/styleguide.html/', {
    //             templateUrl: '../template.html',
    //             controller: 'PatternzCtrl',
    //             controllerAs: 'pat'
    //         })
    //         .when('patternz/styleguide.html//buttons', {
    //             templateUrl: '../template.html',
    //             controller: 'PatternzCtrl',
    //             controllerAs: 'pat'
    //         });
    // }]);

    var routes = angular.module('routes', []);

    routes.config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('patternz/styleguide.html/', {
                templateUrl: '../template.html',
                controller: 'PatternzCtrl',
                controllerAs: 'pat'
            })
            .when('patternz/styleguide.html//buttons', {
                templateUrl: '../template.html',
                controller: 'PatternzCtrl',
                controllerAs: 'pat'
            });
    }]);

    app.controller('PatternzCtrl', ['$scope', '$http', function ($scope, $http) {

        $scope.tree = 'foo';

        $http.get('data/tree.json').success(function (data) {
            $scope.tree = data;
            console.log(data);
        });
    }]);
})();