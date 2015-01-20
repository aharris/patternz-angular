(function () {
    'use strict';

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

        $scope.patternGroup = '_';

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
                        $scope.currentPatterns = _.values( _.values($scope.tree[keys[i]])[j] );
                        var thirdKeys = _.keys(tree[keys[i]][secondKeys[j]]);
                        for (var k = 0; k < thirdKeys.length; k++) {
                            $scope.shortPath[k] = thirdKeys[k].replace(/\.[^/.]+$/, "");
                            $scope.patternTitle[k] = $scope.shortPath[k].replace(/_/, " ");
                            $scope.path[$scope.shortPath[k]] = 'patterns/' + tree[ keys[i] ][ secondKeys[j] ][thirdKeys[k]];
                            $scope.parsePatternDoc(k, $scope.shortPath[k]);
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

        $scope.parsePatternDoc = function(idx, shortPath) {
            $http.get('../' + $scope.path[shortPath].replace(/.html/, ".md") ).success(function (data) {
                var mdContent = data.split('---'),
                    docSections;

                if (mdContent.length <= 1) {
                    return;
                }

                docSections = mdContent[1].split("\n\n");

                generateUsageMarkup(shortPath, idx);
                generateHtmlMarkup(shortPath, idx);

            });
        };

        // data - Partial html file
        // idx - the index of the current pattern being iterated
        function generateHtmlMarkup(shortPath, idx) {
            var lines,
                markupPath = $scope.path[shortPath].replace(/.md/, ".html");

            $http.get('../tmp/' + markupPath).success(function (data) {

                showAllOptions(idx, data);

                lines = data.split("\n").join("\n\n");
                $scope.htmlMarkup = $scope.htmlMarkup || {};
                $scope.htmlMarkup[idx] = lines;
            });

        }

        // Params:
        // opts - array of options passed in the partial html file
        // shortPath - name of the html file to be included
        // idx - the index of the current pattern being iterated
        function generateUsageMarkup(shortPath, idx) {
            var ngRepeat,
                ngTemplate,
                optString = '',
                optKey = '',
                optVal,
                optComment;

            if(!$scope.opts) {return false;}

            for (var i = 0; i < $scope.opts.length; i++) {
                optKey = Object.keys($scope.opts[i])[0];
                optVal = $scope.opts[i][optKey].val;
                optComment = $scope.opts[i][optKey].comment ? ' // ' + $scope.opts[i][optKey].comment : '';

                if (i === $scope.opts.length - 1 ) {
                    optString += optKey + ':' + optVal + optComment;
                } else {
                    optString += optKey + ':' + optVal + ',' + optComment + '\n';
                }
            }

            ngRepeat = $scope.opts ? '" ng-repeat="opt in [{\n' + optString +'\n}]' : '';
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