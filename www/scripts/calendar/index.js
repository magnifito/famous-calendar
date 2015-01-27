'use strict';
require('angular-ui-router');
require('famous-angular');
require('ngCordova');
require('sugarjs');

var modulename = 'calendar';

module.exports = function(namespace) {

    var fullname = namespace + '.' + modulename;

    var angular = require('angular');
    var app = angular.module(fullname, ['ui.router', 'famous.angular', 'ngCordova']);
    // inject:folders start
    require('./controllers')(app);
    require('./directives')(app);
    require('./services')(app);

    // inject:folders end

    app.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
            $stateProvider.state('home', {
                url: '/',
                template: require('./views/home.html'),
                controller: fullname + '.calendarController',
                controllerAs: 'self'
            });
        }
    ]);
    
    return app;
};