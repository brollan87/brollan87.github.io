angular.module('starter.services', [])

.factory('Fixa', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var fixalista = [{
    id: 0,
    name: 'Boka bil',
    lastText: 'Los Angeles till Seattle',
    face: 'img/bil.jpg'
  }, {
    id: 1,
    name: 'Boka helikoptertur',
    lastText: 'Gran Canyon',
    face: 'img/helikopter.jpg'

  }];

  return {
    all: function() {
      return fixalista;
    },
    remove: function(fixa) {
      fixalista.splice(fixalista.indexOf(fixa), 1);
    },
    get: function(fixaId) {
      for (var i = 0; i < fixalista.length; i++) {
        if (fixalista[i].id === parseInt(fixaId)) {
          return fixalista[i];
        }
      }
      return null;
    }
  };
})


.factory('Packa', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var packalista = [{
    id: 0,
    name: 'Prideflagga',
    lastText: '',
    face: 'img/bil.jpg'
  }, {
    id: 1,
    name: 'Plattång',
    lastText: 'Gran Canyon',
    face: 'img/helikopter.jpg'

  }];

  return {
    all: function() {
      return packalista;
    },
    remove: function(packa) {
      packalista.splice(packalista.indexOf(packa), 1);
    },
    get: function(packaId) {
      for (var i = 0; i < packalista.length; i++) {
        if (packalista[i].id === parseInt(packaId)) {
          return packalista[i];
        }
      }
      return null;
    }
  };
});
