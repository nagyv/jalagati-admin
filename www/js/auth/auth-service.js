'use strict';

angular.module('bk-auth', ['bk-progress', 'http-auth-interceptor', 'LocalStorageModule'])
  .constant('AUTH_EVENTS', {
    loginRequired: 'event:auth-loginRequired',
    loginSuccess: 'event:auth-loginConfirmed',
    loginFailed: 'event:auth-login-failed',
    logoutSuccess: 'event:auth-logout-complete',
    notAuthorized: 'auth-not-authorized'
  })
  .factory('bkAuthService', function ($rootScope, AUTH_EVENTS, $http, authService, localStorageService, bkProgress) {
    var service = {};

    service.login = function (credentials) {
      return $http
        .post('/auth/login', credentials, { ignoreAuthModule: true })
        .success(function (data) {
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

          $http.defaults.headers.common.Authorization = data.token;  // Step 1
          localStorageService.set('authorizationToken', data.token); // Step 2
          $rootScope.closeLogin();

          authService.loginConfirmed(data, function(config) {  // Step 3
            config.headers.Authorization = data.token;
            return config;
          });
          return data;
        })
        .error(function(status){
          $rootScope.$broadcast('event:auth-login-failed', status);
          bkProgress.showText(false, 100000, 'Hibás bejelentkezés');
        });
    };

    service.register = function register(credentials) {
      return $http
        .post('/auth/signup', credentials, { ignoreAuthModule: true })
        .success(function (data) {
          $http.defaults.headers.common.Authorization = data.token;  // Step 1
          localStorageService.set('authorizationToken', data.token); // Step 2

          authService.loginConfirmed(data, function(config) {  // Step 3
            config.headers.Authorization = data.token;
            return config;
          });

          bkProgress.showText(false, 100000, 'Sikeres regisztrálás');
          return data;
        })
        .error(function(){
          $rootScope.$broadcast(AUTH_EVENTS.registrationFailed);
          bkProgress.showText(false, 100000,'Hibás regisztrálás');
        });
    };

    service.logout = function() {
      localStorageService.remove('authorizationToken');
      delete $http.defaults.headers.common.Authorization;
      $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
//      $http.post('/auth/logout', {}, { ignoreAuthModule: true })
//      .finally(function() {
//        localStorageService.remove('authorizationToken');
//        delete $http.defaults.headers.common.Authorization;
//        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
//      });
    };

    service.loginCancelled = function() {
      authService.loginCancelled();
    };

    return service;
  });
