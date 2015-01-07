(function () {
    var app = angular.module('app', [
        'ngRoute'
    ]);

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            // .when('/', {
            //     templateUrl: 'template.html',
            //     controller: 'PatternzCtrl',
            //     controllerAs: 'pat'
            // })
            .when('/buttons', {
                templateUrl: 'template.html',
                controller: 'PatternzCtrl',
                controllerAs: 'pz'
            })
            .otherwise({redirectTo: '/'});
    }]);

    // Main App
    app.controller('AppCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {

        $scope.data = {
            title: 'Patternz'
        };

        $http.get('patternz/data/tree.json').success(function (data) {
            $scope.mapData = data;
            $scope.createPatternMap();
        });

        $scope.createPatternMap = function () {
            var mapData = $scope.mapData,
                keys = _.keys(mapData);

            $scope.path = {};

            for (var i = 0; i < keys.length; i++) {
                var secondKeys = _.keys(mapData[keys[i]]);
                for (var j = 0; j < secondKeys.length; j++ ) {
                    var thirdKeys = _.keys(mapData[keys[i]][secondKeys[j]]);
                    for (var k = 0; k < thirdKeys.length; k++) {
                        var shortPath = thirdKeys[k].replace(/\.[^/.]+$/, "");
                        $scope.path[shortPath] = 'patterns/' + mapData[ keys[i] ][ secondKeys[j] ][thirdKeys[k]];
                    }
                }
            }
            // console.log($scope.path);
        };

    }]);


    // Pattern Library
    app.controller('PatternzCtrl', ['$scope', '$http','$location', 'filterFilter', function ($scope, $http, $location, filterFilter) {

        $scope.tree = 'foo';

        $http.get('data/tree.json').success(function (data) {
            $scope.tree = data;
            // console.log(data);

            $scope.getCurrentPattern();
        });

        $scope.getCurrentPattern = function () {
            var tree = $scope.tree,
                keys = _.keys(tree);

            // console.log(keys);
            $scope.currentPatterns = {};
            for (var i = 0; i < keys.length; i++) {
                var secondKey = _.keys(tree[keys[i]]);

                if (secondKey[0] === $location.$$path.substr(1)) {
                    $scope.currentPatterns = _.values( _.values($scope.tree[keys[i]])[0] );
                    // console.log('currentItem: ' + $scope.currentPatterns);
                }
                // console.log('key: ' + keys[i] + '/' + secondKey[0]);
                // console.log('path: ' + $location.$$path.substr(1));
            }
        };

    }]);
})();