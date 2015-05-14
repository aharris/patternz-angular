(function () {
   "use strict";

   var angular = require('angular');

    var app = angular.module('app', [
        require('angular-ui-router'),
        'patterns'
    ]);

    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        // $urlRouterProvider.otherwise("overview");

        // $stateProvider

        //     .state('library/overview', {
        //       url: "/overview",
        //       templateUrl: "overview.html"
        //     })

        //     .state('library/template', {
        //       url: "/{key}",
        //       templateUrl: "template.html",
        //     })

    }]);

    // Main App
    app.controller('AppCtrl', ['$scope', function ($scope) {

        $scope.data = {
            title: 'This is your main application.'
        };

    }]);


})();
