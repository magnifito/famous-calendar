'use strict';

module.exports = function(app) {
    // inject:start
    require('./calendarDirective')(app);
    require('./eventDirective')(app);
    // inject:end
};
