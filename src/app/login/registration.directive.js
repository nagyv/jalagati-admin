'use strict';

angular.module(['jalagatiJoga'])
  .directive('bkRegistrationForm', function (AUTH_EVENTS) {
    return {
      restrict: 'E',
      scope: {
        'setCurrentUser': '&'
      },
      templateUrl: 'app/login/registration-form.html',
      controller: function($scope, $rootScope, AuthService, alertify) {
        $scope.credentials = {
          username: '',
          password: '',
          password2: ''
        };
        $scope.register = function register(credentials) {
          AuthService.register(credentials).then(function (user) {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            $scope.setCurrentUser(user);
          }, function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
          });
        };
      }
    };
  });
