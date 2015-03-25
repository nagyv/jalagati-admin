'use strict';

angular.module('bk-joga-jogas', ['ngResource', 'bk-progress'])
  .factory('Jogas', function ($resource) {
    var Jogas = $resource('/jogasok/:id/:action', {
      'id': '@_id',
      'action': '@action'
    }, {
      'ujBerlet': {'method': 'POST', 'params': {'action': 'ujberlet'}}
    });
    return Jogas;
  })
  .controller('JogasokCtrl', function JogasokController($scope, $location, Jogas, varosok, bkProgress, httpErrorHandler) {
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
        bkProgress.show('Módosítások elmentve');
        if($location.search().next) {
          $location.path($location.search().next);
        } else {
          $location.path('/jogasok/' + value._id);
        }
      }, httpErrorHandler);
    };
  })
  .controller('JogasCtrl', function JogasCtrl($scope, $stateParams, Jogas, varosok, bkProgress, httpErrorHandler, $ionicHistory) {
    $scope.jogas = Jogas.get({id: $stateParams.jogasId});
    $scope.varosok = varosok;
    $scope.save = function save(jogas) {
      jogas.$save({}, function (/*data*/) {
        bkProgress.show('Módosítások elmentve');
        $ionicHistory.goBack();
      }, httpErrorHandler);
    };
  })
  .controller('BerletCtrl', function BerletCtrl($scope, $stateParams, $ionicHistory, Jogas, arak, bkProgress, httpErrorHandler) {
    $scope.jogas = Jogas.get({id: $stateParams.jogasId});
    $scope.save = function (berlet) {
      $scope.jogas.$ujBerlet(berlet, function (/*data*/) {
        bkProgress.show('Módosítások elmentve');
        $ionicHistory.goBack();
      }, httpErrorHandler);
    };
    $scope.goBack = $ionicHistory.goBack;
    $scope.setHaviBerlet = function(){
      $scope.berlet = {
        alkalmak: null,
        startDate: moment().toDate(),
        endDate: moment().add(30, 'days').toDate(),
        fizetett: arak.berletHavi
      };
    };
    $scope.set10Berlet = function() {
      $scope.berlet = {
        alkalmak: 10,
        startDate: moment().toDate(),
        endDate: moment().add(3, 'months').toDate(),
        fizetett: arak.berlet10
      };
    };
    $scope.setFelevesBerlet = function() {
      $scope.berlet = {
        alkalmak: null,
        startDate: moment().toDate(),
        endDate: moment().add(6, 'months').toDate(),
        fizetett: arak.berletFelev
      };
    };
  })
  .controller('JogasAlkalmakController', function JogasAlkalmakController($scope, $stateParams, Jogas){
    $scope.jogas = Jogas.get({id: $stateParams.jogasId});
  });

