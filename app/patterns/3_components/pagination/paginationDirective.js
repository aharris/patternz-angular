(function() {
    "use strict";

    var patterns = angular.module('patterns');

    patterns.directive('pagination', function(){
        return{
            restrict: 'E',
            scope: true,
            templateUrl: '../patterns/3_components/pagination/pagination.html',
            link: function(scope, elem, attrs){
                scope.opt = attrs;
            }
        };
    });

})();
