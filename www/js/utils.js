'use strict';

// mocking $cordovaProgress for web testing
angular.module('bk-progress', ['ngCordova'])
  .factory('bkProgress', function($cordovaProgress){
    return $cordovaProgress;
  })
  .factory('httpErrorHandler', function(bkProgress) {
    return function(data){
      try {
        bkProgress.show('Sikertelen mentés: ' + data.data.validation.keys.join(', '));
      } catch(e) {
        bkProgress.show('Sikertelen mentés');
      }
    };
  })
;
