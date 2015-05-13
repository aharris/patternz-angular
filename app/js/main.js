(function () {
   "use strict";

   var angular = require('angular');

    var app = angular.module('app', [
        require('angular-ui-router'),
        'library',
    ]);

    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("overview");

        $stateProvider

            .state('library/overview', {
              url: "/overview",
              templateUrl: "overview.html"
            })

            .state('library/template', {
              url: "/{key}",
              templateUrl: "template.html",
            })

            .state('partyDetail', {
                url: '/party/:partyID/:partyLocation',
                controller: function($scope, $stateParams) {
                    // get the id
                    $scope.id = $stateParams.partyID;

                    // get the location
                    $scope.location = $stateParams.partyLocation;
                }
            });

    }]);

    // Main App
    app.controller('AppCtrl', ['$scope', function ($scope) {

        $scope.data = {
            title: 'This is your main application.'
        };

    }]);


})();
