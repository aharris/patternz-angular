(function () {
   "use strict";

   var angular = require('angular');
   var ngRoute = require('angular-route');

    var app = angular.module('app', [
        'ngRoute',
        'library'
    ]);

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider

            .when('#library/', {
                templateUrl: 'library/overview.html',
                controller: 'LibCtrl',
                controllerAs: 'lib'
            })

            .when('/library/:pattern', {
                templateUrl: 'library/template.html',
                controller: 'LibCtrl',
                controllerAs: 'lib'
            })

            .otherwise({redirectTo: '/'});

        // hljsServiceProvider.setOptions({
        //     // replace tab with 4 spaces
        //     tabReplace: '    '
        // });
    }]);

    // Main App
    app.controller('AppCtrl', ['$scope', function ($scope) {

        $scope.data = {
            title: 'Patternz'
        };

    }]);


})();
