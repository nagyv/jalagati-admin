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
  .controller('JogasokCtrl', function JogasokController($scope, $location, $state, $ionicHistory, Jogas, varosok, bkProgress, httpErrorHandler) {
    $scope.jogasok = Jogas.query();
    $scope.varosok = varosok;
    $scope.search = $scope.location = '';
    $scope.jogas = {
      name: $location.search().name,
      city: $location.search().city
    };
    $location.search('name', null);
    $location.search('city', null);
    $scope.isDisabled = false;
    $scope.addJogas = function (jogas) {
      $scope.isDisabled = true;
      $scope.jogas = {
        name: '',
        city: ''
      };
      var j = new Jogas(jogas);
      j.$save(function (value) {
        $scope.jogasok = Jogas.query();
        $scope.isDisabled = false;
        bkProgress.show('Módosítások elmentve');
        if($location.search('back')) {
          $location.search('back', null);
          $ionicHistory.goBack();
        } else {
          $state.go('app.jogasokEgy', {'jogasId': value._id});
        }
      }, httpErrorHandler);
    };
  })
  .controller('JogasCtrl', function JogasCtrl($scope, $stateParams, Jogas, varosok, bkProgress, httpErrorHandler, $ionicHistory) {
    $scope.$on('$ionicView.beforeEnter', function(){
      $scope.jogas = Jogas.get({id: $stateParams.jogasId});
    });
    $scope.varosok = varosok;
    $scope.isDisabled = false;
    $scope.save = function save(jogas) {
      $scope.isDisabled = true;
      jogas.$save({}, function (/*data*/) {
        $scope.isDisabled = false;
        bkProgress.show('Módosítások elmentve');
        $ionicHistory.goBack();
      }, httpErrorHandler);
    };
  })
  .controller('BerletCtrl', function BerletCtrl($scope, $stateParams, $ionicHistory, Jogas, arak, bkProgress, httpErrorHandler) {
    $scope.$on('$ionicView.beforeEnter', function(){
      $scope.jogas = Jogas.get({id: $stateParams.jogasId});
    });
    $scope.isDisabled = false;
    $scope.save = function (berlet) {
      $scope.isDisabled = true;
      $scope.jogas.$ujBerlet(berlet, function (/*data*/) {
        $scope.isDisabled = false;
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
    $scope.$on('$ionicView.beforeEnter', function(){
      $scope.jogas = Jogas.get({id: $stateParams.jogasId});
    });
  });

