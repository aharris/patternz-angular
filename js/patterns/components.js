(function() {
    "use strict";

    var components = angular.module('components', []);

    components.directive('pagination', function(){
        return{
            restrict: 'E',
            scope: true,
            templateUrl: '../patterns/3_components/pagination/pagination.html',
            link: function(scope, elem, attrs){
                scope.opt = attrs;
            }
        };
    });

    components.directive('alert', function(){
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
