'use strict';

angular.module(['bk-auth'])
  .directive('bkRegistrationForm', function () {
    return {
      restrict: 'E',
      templateUrl: 'templates/registration-form.html',
      controller: function($scope, $rootScope, bkAuthService) {
        $scope.credentials = {
          username: '',
          password: '',
          password2: ''
        };
        $scope.register = function register(credentials) {
          bkAuthService.register(credentials);
        };
      }
    };
  });
