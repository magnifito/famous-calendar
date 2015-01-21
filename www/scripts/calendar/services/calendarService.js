'use strict';
var servicename = 'calendarService';

module.exports = function(app) {

  var dependencies = ['$http', '$q'];

  function service($http, $q) {

    // Return public API.
    return ({
      getEvents: getEvents,
    });


    // ---
    // PUBLIC METHODS.
    // ---


    // I get all of the events in the remote collection.
    function getEvents() {

      var request = $http({
        method: "get",
        url: "events.json",
        params: {
          action: "get"
        }
      });

      return (request.then(handleSuccess, handleError));

    }


    // ---
    // PRIVATE METHODS.
    // ---


    // I transform the error response, unwrapping the application dta from
    // the API response payload.
    function handleError(response) {

      // The API response from the server should be returned in a
      // nomralized format. However, if the request was not handled by the
      // server (or what not handles properly - ex. server error), then we
      // may have to normalize it on our end, as best we can.
      if (!angular.isObject(response.data) ||
        !response.data.message
      ) {

        return ($q.reject("An unknown error occurred."));

      }

      // Otherwise, use expected error message.
      return ($q.reject(response.data.message));

    }


    // I transform the successful response, unwrapping the application data
    // from the API response payload.
    function handleSuccess(response) {
      var res = null;
      try {
        res = JSON.parse(response.data);
      } catch (e) {

      }
      return (response.data);

    }


  }
  service.$inject = dependencies;
  app.factory(app.name + '.' + servicename, service);
};
