'use strict';

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

angular.module(['jalagatiJoga'])
  .value('jogatartok', [
    'Lakshmi', 'Paci', 'Kupati' ,'Parvati', 'Kecske', 'Gyík', 'Gopi', 'Pocok'
  ])
  .value('varosok', [
    'Budapest, Király utca', 'Szeged'
  ])
  .factory('Alkalom', function ($resource) {
    var Alkalom = $resource('/alkalmak/:id/:action', {
      'id': '@_id',
      'action': '@action'
    }, {
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
      'update': {'method': 'POST', 'params': {'action': 'update'}}
    });
    return Resztvevo;
  })
  .controller('UjAlkalomController', function($scope, $location, Alkalom, jogatartok, varosok){
    var _nextHour = nextHour().toDate();
    $scope.jogatartok = jogatartok;
    $scope.varosok = varosok;
    $scope.ujAlkalom = {
      tartja: null,
      segit: $scope.currentUser.name,
      date: _nextHour,
      time: _nextHour
    };
    $scope.setupAlkalom = function (alkalom) {
      alkalom.starts = moment(alkalom.date.toISOString().split('T')[0] + ' ' + alkalom.time.toLocaleTimeString()).toDate();
      alkalom = new Alkalom(alkalom);
      alkalom.$save(function (value) {
        $location.path('/alkalmak/' + value._id);
      });
    };
  })
  .controller('AlkalomListaController', function ($scope, Alkalom, varosok) {
    $scope.varosok = varosok;
    $scope.location = '';
    $scope.alkalmak = Alkalom.query();
  })
  .controller('AlkalomController', function ($scope, $routeParams, $window, Jogas, $location, Alkalom, Resztvevo, varosok, SharedState) {
    $scope.alkalom = Alkalom.get({'id': $routeParams.alkalomId});
    $scope.jogasok = Jogas.query();
    $scope.varosok = varosok;
    SharedState.initialize($scope, 'editResztvevo', false);
    $scope.addJogas = function(search) {
      $location.search('next', $location.path());
      $location.search('name', search);
      $location.search('city', $scope.alkalom.location);
      $location.path('/jogasok');
    };
    $scope.addResztvevo = function addResztvevo(jogas, alkalom) {
      alkalom.$addResztvevo({jogasId: jogas._id});
    };
    $scope.removeResztvevo = function(resztvevo, alkalom){
      alkalom.$removeResztvevo({resztvevoId: resztvevo.resztvevo});
    };
    $scope.editResztvevo = function(resztvevoId) {
      $scope.resztvevo = Resztvevo.get({'id': resztvevoId});
    };
    $scope.updateResztvevo = function(resztvevo) {
      var data = {};
      angular.forEach(['szamla', 'torulkozo', 'kupon', 'note', 'fizetett'], function(key){
        data[key] = resztvevo[key];
      });
      resztvevo.$update(data).then(function(data){
        SharedState.turnOff('editResztvevo');
      });
    };
  });
