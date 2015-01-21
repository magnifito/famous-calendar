'use strict';

var angular = require('angular-mocks');
var app = require('../')('app');
var directivename = 'eventDirective';
describe(app.name, function() {

    describe('Directives', function() {

        describe(directivename, function() {

            var compileDirective = function(html) {
                var element = angular.element(html);
                this.$compile(element)(this.$scope);
                this.$scope.$digest();
                this.controller = element.controller(directivename);
                this.scope = element.isolateScope() || element.scope();
                return element;
            };

            beforeEach(function() {
                angular.mock.module(app.name);
            });

            beforeEach(inject(function($injector) {
                this.$templateCache = $injector.get('$templateCache');
                this.$compile = $injector.get('$compile');
                this.$scope = $injector.get('$rootScope').$new();
                this.$scope.vm = {};
            }));

            it('should succeed', function() {
                var element = compileDirective.call(this, '<event-directive></event-directive>');
                expect(element.html().trim()).toBe('This is directive : event-directive');
            });

        });
    });
});