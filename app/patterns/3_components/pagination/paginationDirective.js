(function() {
    "use strict";

    var app = angular.module('app');

    app.directive('pagination', function(){
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
