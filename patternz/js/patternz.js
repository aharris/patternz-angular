(function () {
    var app = window.app;

    app.controller('PatternzCtrl', ['$scope', '$http', function ($scope, $http) {

        $scope.tree = 'foo';

        $http.get('data/tree.json').success(function (data) {
            $scope.tree = data;
            console.log(data);
        });
    }]);
})();