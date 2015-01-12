'use strict';

angular.module('jalagatiJoga')
  .service('Session', function ($http) {
    this.create = function (userId, name, token) {
      this.id = userId;
      this.name = name;
      this.token = token;
      $http.defaults.headers.common.Authorization = 'Bearer ' + token;
    };
    this.destroy = function () {
      this.id = null;
      this.name = null;
      this.token = null;
      $http.defaults.headers.common.Authorization = '';
    };
    return this;
  })
  .factory('AuthService', function ($http, Session) {
    var authService = {};

    authService.login = function (credentials) {
      return $http
        .post('/auth/login', credentials)
        .then(function (res) {
          Session.create(res.data.id, res.data.name, res.data.token);
          return res.data;
        });
    };

    authService.register = function register(credentials) {
      return $http
        .post('/auth/signup', credentials)
        .then(function (res) {
          Session.create(res.data.id, res.data.name, res.data.token);
          return res.data;
        });
    };

    authService.isAuthenticated = function () {
      return !!Session.id;
    };

    authService.isAuthorized = function (isPublic) {
      return isPublic || !!Session.id;
    };

    return authService;
  });
