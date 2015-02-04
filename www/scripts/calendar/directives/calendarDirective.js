'use strict';
var directivename = 'calendarDirective';

module.exports = function(app) {

    // directive
    var directiveDeps = [];
    var directive = function() {
        return {
            restrict: 'AE',
            scope: {
                events: '@',
                names: '@'
            },
            controller: app.name + '.calendarController',
            controllerAs: 'calCtrl',
            //bindToController: true,
            template: require('./calendarDirective.html'),
            link: function(scope, element, attrs, calCtrl) {
                calCtrl.init(element);
            }
        };
    };
    directive.$inject = directiveDeps;

    app.directive(directivename, directive);

};
