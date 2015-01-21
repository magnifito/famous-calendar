'use strict';

module.exports = function(app) {
    // inject:start
    require('./calendarService')(app);
    require('./famousHelper')(app);
    // inject:end
};