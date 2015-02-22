(function () {
    'use strict';

    var lib = angular.module('library', [
        'ngRoute',
        'hljs'
    ]);

    lib.config(function ($routeProvider, hljsServiceProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'overview.html',
                controller: 'LibCtrl',
                controllerAs: 'lib'
            })
            .when('/:pattern', {
                templateUrl: 'template.html',
                controller: 'LibCtrl',
                controllerAs: 'lib'
            })
            .otherwise({redirectTo: '/'});

        hljsServiceProvider.setOptions({
            // replace tab with 4 spaces
            tabReplace: '    '
        });
    });

    // Pattern Library
    lib.controller('LibCtrl', ['$scope', '$http','$location', 'filterFilter', '$anchorScroll', function ($scope, $http, $location, filterFilter, $anchorScroll) {

        $scope.tree = {};

        $scope.patternGroup = '_';

        $http.get('../library/data/tree.json').success(function (data) {
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
                        $scope.currentPatterns = _.values( _.values($scope.tree[keys[i]])[j] );
                        var thirdKeys = _.keys(tree[keys[i]][secondKeys[j]]);
                        for (var k = 0; k < thirdKeys.length; k++) {
                            $scope.shortPath[k] = thirdKeys[k].replace(/\.[^/.]+$/, "");
                            $scope.patternTitle[k] = $scope.shortPath[k].replace(/_/, " ");
                            $scope.path[$scope.shortPath[k]] = 'patterns/' + tree[ keys[i] ][ secondKeys[j] ][thirdKeys[k]];

                            generateHtmlMarkup($scope.shortPath[k], k);

                            $scope.patternData = '../' + $scope.path[$scope.shortPath[k]].replace(".html", ".json");
                        }
                    }
                }
            }

            $http.get($scope.patternData).success(function (data) {
                $scope.parseJSONdata(data);
            })
            .error(function () {
                console.log('Pattern has no JSON data!');
            });

        };

        $scope.parseJSONdata = function (data) {
            $scope.patternGroup = data.name;
            $scope.opts = data.allOptions;
            $scope.examples = data.examples;
            $scope.hideMarkup = data.hideMarkup;

            generateUsageMarkup(data.tag);
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

        // data - Partial html file
        // idx - the index of the current pattern being iterated
        function generateHtmlMarkup(shortPath, idx) {
            // debugger;
            var lines,
                markupPath = $scope.path[shortPath];

            $http.get('../' + markupPath).success(function (data) {

                showAllOptions(idx, data);

                lines = data.split("\n").join("\n\n");
                $scope.htmlMarkup = lines;
                // $scope.htmlMarkup[idx] = lines;
            });

        }

        // Params:
        // opts - array of options passed in the partial html file
        // tag - name of the custom tag from JSON
        // idx - the index of the current pattern being iterated
        function generateUsageMarkup(tag) {
            var attr,
                ngTemplate,
                optString = '',
                optKey = '',
                optVal,
                optComment;

            if($scope.opts) {

                for (var i = 0; i < $scope.opts.length; i++) {
                    optKey = Object.keys($scope.opts[i])[0];
                    optVal = $scope.opts[i][optKey].val;
                    optComment = $scope.opts[i][optKey].comment ? ' // ' + $scope.opts[i][optKey].comment : '';

                    // optString += optKey + '="' + optVal + '" ' + optComment;
                    optString += optKey + '="' + optVal + '" ';

                }

                attr = $scope.opts ? optString : '';
                ngTemplate = '<' + tag + ' ' + attr +'"></' + tag + '>';
            } else {
                ngTemplate = '<' + tag + '></' + tag + '>';
            }

            $scope.ngMarkup = ngTemplate;
        }

        //Params:
        // idx - the index of the current pattern being iterated
        // data - Partial html file
        function showAllOptions(idx, data) {
            var conditionalOpts = data.match(/ng-if="opt.\w*/g) || null;
            if (conditionalOpts === null) {
                if ($scope.conditionalOpts) {
                    $scope.conditionalOpts[idx] = false;
                }
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
