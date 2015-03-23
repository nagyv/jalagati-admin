'use strict';

var BackendServiceURL = 'http://127.0.0.1:8000';

angular.module('starter', ['ionic', 'bk-auth', 'bk-joga-alkalom', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      window.StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html'
  })

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.uj', {
    url: '/uj',
    views: {
      'menuContent': {
        templateUrl: 'templates/uj-alkalom-form.html',
        controller: 'UjAlkalomController'
      }
    }
  })

  .state('app.browse', {
    url: '/browse',
    views: {
      'menuContent': {
        templateUrl: 'templates/browse.html'
      }
    }
  })
    .state('app.alkalmak', {
      url: '/alkalmak',
      views: {
        'menuContent': {
          templateUrl: 'templates/alkalmak-lista.html',
          controller: 'AlkalomListaController'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/alkalmak');
})
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push(function() {
      return {
        'request': function(config) {
          if (config.url && !config.url.startsWith('http')) {
//            nvActivityIndicator.startAnimating();
            var LastChunk = config.url.split('/').splice(-1)[0];
            if(LastChunk.indexOf('.') === -1) {
              config.url = BackendServiceURL + config.url;
            }
          }
          return config;
//        },
//        'response': function(response){
//          nvActivityIndicator.stopAnimating();
//          return response;
        }
      };
    });
  });
