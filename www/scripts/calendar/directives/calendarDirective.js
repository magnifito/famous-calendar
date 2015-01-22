'use strict';
var directivename = 'calendarDirective';

module.exports = function(app) {

    // directive
    var directiveDeps = [];
    var directive = function() {
        return {
            restrict: 'AE',
            scope: {
               
                events: '@'
            },
            controller: app.name + '.calendarController',
            controllerAs: 'vm',
            //bindToController: true,
            template: require('./calendarDirective.html'),
            link: calendarLinkFunction
        };
    };
    directive.$inject = directiveDeps;

    app.directive(directivename, directive);


    /************* calendar link function */

    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
        "November", "December"
    ];

    Date.prototype.getMonthName = function() {
        var currentDate = new Date();
        var month = monthNames[this.getMonth()];
        return month < 10 ? '0' + month : month;
    }

    var calendarLinkFunction = function(scope, element, attrs) {

        scope.$watch('events', function (newValue, oldValue) {
            if (newValue) {
                refreshCalendar(newValue);
            }
        }, true);


        var contentObj = scope.content;
        var targetMonth = parseInt(scope.assignedMonth, 10),
            targetYear = parseInt(scope.assignedyear, 10);

        if (!isNaN(targetMonth) &&
            !isNaN(targetYear) &&
            targetMonth > 0 &&
            targetMonth < 12
        ) {
            scope.currentDate = new Date(targetYear, targetMonth, 0);
        } else {
            scope.currentDate = new Date();
        }

        scope.today = new Date();
        scope.navigate = {};


        // month between 1 and 12
        var daysInMonth = function(month, year) {
            return new Date(year, month, 0).getDate();
        }

        scope.navigate.prevMotnth = function() {
            scope.currentDate.setMonth(scope.currentDate.getMonth() - 1);
            scope.$watch('events', function (newValue, oldValue) {
            if (newValue) {
                refreshCalendar(newValue);
            }
        }, true);

        }
        scope.navigate.nextMotnth = function() {
            scope.currentDate.setMonth(scope.currentDate.getMonth() + 1);
            scope.$watch('events', function (newValue, oldValue) {
            if (newValue) {
                refreshCalendar(newValue);
            }
        }, true);

        }


        // month between 1 ~ 12
        var getDateContent = function(year, month, date) {
            if (contentObj != null && contentObj[year] != null &&
                contentObj[year][month] != null &&
                contentObj[year][month][date] != null) {
                return contentObj[year][month][date].join("<br/>");
            }
            return "";
        }

        // month between 1 ~ 12
        var monthGenegrator = function(month, year, events) {
            var monthArray = [];
            var firstDay = new Date(year, month - 1, 1, 0, 0, 0, 0);
            //  weekDay between 1 ~ 7 , 1 is Monday, 7 is Sunday
            var firstDayInFirstweek = (firstDay.getDay() > 0) ? firstDay.getDay() : 7;
            var daysOfMonth = daysInMonth(month, year);
            var prevDaysOfMonth = daysInMonth(month - 1, year);

            var recordDate = 0; //record which day obj already genegrate

            //first week row
            monthArray.push(weekGenegrator(year, month, recordDate - firstDayInFirstweek, daysOfMonth, prevDaysOfMonth,
                events));

            recordDate = 7 - firstDayInFirstweek;
            //loop for following week row
            while (recordDate < daysOfMonth - 1) {
                monthArray.push(weekGenegrator(year, month, recordDate, daysOfMonth, null, events));
                recordDate += 7;
            }

            //set isToday
            if (scope.currentDate.getMonth() == scope.today.getMonth() &&
                scope.currentDate.getFullYear() == scope.today.getFullYear()) {
                var atWeek = Math.ceil((scope.today.getDate() + firstDayInFirstweek - 1) / 7) - 1;
                var atDay = (scope.today.getDate() + firstDayInFirstweek - 2) % 7;
                monthArray[atWeek][atDay].isToday = true;
            }
            return monthArray;
        }

        //month between 1~12
        var weekGenegrator = function(year, month, startDate, daysOfMonth, prevDaysOfMonth, events) {
            var week = [];

            for (var i = 1; i <= 7; i++) {
                var
                    realDate,
                    outmonth = false,
                    content = "";

                if (startDate + i < 0) {
                    realDate = prevDaysOfMonth + startDate + i + 1;
                    outmonth = true;
                } else if (startDate + i + 1 > daysOfMonth) {
                    realDate = startDate + i - daysOfMonth + 1;
                    outmonth = true;
                } else {
                    realDate = startDate + i + 1;
                    content = getDateContent(year, month, realDate);
                }


                var fullDate = year + "-" + month + "-" + realDate;
                var dayEvents = [];



                //debugger;
                if (events) {

                    for (var m = 0; m < events.length; m++) {
                        if (events[m].start === fullDate && !outmonth) {
                            dayEvents.push(events[m]);
                        }
                    }

                }
                scope.checkEvent = function() {
                    for (var p = 0; p < events.length; p++) {
                        if (events[p].eventType === 'special-event') {
                            return 'fa fa-anchor';
                        }
                        if (events[p].eventType === 'normal-event') {
                            return 'fa fa-birthday-cake';
                        }
                    }
                }
                week.push({
                    "outmonth": outmonth,
                    "day": i,
                    "content": content,
                    "date": realDate,
                    "fullDate": fullDate,
                    "events": dayEvents

                });

            }
            return week;
        }

        var refreshCalendar = function(events) {
            scope.month = monthGenegrator(scope.currentDate.getMonth() + 1, scope.currentDate.getFullYear(), events);

        }

        refreshCalendar();
    }
};