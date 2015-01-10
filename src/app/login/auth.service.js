'use strict';

angular.module('jalagatiJoga')
  .service('Session', function () {
    this.create = function (userId, name, userRole) {
      this.id = userId;
      this.name = name;
    };
    this.destroy = function () {
      this.id = null;
      this.name = null;
    };
    return this;
  })
  .factory('AuthService', function ($http, Session) {
    var authService = {};

    authService.login = function (credentials) {
      return $http
        .post('/auth/login', credentials)
        .then(function (res) {
          Session.create(res.data.id, res.data.name);
          return res.data;
        });
    };

    authService.register = function register(credentials) {
      return $http
        .post('/auth/signup', credentials)
        .then(function (res) {
          Session.create(res.data.id, res.data.name);
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
