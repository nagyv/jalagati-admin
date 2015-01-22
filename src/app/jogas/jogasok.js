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
  .controller('JogasokCtrl', function JogasokController($scope, $location, Jogas, varosok, alertify, httpErrorHandler) {
    $scope.jogasok = Jogas.query();
    $scope.varosok = varosok;
    $scope.search = $scope.location = '';
    $scope.jogas = {
      name: $location.search().name,
      city: $location.search().city
    };
    $scope.addJogas = function (jogas) {
      var j = new Jogas(jogas);
      j.$save(function (value) {
        alertify.success("Módosítások elmentve");
        if($location.search().next) {
          $location.path($location.search().next);
        } else {
          $location.path('/jogasok/' + value._id);
        }
      }, httpErrorHandler);
    };
  })
  .controller('JogasCtrl', function JogasCtrl($scope, $routeParams, Jogas, varosok, alertify, httpErrorHandler) {
    $scope.jogas = Jogas.get({id: $routeParams.jogasId});
    $scope.varosok = varosok;
    $scope.save = function save(jogas) {
      $scope.jogas.$save({}, function (data) {
        alertify.success("Módosítások elmentve");
        $scope.back();
      }, httpErrorHandler);
    };
  })
  .controller('BerletCtrl', function BerletCtrl($scope, $routeParams, Jogas, alertify, httpErrorHandler) {
    $scope.jogas = Jogas.get({id: $routeParams.jogasId});
    $scope.save = function (berlet) {
      $scope.jogas.$ujBerlet(berlet, function (data) {
        alertify.success("Módosítások elmentve");
        $scope.back();
      }, httpErrorHandler);
    };
  })
  .controller('JogasAlkalmakController', function JogasAlkalmakController($scope, $routeParams, Jogas){
    $scope.jogas = Jogas.get({id: $routeParams.jogasId});
  });

