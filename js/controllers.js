angular.module('starter.controllers', ['firebase', 'ui.calendar', 'uiGmapgoogle-maps', 'tabSlideBox'])
//angular.module('starter.controllers', [])


.config(function($ionicConfigProvider) {
  // back button text always displays "Back"
  $ionicConfigProvider.backButton.previousTitleText(false);
  $ionicConfigProvider.tabs.position('bottom');
})

        



.controller('CalendarController', ['$scope', '$state', 'SchemaDetail', '$firebaseArray','$ionicPopup', '$http','$timeout', function($scope, $state, SchemaDetail, $firebaseArray, $ionicPopup, $http, $timeout) {
    var refEvents = new Firebase('https://brollan87.firebaseio.com/events/');
 // $scope.events = [];
  $scope.eventsarr = $firebaseArray(refEvents);
 $scope.eventSources = [];
 $scope.valuta = {input: null, output: null};

console.log($scope.eventsarr);



 $scope.uiConfig = {
        defaultView : 'month',
        disableDragging : true,
        allDaySlot : false,
        selectable : true,
        unselectAuto : true,
        selectHelper : true,
        editable : false,
         defaultDate: new Date(2015, 05, 11),
        monthNames : ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"],
        dayNamesShort : ["Sön", "Mån", "Tis", "Ons", "Tors", "Fre", "Lör"],
        maxTime : "21:00:00",
        minTime : "8:00:00",
        eventDurationEditable : true, // disabling will show resize
        columnFormat : {
            week : 'dd-MM-yyyy',
            day : 'D-MMM-YYYY'
        },
        height : 300,
        maxTime : "21:00:00",
        minTime : "8:00:00",
        eventDurationEditable : false, // disabling will show resize
        columnFormat : {
            week : 'dd-MM-yyyy',
            day : 'D-MMM-YYYY'
        },
        titleFormat : {
          day : 'dd-MM-yyyy'
        },
        axisFormat : 'H:mm',
        weekends : true,
        header : {
            left : 'prev',
            center : 'title',
            right : 'next'
        },
        select: $scope.onSelect,
        eventClick : $scope.eventClick,
        viewRender: $scope.renderView
    };


$scope.eventsarr.$loaded()
    .then(function(){

 //  $scope.p = $scope.eventsarr.$getRecord("-Jqa8lkHd9G6KGX3vTYv");
 //  //$scope.p.allDay = true;
 // $scope.p.start = new Date('Fre Jul 03 2015').toDateString();
 // $scope.p.end = new Date('Sön Jul 05 2015').toDateString();
 //  //console.log($scope.p);
 //  $scope.eventsarr.$save($scope.p);


          $scope.eventSource ={};
    //        {
    //         url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
    //         className: 'gcal-event',           // an option!
    //         currentTimezone: 'Sweden/Stockholm'
    // };

//
$scope.currency;

      $http.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22USDSEK%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=').success(function(currencyData) {
         $scope.currency = currencyData.query.results.rate.Rate;

});

    $scope.datestring = new Date();
 
    $scope.tickInterval = 1000 //ms

    var tick = function() {
        $scope.datestring = Date.now() // get the current time
        $timeout(tick, $scope.tickInterval); // reset the timer
    }

    $timeout(tick, $scope.tickInterval);

    /* event sources array*/
    $scope.eventSources = [$scope.eventsarr, $scope.eventSource];
    $scope.loaded = true;

    });


    $scope.calculate = function(){
      if($scope.valuta.input && $scope.currency)
      $scope.valuta.output = $scope.valuta.input * parseInt($scope.currency,10); 
      else{
        $scope.valuta.output = null;
      }
    }
    $scope.onSelect=function(start, end){
      console.log("Event select fired");
      var startdate = start._d.toString().substring(0,15);
 
 $scope.data = {}
  var myPopup = $ionicPopup.show({
    template: startdate +'<br><br> Plats <input type="text" ng-model="data.ort"><br>Antal dagar <input type="number" min="1" ng-init="data.antaldagar=1" ng-model="data.antaldagar">',
    title: 'Lägg till event',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          //console.log($scope.datat.ort);
          //return $scope.datat.ort;
          if (!$scope.data.ort && !$scope.data.antaldagar) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return $scope.data;
          }
        }
      }
    ]
  });
  myPopup.then(function(res) {

      var startDate = new Date(start._d);
      startDate.setDate(startDate.getDate() + 1);
      var slutDate = new Date(start._d);
    //  slutDate.addDays(res.antaldagar);//  new Date();
      slutDate.setDate(startDate.getDate() + res.antaldagar+1);//new Date(start._d + res.antaldagar);// + 1 dag...

      $scope.event2 = {id: $scope.eventsarr.length+1, title: res.ort ,start: startDate.toDateString() ,end: slutDate.toDateString(), allDay: true, hotell: {namn: '', adress: ''}}
      $scope.eventsarr.$add($scope.event2);

  });




    };
    $scope.eventClick=function(event, allDay, jsEvent, view) {

      console.log($scope.eventsarr.$keyAt(event.id));
      SchemaDetail.setSelected($scope.eventsarr.$keyAt(event.id-1));
      $state.go('tab.schema-detail')
    };


   //with this you can handle the events that generated by each page render process
    $scope.renderView = function(view){    
        var date = new Date(view.calendar.getDate());
        $scope.currentDate = date.toDateString();
        $scope.$apply(function(){
          $scope.alertMessage = ('Page render with date '+ $scope.currentDate);
        });
    };



 


    
}])

.controller('SchemaDetailCtrl', function($scope, SchemaDetail, $http, $firebaseObject ,$location, weatherService, $state) {
  $scope.plats = 'test';
  $scope.hotell;
   $scope.item = {text: ""};

  $scope.showkarta = false;

    // SchemaDetail.registerObserverCallback(function() {
    //     $scope.eventselectedid = SchemaDetail.getSelected();
    //     console.log($scope.eventselectedid);   
    // });


      function fetchWeather(zip) {
        weatherService.getWeather(zip).then(function(data){
          $scope.place = data;
          console.log(data);
          $scope.temperatur = (data.item.condition.temp -32) * 5/9;
          
        }); 
      }

      $scope.mapWeatherclass = function(weather){
   console.log(weather);
        return "rain";
      }

      $scope.convertTemp = function(tempF){
        return (tempF -32) * 5/9;
      }
      

      $scope.mapWeatherclassPic = function(weather){
        console.log(weather);
        return "climacon rain";
      }




    $scope.getPos = function(adress){
      $http.get('http://maps.google.com/maps/api/geocode/json?address='+adress+'&sensor=false').success(function(mapData) {
       if(mapData.results[0]){
      angular.forEach(mapData.results[0].address_components, function(types) {
  if(types.types[0] == "postal_code"){
    fetchWeather(types.long_name);
  }
});
      
        $scope.map = {
          center: { latitude: mapData.results[0].geometry.location.lat, longitude: mapData.results[0].geometry.location.lng },
          markerpos: { latitude: mapData.results[0].geometry.location.lat, longitude: mapData.results[0].geometry.location.lng },
          zoom: 15,
          zoomControl: true
           };

         }
    });
  }

 // console.log("t" + SchemaDetail.getSelected());


    $scope.$watch('SchemaDetail.selectedEvent', function(newVal, oldVal){
      console.log("new val " + newVal);
    // if(newVal && newVal!=''){
        var id = SchemaDetail.getSelected();


  var refEvent = new Firebase('https://brollan87.firebaseio.com/events/'+id);
  $scope.eventet = $firebaseObject(refEvent);

  $scope.eventet.$loaded().then(function () {

  $scope.plats = $scope.eventet.title;
  $scope.hotell = $scope.eventet.hotell; 
   $scope.attgora = $scope.eventet.attgora;
  
   if($scope.hotell){
     $scope.getPos($scope.hotell.adress);
 }


});

     //}
     //else{
      //sds $location.path('/templates/tab-schema.html');
     //}
}, true);



    $scope.removeEvent = function(){

        $scope.eventet.$remove();
        $state.go('tab.schema', {}, {reload: true});
      }


  $scope.showKarta = function(){
    if($scope.showkarta){
      $scope.showkarta=false;
    }
    else{
      $scope.showkarta = true;
    }

  }

  $scope.sparaHotell = function(hotell){
    var pos = $scope.getPos(hotell.adress);
    $scope.eventet.hotell = hotell;
    $scope.eventet.$save();
    $scope.hotell = hotell;
    if(hotell.adress){
    $scope.getPos(hotell.adress);
  }
  }

  $scope.raderaHotell = function(){
    $scope.eventet.hotell = '';
    $scope.hotell = null;
    $scope.eventet.$save();

  }


    $scope.addItem = function(text){
      if(!$scope.eventet.attgora){
        $scope.attgora = [];
        $scope.eventet.attgora = [];
        $scope.eventet.$save();
        console.log($scope.eventet);
      }
      console.log(text);
      $scope.attgora.push({ text: text});
      $scope.eventet.attgora = $scope.attgora;//.push({ text: text});
      $scope.item = {text: ""};
      $scope.eventet.$save();
    }

    $scope.removeItem = function(ag){
      $scope.attgora.splice($scope.attgora.indexOf(ag), 1 )
    //  $scope.eventet.attgora.splice( $scope.eventet.attgora.indexOf(ag), 1 );
    $scope.eventet.attgora = $scope.attgora;
      $scope.eventet.$save();
    }

})


.controller('BetalaCtrl', function($scope) {
 $scope.data = {};
  $scope.data.columns = [{"id":"1453","name":"Vad"},{"id":"1355","name":"Pris/tot"},{"id":"0393","name":"Att betala"},{"id":"3","name":""},{"id":"4","name":"(p.p.)"}];
    
  $scope.data.items = [{"1234":"Pink","1355":"32000 (8000)","1453":"Kryssning","2939":"3 in.","3932":"29  in.","0393":"500"},{"1234":"Black","1355":"16000 (4000)","1453":"Hotell LA","2939":"13 in.","3932":"9  in.","0393":"0"}];

})

.controller('DashCtrl', function($scope) {})

.controller('FixaCtrl', function($scope, $firebaseArray, $location, $state, Fixa, $filter) {
   $scope.item = {text: ""};
   var ref = new Firebase('https://brollan87.firebaseio.com/fixalista');

    $scope.fixa = $firebaseArray(ref);

    $scope.viewDetails = function(fixa){
      Fixa.setSelected(fixa);

      $state.go('tab.fixa-detail')

    }

    $scope.getBildUrl = function(f){
      $scope.images = [{url : 'img/bil.jpg', id: 11}, {url: 'img/helikopter.jpg', id: 12}, {url: 'img/roadtripicon.jpg',  id: 13}];
$scope.images2 = [{url : 'img/hollywood.jpg', id: 21}, {url: 'img/pride.jpg', id: 22}, {url: 'img/sanfran.jpg',  id: 23}];
$scope.images3 = [{url : 'img/bil.jpg', id: 31}, {url: 'img/helikopter.jpg', id: 32}, {url: 'img/roadtripicon.jpg',  id: 33}];
     var single_object;
    if(f.bildid){
       single_object = $filter('filter')($scope.images, function (d) {return d.id === f.bildid;})[0];
      if(!single_object){
        single_object =  $filter('filter')($scope.images2, function (d) {return d.id === f.bildid;})[0];
      }
      if(!single_object){
        single_object =  $filter('filter')($scope.images3, function (d) {return d.id === f.bildid;})[0];
      }
     return single_object.url;
    }
    }

    $scope.addItem = function(){
      $scope.fixa.$add({ text: $scope.item.text, info: '', bildid: 0});
      $scope.item = {text: ""};
    }

    $scope.removeItem = function(fixa){
      $scope.fixa.$remove(fixa);
    }

    $scope.updateItem = function(fixa){
       $scope.fixa.$save(fixa);
    }
})

.controller('FixaDetailCtrl', function($scope, $stateParams, $firebaseObject, Fixa, $firebaseArray, $ionicModal, $ionicSlideBoxDelegate, $filter ) {

$scope.showImages = false;

 $scope.images = [{url : 'img/bil.jpg', id: 11}, {url: 'img/helikopter.jpg', id: 12}, {url: 'img/roadtripicon.jpg',  id: 13}];
$scope.images2 = [{url : 'img/hollywood.jpg', id: 21}, {url: 'img/pride.jpg', id: 22}, {url: 'img/sanfran.jpg',  id: 23}];
$scope.images3 = [{url : 'img/bil.jpg', id: 31}, {url: 'img/helikopter.jpg', id: 32}, {url: 'img/roadtripicon.jpg',  id: 33}];


  $scope.showLaggtill = false;
   $scope.forslag = {text: '', lank: ''};
   $scope.information = {text : ''};

    $scope.selectedFixa = Fixa.getSelected();
   
       var ref = new Firebase('https://brollan87.firebaseio.com/fixalista/'+$scope.selectedFixa.$id);
      $scope.fixa = $firebaseObject(ref);
      var refForslag = new Firebase('https://brollan87.firebaseio.com/fixalista/'+$scope.selectedFixa.$id+ '/forslag');
      $scope.forslagarr = $firebaseArray(refForslag);

    $scope.getBildUrl = function(){
      var f = $scope.selectedFixa;
 
     var single_object;
    if(f.bildid){
       single_object = $filter('filter')($scope.images, function (d) {return d.id === f.bildid;})[0];
      if(!single_object){
        single_object =  $filter('filter')($scope.images2, function (d) {return d.id === f.bildid;})[0];
      }
      if(!single_object){
        single_object =  $filter('filter')($scope.images3, function (d) {return d.id === f.bildid;})[0];
      }
     return single_object.url;
    }
    }

    $scope.bildurl = $scope.getBildUrl($scope.selectedFixa);

    $scope.like = function(f){
      f.likes++;
       $scope.forslagarr.$save(f);
    }

    $scope.clickShowLaggtill = function(){
      if($scope.showLaggtill){
        $scope.showLaggtill = false;
      }
      else{
        $scope.showLaggtill = true;
      }
    }

    $scope.showImagesList = function(){
   if($scope.showImages){
    $scope.showImages = false
   }else{
    $scope.showImages = true;
   }
}

$scope.setImage = function(id){
  if($scope.fixa){
  $scope.fixa.bildid= id;
  $scope.fixa.$save();
  $scope.selectedFixa = $scope.fixa;
  $scope.showImages = false;
  $scope.bildurl = $scope.getBildUrl($scope.selectedFixa);
}

}

    $scope.laggtillClass = function(){
      if($scope.showLaggtill){
        return "item item-divider ion-minus-round";
      }
      else{
        return "item item-divider ion-plus-round";
      }
    }

    $scope.sparaInfotext = function(infotext){
        if($scope.fixa){
        $scope.fixa.info = infotext;
        $scope.fixa.$save();
        $scope.information = {text: ""};
      }
    }

    $scope.raderaInfotext = function(){
      if($scope.fixa){
      $scope.fixa.info = '';
      $scope.fixa.$save();
      $scope.information = {text: ""};
    }
  }

  $scope.sparaForslag = function(forslag){
    if($scope.fixa){
       var forslaglankString ='';
       var forslagtextString = '';
       if(forslag.text){
        forslagtextString = forslag.text;
       }
       if(forslag.lank){
        forslaglankString = forslag.lank;
       }
         $scope.forslagarr.$add({forslagtext: forslagtextString, link: forslaglankString, likes: 0});
     $scope.showLaggtill = false;
     $scope.forslag = {text: '', lank: ''};
   }

  }

})

.controller('PackaCtrl', function($scope, $firebaseArray){
  $scope.item = {text: ""};
var ref = new Firebase('https://brollan87.firebaseio.com/packlista');

    $scope.packa = $firebaseArray(ref);

    $scope.addItem = function(){
      $scope.packa.$add({ text: $scope.item.text, checked: false });
      $scope.item = {text: ""};
    }

    $scope.removeItem = function(packa){
      console.log(packa.text);
      $scope.packa.$remove(packa);
    }

    $scope.updateItem = function(packa){
       $scope.packa.$save(packa);
    }
})



;
