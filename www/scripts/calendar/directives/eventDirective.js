'use strict';
var directivename = 'eventDirective';

module.exports = function(app) {

    // controller
    var controllerDeps = [];
    var controller = function() {

    };
    controller.$inject = controllerDeps;

    // directive
    var directiveDeps = [];
    var directive = function() {
        return {
            restrict: 'E',
            scope: {
                show: '=' // '@' reads attribute value, '=' provides 2-way binding, '&" works with functions
            },
            replace: true,
            transclude: true,
            controller: app.name + '.calendarController',
            controllerAs: 'vm',
            template: require('./eventDirective.html'),
            link: function(scope, element, attrs) {
                scope.dialogStyle = {};
                if (attrs.width)
                    scope.dialogStyle.width = attrs.width;
                if (attrs.height)
                    scope.dialogStyle.height = attrs.height;
                scope.hideModal = function() {
                    scope.show = false;
                };
            },
        };
        directive.$inject = directiveDeps;

        app.directive(directivename, directive);
    };
};