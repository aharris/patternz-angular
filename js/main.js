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
    app.controller('AppCtrl', ['$scope', '$http', function ($scope, $http) {

        $scope.data = {
            title: 'Patternz'
        };

        // $http.get('library/data/tree.json').success(function (data) {
        //     $scope.mapData = data;
        //     $scope.createPatternMap();
        // });

        // $scope.createPatternMap = function () {
        //     var mapData = $scope.mapData,
        //         keys = _.keys(mapData);

        //     $scope.path = {};

        //     for (var i = 0; i < keys.length; i++) {
        //         var secondKeys = _.keys(mapData[keys[i]]);
        //         for (var j = 0; j < secondKeys.length; j++ ) {
        //             var thirdKeys = _.keys(mapData[keys[i]][secondKeys[j]]);
        //             for (var k = 0; k < thirdKeys.length; k++) {
        //                 var shortPath = thirdKeys[k].replace(/\.[^/.]+$/, "");

        //                 var convertedPath = mapData[ keys[i] ][ secondKeys[j] ][thirdKeys[k]].replace(/.md/, ".html");
        //                 $scope.shortPath = shortPath;
        //                 $scope.path[shortPath] = 'patterns/' + convertedPath;
        //             }
        //         }
        //     }
        // };

    }]);


})();
