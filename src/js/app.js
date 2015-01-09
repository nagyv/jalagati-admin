angular.module('jalagatiJoga', [
  'ngRoute',
  'mobile-angular-ui',
  'jalagatiJoga.controllers.Main'
])

.config(function($routeProvider) {
  $routeProvider.when('/', {templateUrl:'home.html',  reloadOnSearch: false});
});
