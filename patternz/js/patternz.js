(function () {
    var pz = angular.module('pz', [
        'ngRoute'
    ]);

    pz.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/buttons', {
                templateUrl: 'template.html',
                controller: 'PatternzCtrl',
                controllerAs: 'pz'
            })
            .otherwise({redirectTo: '/'});
    }]);

    // Pattern Library
    pz.controller('PatternzCtrl', ['$scope', '$http','$location', 'filterFilter', function ($scope, $http, $location, filterFilter) {

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