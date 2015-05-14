(function() {
    "use strict";

    var patterns = angular.module('patterns');

    patterns.directive('btn', function(){
        return{
            restrict: 'E',
            scope: true,
            templateUrl: '../patterns/2_elements/buttons/button.html',
            link: function(scope, elem, attrs){
                scope.opt = attrs;
            }
        };
    });

})();
