'use strict';

//{ statusCode: 400,
//  error: 'Bad Request',
//  message: 'fizetett is required',
//  validation: { source: 'query', keys: [ 'fizetett' ] } }

function nextHour(offset) {
  var now = moment();
  if (offset !== undefined) {
    now.add('minute', offset);
  }
  now.set('hour', now.get('hour') + 1);
  now.set('minute', 0);
  now.set('second', 0);
  now.set('millisecond', 0);
  return now;
}

angular.module('bk-joga-alkalom', ['ngResource', 'bk-progress'])
  .value('jogatartok', [
    'Lakshmi', 'Paci', 'Kupati' ,'Parvati', 'Kecske', 'Gyík', 'Gopi', 'Pocok'
  ])
  .value('varosok', [
    'Budapest, Király utca', 'Szeged'
  ])
  .value('arak', {
    alkalom: 900,
    berletHavi: 8000,
    berlet10: 7500,
    berletFelev: 40000,
    berlet40: 30000
  })
  .factory('Alkalom', function ($resource) {
    var Alkalom = $resource('/alkalmak/:id/:action', {
      'id': '@_id',
      'action': '@action'
    }, {
      'close': {'method': 'POST', 'params': {'action': 'close'}},
      'saveFinal': {'method': 'POST', 'params': {'action': 'saveFinal'}},
      'addResztvevo': {'method': 'POST', 'params': {'action': 'addResztvevo', jogasId: true}},
      'removeResztvevo': {'method': 'POST', 'params': {'action': 'removeResztvevo', resztvevoId: true}}
    });
    return Alkalom;
  })
  .factory('Resztvevo', function($resource){
    var Resztvevo = $resource('/resztvevok/:id/:action', {
      'id': '@_id',
      'action': '@action'
    }, {
      'update': {'method': 'POST', 'params': {'action': 'update'}},
      'removeBerlet': {'method': 'POST', 'params': {'action': 'removeBerlet'}}
    });
    return Resztvevo;
  })
  .controller('UjAlkalomController', function($scope, $location, Alkalom, jogatartok, varosok, httpErrorHandler){
    var _nextHour = nextHour().toDate();
    $scope.jogatartok = jogatartok;
    $scope.varosok = varosok;
    $scope.ujAlkalom = {
      tartja: null,
      segiti: $scope.user.name,
      date: _nextHour,
      time: _nextHour
    };
    $scope.setupAlkalom = function (alkalom) {
      alkalom.starts = moment(alkalom.date.toISOString().split('T')[0] + ' ' + alkalom.time.toLocaleTimeString()).toDate();
      delete alkalom.date;
      delete alkalom.time;
      alkalom = new Alkalom(alkalom);
      alkalom.$save(function (value) {
        $location.path('/alkalmak/' + value._id);
      }, httpErrorHandler);
    };
  })
  .controller('AlkalomListaController', function ($scope, Alkalom, varosok) {
    $scope.varosok = varosok;
    $scope.location = '';
    $scope.alkalmak = Alkalom.query();
  })
  .controller('AlkalomController', function ($scope, $stateParams, $window, Jogas, alertify, $location, Alkalom,
                                             Resztvevo, varosok, httpErrorHandler, $ionicModal, $state) {
    var editModal;
    $scope.alkalom = Alkalom.get({'id': $stateParams.alkalomId}, function(){
      if($scope.alkalom.state === 'closed') {
        $state.go('app.alkalmakLezart', {alkalomId: $stateParams.alkalomId});
      }
    });
    $scope.jogasok = Jogas.query();
    $scope.varosok = varosok;
    $scope.addJogas = function(search) {
      $location.search('next', $location.path());
      $location.search('name', search);
      $location.search('city', $scope.alkalom.location);
      $location.path('/app/jogasok');
    };
    $scope.addResztvevo = function addResztvevo(jogas, alkalom) {
      alkalom.$addResztvevo({jogasId: jogas._id}).catch(httpErrorHandler);
    };
    $scope.removeResztvevo = function(resztvevo, alkalom){
      alkalom.$removeResztvevo({resztvevoId: resztvevo.resztvevo}).catch(httpErrorHandler);
    };
    $scope.close = function(alkalom) {
      alkalom.$close(function(){
        $state.go('app.alkalmakLezart', {alkalomId: alkalom._id});
      });
    };
    $scope.editResztvevo = function(resztvevoId) {
      var $editScope = $scope.$new();
      $editScope.resztvevo = Resztvevo.get({'id': resztvevoId});
      $editScope.updateResztvevo = function(resztvevo) {
        var data = {};
        angular.forEach(['szamla', 'torulkozo', 'kupon', 'note', 'fizetett'], function(key){
          data[key] = resztvevo[key];
        });
        resztvevo.$update(data).then(function(/*data*/){
          alertify.success('Módosítások elmentve');
          $editScope.closeEdit();
        }, httpErrorHandler);
      };
      $editScope.removeBerlet = function(resztvevo) {
        resztvevo.$removeBerlet().then(function(/*data*/){
          alertify.success('Bérlet használata törölve');
        }, httpErrorHandler);
      };
      $editScope.closeEdit = function() {
        editModal.remove();
      };
      $ionicModal.fromTemplateUrl('templates/alkalom-resztvevo.html', {
        scope: $editScope
      }).then(function(modal) {
        editModal = modal;
        editModal.show();
      });
    };
    $scope.$on('$destroy', function() {
      if(editModal) {
        editModal.remove();
      }
    });
  })
  .controller('ResztvevoListController', function($scope, $q, Resztvevo, Alkalom, $stateParams, $state){
    $scope.alkalom = Alkalom.get({'id': $stateParams.alkalomId}, function(){
      if($scope.alkalom.state !== 'closed') {
        $state.go('app.alkalmakEgy', {alkalomId: $stateParams.alkalomId});
      }
    });
    $scope.resztvevok = Resztvevo.query({'alkalom': $stateParams.alkalomId});
    $scope.getTotal = function(resztvevok) {
      var szamitott;
      szamitott = _.reduce(resztvevok, function(szamitott, resztvevo){
        return szamitott + resztvevo.fizetett;
      }, $scope.alkalom.nyito);
      return szamitott;
    };
    $scope.getExtra = function(resztvevok) {
      return $scope.alkalom.zaro - $scope.getTotal(resztvevok);
    };
    $scope.saveMoney = function() {
      var data = {
        nyito: $scope.alkalom.nyito,
        zaro: $scope.alkalom.zaro,
        extra: $scope.getExtra($scope.resztvevok)
      };
      $scope.alkalom.$saveFinal(data);
    };
  });
