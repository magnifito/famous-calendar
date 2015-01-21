'use strict';
var controllername = 'eventController';

module.exports = function(app) {
    /*jshint validthis: true */

    var deps = ['$scope'];

    function controller($scope) {
        var vm = this;
        vm.message = 'Hello World';
        $scope.modalShown = false;
        $scope.toggleModal = function() {
            $scope.modalShown = !$scope.modalShown;
        };
    }

    controller.$inject = deps;
    app.controller(app.name + '.' + controllername, controller);
};