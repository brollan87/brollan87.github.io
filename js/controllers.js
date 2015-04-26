angular.module('starter.controllers', [])

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

.controller('FixaCtrl', function($scope, Fixa) {
  $scope.fixa = Fixa.all();
  $scope.remove = function(fixa) {
    Fixa.remove(fixa);
   }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('PackaCtrl', function($scope, Packa) {
   $scope.packa = Packa.all();
  $scope.remove = function(packa) {
    Packa.remove(packa);
   }
});
