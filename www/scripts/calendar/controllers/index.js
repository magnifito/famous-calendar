'use strict';

module.exports = function(app) {
    // inject:start
    require('./calendarController')(app);
    require('./eventController')(app);
    // inject:end
};
