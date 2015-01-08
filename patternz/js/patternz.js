(function () {
    var pz = angular.module('pz', [
        'ngRoute',
        'hljs'
    ]);

    pz.config(function ($routeProvider, hljsServiceProvider) {
        $routeProvider
            .when('/:pattern', {
                templateUrl: 'template.html',
                controller: 'PatternzCtrl',
                controllerAs: 'pz'
            })
            .otherwise({redirectTo: '/'});

        hljsServiceProvider.setOptions({
            // replace tab with 4 spaces
            tabReplace: '    '
        });
    });

    // Pattern Library
    pz.controller('PatternzCtrl', ['$scope', '$http','$location', 'filterFilter', '$anchorScroll', function ($scope, $http, $location, filterFilter, $anchorScroll) {

        $scope.tree = 'foo';

        $http.get('data/tree.json').success(function (data) {
            $scope.tree = data;
            $scope.getCurrentPattern();
        });

        $scope.navActive = false;

        $scope.getCurrentPattern = function () {
            var tree = $scope.tree,
                keys = _.keys(tree);

            $scope.currentPatterns = {};
            for (var i = 0; i < keys.length; i++) {
                var secondKeys = _.keys(tree[keys[i]]);

                for (var j=0; j < secondKeys.length; j++) {

                    if (secondKeys[j] === $location.$$path.substr(1)) {
                        console.log('key: ' + keys[i] + '/' + secondKeys[0]);
                        console.log('path: ' + $location.$$path.substr(1));

                        $scope.currentPatterns = _.values( _.values($scope.tree[keys[i]])[j] );
                        console.log('currentItem: ' + $scope.currentPatterns);
                    }

                }
            }
        };

        $scope.gotoAnchor = function(x) {
          var newHash = 'anchor' + x;
          if ($location.hash() !== newHash) {
            // set the $location.hash to `newHash` and
            // $anchorScroll will automatically scroll to it
            $location.hash(x);
          } else {
            // call $anchorScroll() explicitly,
            // since $location.hash hasn't changed
            $anchorScroll();
          }
        };

    }]);
})();