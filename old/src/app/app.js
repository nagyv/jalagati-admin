'use strict';

var BackendServiceURL = 'http://127.0.0.1:8000';

angular.module('jalagatiJoga', [
  'ngRoute',
  'ngResource',
  'mobile-angular-ui',
  'restangular',
  'ngActivityIndicator'
])
  .config(function ($routeProvider) {
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
        controller: 'AlkalomController',
        reloadOnSearch: false
      })
      .when('/alkalmak', {
        templateUrl: 'app/alkalmak/lista-alkalmak.html',
        controller: 'AlkalomListaController'
      })
      .when( '/jogasok/:jogasId/alkalmak', {
        controller: 'JogasAlkalmakController',
        templateUrl: 'app/jogas/alkalmak.html'
      })
      .when( '/jogasok/:jogasId/berlet', {
        controller: 'BerletCtrl',
        templateUrl: 'app/jogas/berlet.html'
      })
      .when( '/jogasok/:jogasId', {
          controller: 'JogasCtrl',
          templateUrl: 'app/jogas/jogas-egy.html'
      })
      .when('/jogasok', {
        controller: 'JogasokCtrl',
        templateUrl: 'app/jogas/jogasok-lista.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .value('redirectToAfterLogin', { url: '/' })
  .value('arak', {
    alkalom: 900,
    berletHavi: 8000,
    berlet10: 7500,
    berletFelev: 40000,
    berlet40: 30000
  })
  .service('nvActivityIndicator', function($activityIndicator){
    var counter = 0;
    return {
      startAnimating: function(){
        counter += 1;
        $activityIndicator.startAnimating();
      },
      stopAnimating: function() {
        counter -= 1;
        if(counter === 0) {
          $activityIndicator.stopAnimating();
        }
      }
    };
  })
  .run(function ($rootScope, $http, $route, AUTH_EVENTS, AuthService) {
    $rootScope.$on('$routeChangeStart', function (event, current) {
      if (!AuthService.isAuthorized(current.data && current.data.public)) {
        event.preventDefault();
        if (AuthService.isAuthenticated()) {
          // user is not allowed
          $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
        } else {
          // user is not logged in
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
        }
      }
    });
    $rootScope.$on(AUTH_EVENTS.loginSuccess, function(/*event*/) {
      $route.reload();
    });
  })
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push([
      '$injector',
      function ($injector) {
        return $injector.get('AuthInterceptor');
      }
    ]);
    $httpProvider.interceptors.push(function(nvActivityIndicator) {
      return {
        'request': function(config) {
          if (config.url) {
            nvActivityIndicator.startAnimating();
            var LastChunk = config.url.split('/').splice(-1)[0];
            if(LastChunk.indexOf('.') === -1) {
              config.url = BackendServiceURL + config.url;
            }
          }
          return config;
        },
        'response': function(response){
          nvActivityIndicator.stopAnimating();
          return response;
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
  .factory('alertify', function alertifyFactory(){
    return alertify;
  })
  .factory('httpErrorHandler', function httpErrorHandler(alertify){
    return function(data){
  //        angular.forEach(data.data.validation.keys, function(key){
  //          $scope.editResztvevoForm[key].$setValidity("default1", false);
  //        });
      try {
        alertify.error('Sikertelen mentés: ' + data.data.validation.keys.join(', '));
      } catch(e) {
        alertify.error('Sikertelen mentés');
      }
    };
  })
  .controller('ApplicationController', function ($scope, $rootScope, $window, USER_ROLES, AuthService) {
    $scope.sidebarUrl = 'app/pages/sidebar.html';
    $scope.currentUser = null;
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AuthService.isAuthorized;
    $scope.back = function() {
      $window.history.back();
    };

    $rootScope.setCurrentUser = function (user) {
      $scope.currentUser = user;
    };
  });
