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
      'removeResztvevo': {'method': 'POST', 'params': {'action': 'removeResztvevo', jogasId: true}}
    });
    return Alkalom;
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
  .controller('AlkalomController', function ($scope, $routeParams, $window, Jogas, $location, Alkalom, varosok) {
    $scope.alkalom = Alkalom.get({'id': $routeParams.alkalomId});
    $scope.jogasok = Jogas.query();
    $scope.varosok = varosok;
    $scope.addJogas = function(search) {
      $location.search('next', $location.path());
      $location.search('name', search);
      $location.search('city', $scope.alkalom.location);
      $location.path('/jogasok');
    };
    $scope.addResztvevo = function addResztvevo(resztvevo, alkalom) {
      alkalom.$addResztvevo({jogasId: resztvevo._id});
    };
    $scope.removeResztvevo = function(resztvevo, alkalom){
      alkalom.$removeResztvevo({jogasId: resztvevo._id});
    };
  });
