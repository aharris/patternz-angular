(function () {
    var pz = angular.module('pz', [
        'ngRoute',
        'hljs'
    ]);

    pz.config(function ($routeProvider, hljsServiceProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'overview.html',
                controller: 'PatternzCtrl',
                controllerAs: 'pz'
            })
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

        // Files included here will not have markup in docs
        $scope.noMarkup = {
            colors: true,
            grids: true,
            typography: true
        };

        $scope.tree = {};

        $http.get('data/tree.json').success(function (data) {
            $scope.tree = data;
            $scope.getCurrentPattern();
        });

        $scope.navActive = false;

        $scope.getCurrentPattern = function () {
            var tree = $scope.tree,
                keys = _.keys(tree);

            $scope.currentPatterns = {};
            $scope.path = {};
            $scope.patternTitle = [];
            $scope.shortPath = [];

            for (var i = 0; i < keys.length; i++) {
                var secondKeys = _.keys(tree[keys[i]]);
                for (var j=0; j < secondKeys.length; j++) {
                    if (secondKeys[j] === $location.$$path.substr(1)) {
                        $scope.patternGroup = secondKeys[j];
                        $scope.currentPatterns = _.values( _.values($scope.tree[keys[i]])[j] );
                        var thirdKeys = _.keys(tree[keys[i]][secondKeys[j]]);
                        for (var k = 0; k < thirdKeys.length; k++) {
                            $scope.shortPath[k] = thirdKeys[k].replace(/\.[^/.]+$/, "");

                            $scope.patternTitle[k] = $scope.shortPath[k].replace(/_/, " ");
                            $scope.path[$scope.shortPath[k]] = 'patterns/' + tree[ keys[i] ][ secondKeys[j] ][thirdKeys[k]];
                            $scope.createMarkup(k, $scope.shortPath[k]);
                        }
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

        //Params:
        // idx - the index of the current pattern being iterated
        // shortPath - name of the html file to be included
        $scope.createMarkup = function(idx, shortPath) {
            $http.get('../' + $scope.path[shortPath]).success(function (data) {
                var opts = data.match(/opt.\w*/g) || '',
                    optArray = [];

                showAllOptions(idx, data);

                $scope.opts = {};
                $scope.opts[idx] = '';

                for (var i = 0; i < opts.length; i++) {
                    var opt = opts[i].split('.').splice(1);

                    //If key exists already don't add it again
                    if (optArray.indexOf(opt[0]) > -1) {
                        continue;
                    }
                    optArray.push(opt[0]);

                    if (i === 0) {
                        $scope.opts[idx] += opt[0] + ': "string' + i + '"';
                    } else {
                        $scope.opts[idx] += ', ' + opt[0] + ': "string' + i + '"';
                    }
                }

                generateUsageMarkup(opts, shortPath, idx);
                generateHtmlMarkup(data, idx);
            });
        };

        // data - Partial html file
        // idx - the index of the current pattern being iterated
        function generateHtmlMarkup(data, idx) {
            var lines;

            lines = data.split("\n").join("\n\n");
            $scope.htmlMarkup = $scope.htmlMarkup || {};
            $scope.htmlMarkup[idx] = lines;

        }

        //Params:
        // opts - array of options passed in the partial html file
        // shortPath - name of the html file to be included
        // idx - the index of the current pattern being iterated
        function generateUsageMarkup(opts, shortPath, idx) {
            var ngRepeat,
                ngTemplate;

            ngRepeat = opts ? '" ng-repeat="opt in [{' + $scope.opts[idx] +'}]' : '';
            ngTemplate = '<ng-include src="path.' + shortPath + ngRepeat +'"></ng-include>';

            $scope.ngMarkup = $scope.ngMarkup || {};
            $scope.ngMarkup[idx] = ngTemplate;
        }

        //Params:
        // idx - the index of the current pattern being iterated
        // data - Partial html file
        function showAllOptions(idx, data) {
            var conditionalOpts = data.match(/ng-if="opt.\w*/g) || null;
            if (conditionalOpts === null) {
                $scope.conditionalOpts[idx] = false;
                return false;
            }
            var optsObj = optsObj || {};

            optsObj[idx] = optsObj[idx] || [];

            for (var i = 0; i < conditionalOpts.length; i++) {
                var opt = conditionalOpts[i].split('.').splice(1);
                optsObj[idx].push(_.object([opt[0]], [true]));
            }

            $scope.conditionalOpts = $scope.conditionalOpts || {};
            $scope.conditionalOpts[idx] = _.uniq(optsObj[idx]);
        }

    }]);
})();