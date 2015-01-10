'use strict';

angular.module(['jalagatiJoga'])
  .directive('loginDialog', function (AUTH_EVENTS) {
    return {
      restrict: 'A',
      scope: {
        'setCurrentUser': '&'
      },
      template: '<div ng-if="visible" ng-include="\'app/login/login-form.html\'">',
      link: function (scope) {
        var showDialog = function () {
          scope.visible = true;
        };
        var hideDialog = function () {
          scope.visible = false;
        };

        scope.visible = false;
        scope.$on(AUTH_EVENTS.notAuthenticated, showDialog);
        scope.$on(AUTH_EVENTS.sessionTimeout, showDialog);
        scope.$on(AUTH_EVENTS.loginSuccess, hideDialog);
      },
      controller: function ($scope, $rootScope, AUTH_EVENTS, AuthService) {
        $scope.credentials = {
          username: '',
          password: ''
        };
        $scope.login = function (credentials) {
          AuthService.login(credentials).then(function (user) {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            $rootScope.setCurrentUser(user);
          }, function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
          });
        };
        $scope.hideDialog = function() {
          $scope.visible = false;
        };
      }
    };
  })
  .directive('formAutofillFix', function ($timeout) {
    return function (scope, element, attrs) {
      element.prop('method', 'post');
      if (attrs.ngSubmit) {
        $timeout(function () {
          element
            .unbind('submit')
            .bind('submit', function (event) {
              event.preventDefault();
              element
                .find('input, textarea, select')
                .trigger('input')
                .trigger('change')
                .trigger('keydown');
              scope.$apply(attrs.ngSubmit);
            });
        });
      }
    };
  });
