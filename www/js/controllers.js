'use strict';

angular.module('starter.controllers', [])

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
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
