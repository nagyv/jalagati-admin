'use strict';

angular.module(['jalagatiJoga'])
  .factory('Jogas', function ($resource) {
    var Jogas = $resource('/jogasok/:id/:action', {
      'id': '@_id',
      'action': '@action'
    }, {
      'ujBerlet': {'method': 'POST', 'params': {'action': 'ujberlet'}}
    });
    return Jogas;
  })
  .controller('JogasokCtrl', function JogasokController($scope, $location, Jogas, varosok) {
    $scope.jogasok = Jogas.query();
    $scope.varosok = varosok;
    $scope.search = $scope.location = '';
    $scope.jogas = {
      city: null
    };
    $scope.addJogas = function (jogas) {
      var j = new Jogas(jogas);
      j.$save(function (value) {
        $location.path('/jogasok/' + value._id);
      });
    };
  })
  .controller('JogasCtrl', function JogasCtrl($scope, $routeParams, $window, Jogas, varosok) {
    $scope.jogas = Jogas.get({id: $routeParams.jogasId});
    $scope.varosok = varosok;
    $scope.save = function save(jogas) {
      $scope.jogas.$save({}, function (data) {
//        Global.addMessage("Módosítások elmentve");
        $window.history.back();
      });
    };
  })
  .controller('BerletCtrl', function BerletCtrl($scope, $routeParams, $window, Jogas) {
    $scope.jogas = Jogas.get({id: $routeParams.jogasId});
    $scope.window = $window;
    $scope.save = function (berlet) {
      $scope.jogas.$ujBerlet(berlet, function (data) {
//      Global.addMessage("Bérlet elmentve");
        $window.history.back();
      });
    };
  })
;

