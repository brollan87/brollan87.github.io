angular.module('starter.services', ['firebase'])



.service('Fixa', function() {
  var selectedFixa = {};

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
  var selectedEvent = {};

  var setSelected = function(event) {
     selectedEvent = event;
   
  }

  var getSelected = function(){
      return selectedEvent;
  }

  return {
    setSelected: setSelected,
    getSelected: getSelected
  };

})



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
