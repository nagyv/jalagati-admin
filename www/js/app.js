'use strict';

var BackendServiceURL = 'https://jogaadmin.herokuapp.com';

angular.module('starter', ['ionic', 'angular-loading-bar', 'ngCordova', 'bk-auth', 'bk-joga-alkalom', 'bk-joga-jogas', 'bk-app'])

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

  .state('app.alkalmakLista', {
    url: '/alkalmak',
    views: {
      'menuContent': {
        templateUrl: 'templates/alkalmak-lista.html',
        controller: 'AlkalomListaController'
      }
    }
  })
  .state('app.alkalmakUj', {
    url: '/alkalmak/uj',
    views: {
      'menuContent': {
        templateUrl: 'templates/uj-alkalom-form.html',
        controller: 'UjAlkalomController'
      }
    }
  })
  .state('app.alkalmakEgy', {
    url: '/alkalmak/:alkalomId',
    views: {
      'menuContent': {
        templateUrl: 'templates/alkalom.html',
        controller: 'AlkalomController'
      }
    }
  })
  .state('app.alkalmakLezart', {
    url: '/alkalmak/:alkalomId/lezart',
    views: {
      'menuContent': {
        templateUrl: 'templates/alkalom-lezart.html',
        controller: 'ResztvevoListController'
      }
    }
  })

  .state('app.jogasokLista', {
    url: '/jogasok',
    views: {
     'menuContent': {
       templateUrl: 'templates/jogasok-lista.html',
       controller: 'JogasokCtrl'
     }
    }
  })
  .state('app.jogasokEgy', {
    url: '/jogasok/:jogasId',
    views: {
     'menuContent': {
       templateUrl: 'templates/jogas-adatok.html',
       controller: 'JogasCtrl'
     }
    }
  })
  .state('app.jogasokBerletek', {
    url: '/jogasok/:jogasId/berletek',
    views: {
     'menuContent': {
       templateUrl: 'templates/jogas-berlet.html',
       controller: 'BerletCtrl'
     }
    }
  })
  .state('app.jogasokAlkalmak', {
    url: '/jogasok/:jogasId/alkalmak',
    views: {
     'menuContent': {
       templateUrl: 'templates/jogas-alkalmak.html',
       controller: 'JogasAlkalmakController'
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
        if (config.url && config.url.indexOf('http') === -1) {
          var LastChunk = config.url.split('/').splice(-1)[0];
          if(LastChunk.indexOf('.') === -1) {
            config.url = BackendServiceURL + config.url;
          }
        }
        return config;
      }
    };
  });
});
