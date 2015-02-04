'use strict';
var controllername = 'calendarController';

module.exports = function (app) {
	/*jshint validthis: true */

	var deps = ['$scope', '$compile', '$timeout', '$famous', app.name + '.calendarService', app.name + '.famousHelper'];

	function controller($scope, $compile, $timeout, $famous, calendarService, famousHelper) {
		var self = this;

		this.init = function (element) {
			self.$element = element;
		};

		//	VARIABLES
		//all available dates for the calendar to render
		$scope.dates = null;
		//the current calendar date
		$scope.currentDate = Date.create("beginning of month");

		//	PRIVATE METHODS
		/**
		 * Gets the list of dates for the current month
		 * @param month
		 */
		var getDates = function () {
			var date;
			var dates = [];
			var daysInMonth = $scope.currentDate.daysInMonth() - 1; //make it 0 based

			//add an item to the dates array
			var addItem = function (days, isOutsideMonth) {
				date = $scope.currentDate.clone();
				date.addDays(days, true);
				var events = $scope.events;
				var dayEvents = [];
				if (events) {
					for (var m = 0; m < events.length; m++) {
						//2015-2-3
						var formattedDate = date.format('{yyyy}-{M}-{d}');
						if (events[m].start == formattedDate) {
							dayEvents.push(events[m]);
						}
					}
				}
				dates.push({
					date: date,
					disabled: isOutsideMonth === true,
					events: dayEvents
				});
			};

			var currentDay = $scope.currentDate.getDay();

			//get the last N days of last month for the week
			var downTo = 1;
			if(currentDay == 0){
				currentDay = 6;
			} else {
				currentDay -= 1;
			}
			currentDay.downto(downTo, function (i) {
				addItem(-i, true);
			});

			//get all 28/30/31 days in the month
			(0).upto(daysInMonth, function (i) {
				addItem(i);
			});

			var cellsCount = 6*7;//rows*columns

			//get the remaining/possible days left in the week for next month
			var daysCountInMonth = $scope.currentDate.daysInMonth();
			var upTo = cellsCount - dates.length;

			(0).upto(upTo, function (i) {
				addItem(daysCountInMonth + i, true);
			});

			return dates;
		};

		/**
		 * Updates the date array
		 */
		var updateDates = function (direction) {
			if (direction !== 0) {
				$scope.currentDate.addMonths(direction);
				$scope.currentDate.set({
					date: 1
				});
			}
			$scope.dates = getDates();
		};

		//	SCOPE METHODS
		/**
		 * Go to the previous month
		 */
		$scope.previousMonth = function () {
			updateDates(-1);
		};

		/**
		 * Go to the next month
		 */
		$scope.nextMonth = function () {
			updateDates(1);

		};

		//	INIT
		updateDates(0);

		//	MODULE
		/**
		 * Using the module pattern but nothing to return here
		 */

		//return {};
		var Transitionable = $famous['famous/transitions/Transitionable'];
		var Easing = $famous['famous/transitions/Easing'];
		var Modifier = $famous["famous/core/Modifier"];
		var Lightbox = $famous['famous/views/Lightbox'];
		var Engine = $famous['famous/core/Engine'];
		var Surface = $famous['famous/core/Surface'];
		var Transform = $famous['famous/core/Transform'];
		var FastClick = $famous['famous/inputs/FastClick'];
		// popup options

		$scope.otherDays = function (day) {
			if (day.outmonth) {
				return 'cal-day-outmonth';
			} else if (day.day == 6 || day.day == 7) {
				return 'cal-day-weekend';
			} else if (day.isToday) {
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

		$scope.closeModal = function () {
			modal.lightbox.hide();
		}

		//
		$scope.showPopup = function (day) {

			if (day.events.length > 0) {

				modal.lightbox.show(modal);
			} else {
				modal.lightbox.hide();
			}
			var factory = angular.element('<div></div>');
			factory.html(require('./event-template.html'));
			$compile(factory)($scope);

			$timeout(function () {
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

		$scope.iconFunction = function (type) {
			if (eventTypes[type]) {
				return "fa " + eventTypes[type];
			} else {
				return "fa fa-anchor";
			}
		}

		calendarService.getEvents().then(function (events) {
			$scope.events = events;
		});
	}

	controller.$inject = deps;
	app.controller(app.name + '.' + controllername, controller);
};
