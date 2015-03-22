'use strict';

angular.module(['bk-auth'])
  .factory('bkLogin', function($rootScope, $ionicModal){
  var loginModal = {};
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $rootScope,
      focusFirstInput: true
    }).then(function(modal) {
      loginModal.modal = modal;
    });

    // Triggered in the login modal to close it
    $rootScope.closeLogin = function() {
      loginModal.modal.hide();
    };

    // Open the login modal
    $rootScope.login = function() {
      loginModal.modal.show();
    };

   return loginModal;
  })
  .directive('bkLoginForm', function(){
    return {
      restrict: 'E',
      templateUrl: 'templates/login-form.html',
      controller: function($scope, bkAuthService) {
        $scope.credentials = {
          username: '',
          password: ''
        };
        // Perform the login action when the user submits the login form
        $scope.doLogin = function(credentials) {
          bkAuthService.login(credentials);
          return false;
        };
      }
    };
  });
