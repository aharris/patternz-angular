(function() {
    "use strict";

    var patterns = angular.module('patterns');

    patterns.directive('alert', function(){
        return{
            restrict: 'E',
            scope: true,
            templateUrl: '../patterns/3_components/alerts/alert.html',
            link: function(scope, elem, attrs){
                scope.opt = attrs;
            }
        };
    });

})();
