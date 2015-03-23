'use strict';

// mocking $cordovaProgress for web testing
angular.module('bk-progress', ['ngCordova'])
  .factory('alertify', function alertifyFactory($cordovaProgress){
    return {
      error: function(message) {
        $cordovaProgress.showText(false, 100000, message)
      }
    };
  })
  .factory('bkProgress', function($cordovaProgress){
    return $cordovaProgress;
  })
  .factory('httpErrorHandler', function(alertify) {
    return function(data){
      try {
        alertify.error('Sikertelen mentés: ' + data.data.validation.keys.join(', '));
      } catch(e) {
        alertify.error('Sikertelen mentés');
      }
    };
  })
;
