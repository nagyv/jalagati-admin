'use strict';

// mocking $cordovaProgress for web testing
angular.module('bk-progress', [])
  .factory('alertify', function alertifyFactory(){
    return alertify;
  })
  .factory('bkProgress', function(alertify){
    return {
      showText: function(toStay, timeout, text) {
        alertify.error(text);
      }
    };
  });
