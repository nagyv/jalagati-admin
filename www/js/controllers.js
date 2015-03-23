'use strict';

angular.module('bk-app', ['bk-auth'])

.controller('AppCtrl', function($scope, bkLogin, bkAuthService, AUTH_EVENTS) {
  $scope.$on(AUTH_EVENTS.loginRequired, function() {
    bkLogin.modal.show();
  });
  $scope.$on(AUTH_EVENTS.loginSuccess, function(event, data){
    $scope.user = data;
  });
  $scope.$on(AUTH_EVENTS.logoutSuccess, function(){
    $scope.user = null;
  });
  $scope.logout = function(){
    bkAuthService.logout();
  };
});
