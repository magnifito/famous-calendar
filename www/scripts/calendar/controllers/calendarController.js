'use strict';
var controllername = 'calendarController';

module.exports = function(app) {
    /*jshint validthis: true */

    var deps = ['$scope', '$compile', '$timeout', '$famous', app.name + '.calendarService', app.name + '.famousHelper'];

    function controller($scope, $compile, $timeout, $famous, calendarService, famousHelper) {
        var vm = this;
        var Transitionable = $famous['famous/transitions/Transitionable'];
        var Easing = $famous['famous/transitions/Easing'];
        var Modifier = $famous["famous/core/Modifier"];
        var Lightbox = $famous['famous/views/Lightbox'];
        var Engine = $famous['famous/core/Engine'];
        var Surface = $famous['famous/core/Surface'];
        var Transform = $famous['famous/core/Transform'];
        var FastClick = $famous['famous/inputs/FastClick'];
        // popup options

        $scope.otherDays = function(day) {
            if (day.outmonth) {
                return 'cal-day-outmonth';
            } else if (day.day == 6 || day.day == 7) {
                return 'cal-day-weekend';
            } else if(day.isToday) {
                return 'cal-day-today';
            }
        }

        var context = Engine.createContext();
        var modal = new Surface({
            size: [300, 300],
            properties: {
                backgroundColor: 'skyblue',
                color: 'black',
            }

        })

        modal.on('click', function() {
            hideModal()
        });

        modal.lightbox = new Lightbox({
            inTransform: Transform.translate(0, 500, 0),
            outTransform: Transform.translate(0, 500, 0),
            inTransition: {
                duration: 500,
                curve: Easing.outElastic
            },
            outTransition: {
                duration: 200,
                curve: Easing.inOutQuad
            },
        });

        context.add(new Modifier({
            origin: [0.5, 0.5]
        })).add(modal.lightbox);

        function hideModal() {
            modal.lightbox.hide();
        }

        //
        $scope.showPopup = function(day) {

            if (day.events.length > 0) {

                modal.lightbox.show(modal);
            }
            var factory = angular.element('<div></div>');
            factory.html(require('./event-template.html'));
            $compile(factory)($scope);

            $timeout(function() {
                $scope.compiled = factory.html();
                modal.setContent($scope.compiled);
            });
            $scope.selectedDayEvents = day.events;

        }
        $scope.names = {
            d0: 'Mon',
            d1: 'Tue',
            d2: 'Wed',
            d3: 'Thu',
            d4: 'Fri',
            d5: 'Sat',
            d6: 'Sun',
        };
        //Event options
        var eventTypes = {
            "special-event": "fa-birthday-cake",
            "anch": "fa-anchor"
        }

        $scope.iconFunction = function(type) {
            if (eventTypes[type]) {
                return "fa " + eventTypes[type];
            } else {
                return "fa fa-anchor";
            }
        }


        calendarService.getEvents().then(function(events) {
            $scope.events = events;
        });
    }

    controller.$inject = deps;
    app.controller(app.name + '.' + controllername, controller);
};