'use strict';

angular.module('jalagatiJoga', [
  'ngRoute',
  'mobile-angular-ui',
  'restangular',
  'jalagatiJoga.controllers.Main'
])

.config(function($routeProvider) {
  $routeProvider
      .when('/',
        {
            templateUrl:'app/main/home.html',
            reloadOnSearch: false
        }
      );
});
