'use strict';

angular.module(['bk-auth'])
  .directive('bkRegistrationForm', function () {
    return {
      restrict: 'E',
      templateUrl: 'templates/registration-form.html',
      controller: function($scope, $rootScope, bkAuthService, $timeout) {
        $scope.credentials = {
          username: '',
          password: '',
          password2: ''
        };
        $scope.isDisabled = false;
        $scope.register = function register(credentials) {
          $scope.isDisabled = true;
          bkAuthService.register(credentials)
            .then(function(){
              $scope.credentials = {
                username: '',
                password: '',
                password2: ''
              };
            })
            .finally(function(){
              $scope.isDisabled = false;
            });
        };
      }
    };
  });
