'use strict';

angular.module('jalagatiJoga', [
  'ngRoute',
  'ngResource',
  'mobile-angular-ui',
  'restangular'
])
  .config(function ($routeProvider, $locationProvider) {
//    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', {
        templateUrl: 'app/pages/home.html'
      })
      .when('/register', {
        templateUrl: 'app/pages/register.html',
        data: {
          public: true
        }
      })
      .when('/alkalmak/uj', {
        templateUrl: 'app/alkalmak/uj-alkalom-form.html',
        controller: 'UjAlkalomController'
      })
      .when('/alkalmak/:alkalomId', {
        templateUrl: 'app/alkalmak/egy-alkalom.html',
        controller: 'AlkalomController'
      })
      .when('/alkalmak', {
        templateUrl: 'app/alkalmak/lista-alkalmak.html',
        controller: 'AlkalomListaController'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .value('redirectToAfterLogin', { url: '/' })
  .run(function ($rootScope, $http, AUTH_EVENTS, AuthService, $location, redirectToAfterLogin) {
    $rootScope.$on('$routeChangeStart', function (event, current) {
      if (!AuthService.isAuthorized(current.data && current.data.public)) {
        event.preventDefault();
        redirectToAfterLogin.url = current.url;
        if (AuthService.isAuthenticated()) {
          // user is not allowed
          $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
        } else {
          // user is not logged in
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
        }
      }
    });
    $rootScope.$on(AUTH_EVENTS.loginSuccess, function(event) {
      $location.path(redirectToAfterLogin.url);
    });
  })
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push([
      '$injector',
      function ($injector) {
        return $injector.get('AuthInterceptor');
      }
    ]);
    $httpProvider.interceptors.push(function() {
      return {
        'request': function(config) {
          var LastChunk = config.url.split('/').splice(-1)[0];
          if(LastChunk.indexOf('.') === -1) {
            config.url = 'http://localhost:8000' + config.url;
          }
          return config;
        }
      };
    });
  })
  .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
    return {
      responseError: function (response) {
        $rootScope.$broadcast({
          401: AUTH_EVENTS.notAuthenticated,
          403: AUTH_EVENTS.notAuthorized,
          419: AUTH_EVENTS.sessionTimeout,
          440: AUTH_EVENTS.sessionTimeout
        }[response.status], response);
        return $q.reject(response);
      }
    };
  })
  .controller('ApplicationController', function ($scope, $rootScope, USER_ROLES, AuthService) {
    $scope.sidebarUrl = 'app/pages/sidebar.html';
    $scope.currentUser = null;
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AuthService.isAuthorized;

    $rootScope.setCurrentUser = function (user) {
      $scope.currentUser = user;
    };
  });
