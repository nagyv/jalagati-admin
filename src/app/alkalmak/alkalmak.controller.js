'use strict';

function nextHour(offset) {
  var now = moment();
  if (offset !== undefined) {
    now.add('minute', offset);
  }
  now.set('hour', now.get('hour') + 1);
  now.set('minute', 0);
  return now;
}

angular.module(['jalagatiJoga'])
  .value('jogaTartok', [
    'Sisi', 'Lakshmi'
  ])
  .value('varosok', [
    'Budapest, Király utca', 'Szeged'
  ])
  .factory('Alkalom', function ($resource) {
    var Alkalom = $resource('/alkalmak/:id/:action', {
      'id': '@_id',
      'action': '@action'
    }, {
      'addResztvevo': {'method': 'POST', 'params': {'action': 'addResztvevo'}}
    });
    return Alkalom;
  })
  .controller('UjAlkalomController', function($scope, $location, Alkalom, jogaTartok, varosok){
    var _nextHour = nextHour();
    $scope.jogaTartok = jogaTartok;
    $scope.varosok = varosok;
    $scope.ujAlkalom = {
      tartja: null,
      segit: $scope.currentUser.name,
      date: _nextHour.format('YYYY-MM-DD'),
      time: _nextHour.format('HH:mm')
    };
    $scope.setupAlkalom = function (alkalom) {
      alkalom.starts = alkalom.date + ' ' + alkalom.time;
      alkalom = new Alkalom(alkalom);
      alkalom.$save(function (value) {
        $location.path('/alkalmak/' + value._id);
      });
    };
  })
  .controller('AlkalomListaController', function ($scope, Alkalom) {
    $scope.alkalmak = Alkalom.query();
  })
  .controller('AlkalomController', function ($scope, $routeParams, Alkalom) {
    $scope.alkalom = Alkalom.get({'id': $routeParams.alkalomId});
    $scope.addJogas = _.noop();
    $scope.addResztvevo = function addResztvevo(resztvevo, alkalom) {
      alkalom.addResztvevo(resztvevo);
    };
    $scope.removeResztvevo = _.noop();
  });
