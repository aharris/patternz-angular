(function () {
    window.app = angular.module('app', []);
    var app = window.app;

    app.config(function () {

    });

    app.controller('AppCtrl', ['$scope', function ($scope) {

        $scope.data = {
            title: 'yo dawg'
        };

        // function text(val) {
        //     $scope.data.text = val;
        // }

    }]);
})();