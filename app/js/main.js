(function () {
   "use strict";

    var app = angular.module('app', [
        'ngRoute',
        'patterns',
        'library'
    ]);

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .otherwise({redirectTo: '/'});
    }]);

    // Main App
    app.controller('AppCtrl', ['$scope', function ($scope) {

        $scope.data = {
            title: 'Patternz'
        };

    }]);


})();
