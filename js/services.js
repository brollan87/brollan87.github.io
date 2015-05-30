angular.module('starter.services', ['firebase'])



.service('Fixa', function() {
  var selectedFixa; //= {};

  var setSelected = function(fixa) {
     selectedFixa = fixa;
   
  }

  var getSelected = function(){
      return selectedFixa;
  }

  return {
    setSelected: setSelected,
    getSelected: getSelected
  };

})

.service('SchemaDetail', function() {
  var observerCallbacks = [];
  var selectedEvent ='';

      // register an observer
    var registerObserverCallback = function(callback){
        console.log("test" + callback);
        observerCallbacks.push(callback);
        console.log(observerCallbacks.length);
    };

       var notifyObservers = function(){
     console.log("testte" + observerCallbacks.length);
    angular.forEach(observerCallbacks, function(callback){

      callback();
    });
  };


  var setSelected = function(event) {
     selectedEvent = event;

     notifyObservers();
   
  }

  var getSelected = function(){
      return selectedEvent;
  }



  return {
    setSelected: setSelected,
    getSelected: getSelected,
    registerObserverCallback: registerObserverCallback,
    selectedEvent: selectedEvent
  };

})

  .factory('weatherService', ['$http', '$q', function ($http, $q){
      function getWeather (zip) {
        var deferred = $q.defer();
        $http.get('https://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20weather.forecast%20WHERE%20location%3D%22' + zip + '%22&format=json&diagnostics=true&callback=')
          .success(function(data){
            deferred.resolve(data.query.results.channel);
          })
          .error(function(err){
            console.log('Error retrieving markets');
            deferred.reject(err);
          });
        return deferred.promise;
      }
      
      return {
        getWeather: getWeather
      };
    }])



.factory("packlistaService", ["$firebaseArray",
  function($firebaseArray) {
    // create a reference to the Firebase where we will store our data
    var randomRoomId = Math.round(Math.random() * 100000000);
    var ref = new Firebase("https://brollan87.firebaseio.com/");

    // this uses AngularFire to create the synchronized array
    return $firebaseArray(ref);
  }
])


.factory('Packa', function() {
  // Might use a resource here that returns a JSON array
  var packalista = [];
    var myDataRef = new Firebase('https://brollan87.firebaseio.com/');
//    var packlistaref = myDataRef.child("packlista");
//    packlistaref.on("child_added", function(snap) {
   
//      console.log("added", snap.val());
// });


  return {
    all: function() {
          myDataRef.once("value", function(data) {
    data.forEach(function(text){
       packalista.push(text.val());

    });
});
      return packalista;
    },
    remove: function(packa) {
      packalista.splice(packalista.indexOf(packa), 1);
    },
    add: function(packa) {
      var newChildRef = myDataRef.push();
      newChildRef.set({text: packa.text});
      //packalista.push({id: packalista.length+1, name: packa, checked: false});
    },
    update: function(packa){
       //var packlistaref = myDataRef.child("packlista");
      //  var packaobj = myDataRef.child(packa.key());
      myDataRef.update({text: packa});
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
