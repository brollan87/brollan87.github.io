angular.module('starter.controllers', ['firebase'])

.directive('dhxScheduler', function() {
  return {
    restrict: 'A',
    scope: false,
    transclude: true,
    template:'<div class="dhx_cal_navline" ng-transclude></div><div class="dhx_cal_header"></div><div class="dhx_cal_data"></div>',



    link:function ($scope, $element, $attrs, $controller){
      //default state of the scheduler
      if (!$scope.scheduler)
        $scope.scheduler = {};
      $scope.scheduler.mode = $scope.scheduler.mode || "month";
      $scope.scheduler.date = $scope.scheduler.date || new Date();

      //watch data collection, reload on changes
      $scope.$watch($attrs.data, function(collection){
        scheduler.clearAll();
        scheduler.parse(collection, "json");
      }, true);

      //mode or date
      $scope.$watch(function(){
        return $scope.scheduler.mode + $scope.scheduler.date.toString();
      }, function(nv, ov) {
        var mode = scheduler.getState();
        if (nv.date != mode.date || nv.mode != mode.mode)
          scheduler.setCurrentView($scope.scheduler.date, $scope.scheduler.mode);
      }, true);

      //size of scheduler
      $scope.$watch(function() {
        return $element[0].offsetWidth + "." + $element[0].offsetHeight;
      }, function() {
        scheduler.setCurrentView();
      });

      //styling for dhtmlx scheduler
      $element.addClass("dhx_cal_container");

      //init scheduler
      scheduler.init($element[0], $scope.scheduler.mode, $scope.scheduler.date);
    }
  }
})

.directive('dhxTemplate', ['$filter', function($filter){
  scheduler.aFilter = $filter;

  return {
    restrict: 'AE',
    terminal:true,
   
    link:function($scope, $element, $attrs, $controller){
      $element[0].style.display = 'none';

      var template = $element[0].innerHTML;
      template = template.replace(/[\r\n]/g,"").replace(/"/g, "\\\"").replace(/\{\{event\.([^\}]+)\}\}/g, function(match, prop){
        if (prop.indexOf("|") != -1){
          var parts = prop.split("|");
          return "\"+scheduler.aFilter('"+(parts[1]).trim()+"')(event."+(parts[0]).trim()+")+\"";
        }
        return '"+event.'+prop+'+"';
      });
      var templateFunc = Function('sd','ed','event', 'return "'+template+'"');
      scheduler.templates[$attrs.dhxTemplate] = templateFunc;
    }
  };
}])

.controller('MainSchedulerCtrl', function($scope) {
  $scope.events = [
    { id:1, text:"Los Angeles",
      start_date: new Date(2015, 05, 11),
      end_date: new Date(2015, 05, 15) },
    { id:2, text:"Las Vegas",
      start_date: new Date(2015, 05, 15 ),
      end_date: new Date(2015, 05, 18 ) }
  ];

  $scope.scheduler = { date : new Date(2015,05,10) };

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
$scope.images2 = [{url : 'img/bil.jpg', id: 21}, {url: 'img/helikopter.jpg', id: 22}, {url: 'img/roadtripicon.jpg',  id: 23}];
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
      $scope.fixa.$add({ text: $scope.item.text, info: '', messages: $scope.messages});
      $scope.item = {text: ""};
    }

    $scope.removeItem = function(fixa){
      $scope.fixa.$remove(fixa);
    }

    $scope.updateItem = function(packa){
       $scope.fixa.$save(fixa);
    }
})

.controller('FixaDetailCtrl', function($scope, $stateParams, $firebaseObject, Fixa, $firebaseArray, $ionicModal, $ionicSlideBoxDelegate, $filter ) {

$scope.showImages = false;

 $scope.images = [{url : 'img/bil.jpg', id: 11}, {url: 'img/helikopter.jpg', id: 12}, {url: 'img/roadtripicon.jpg',  id: 13}];
$scope.images2 = [{url : 'img/bil.jpg', id: 21}, {url: 'img/helikopter.jpg', id: 22}, {url: 'img/roadtripicon.jpg',  id: 23}];
$scope.images3 = [{url : 'img/bil.jpg', id: 31}, {url: 'img/helikopter.jpg', id: 32}, {url: 'img/roadtripicon.jpg',  id: 33}];


  $scope.showLaggtill = false;
   $scope.forslag = {text: '', lank: ''};

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
  $scope.fixa.bildid= id;
  $scope.fixa.$save();
  $scope.selectedFixa = $scope.fixa;
  $scope.showImages = false;
  $scope.bildurl = $scope.getBildUrl($scope.selectedFixa);

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
        $scope.infotext = "";
      }
    }

    $scope.raderaInfotext = function(){
      $scope.fixa.info = '';
      $scope.fixa.$save();
  }

  $scope.sparaForslag = function(forslag){
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
