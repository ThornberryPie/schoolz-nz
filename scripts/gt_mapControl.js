var app = angular.module('schoolzApp', ['ngMap']);

app.controller('mapControl', function($scope, $http, $interval) {
  var map;

  //Get the database from schoolz.js
  $scope.schoolz = schoolz;

  $scope.defaultAddress = 'new zealand';
  $scope.address = $scope.defaultAddress;

  $scope.zoomDefault = 5;
  $scope.zoom = $scope.zoomDefault;

  $scope.clusterIcon = 'images/cluster.png';
  $scope.clusterIconTextColor = 'white';
  $scope.clusterIconSize = 50;

  $scope.dynMarkers = [];
  $scope.windows = [];
  $scope.schoolhtml = [];

  //Init function
  $scope.$on('mapInitialized', function(event, evtMap) {

    map = evtMap;

    for (var i=0; i < $scope.schoolz.length; i++) {

      var s = new School(i);

      var latLng = new google.maps.LatLng(s.lat, s.lng);

      //Add markers
      var marker = new google.maps.Marker({
        position: latLng,
        title: s.markerTitle,
        icon: 'images/school.png'
      });

      $scope.dynMarkers[s.schoolID] = marker;

      //Set infowindow in a function or it won't work properly
      s.setInfowindow(marker, s.schoolhtml, s.id, map);

    }
    //Style clusterers
    var clusterStyles = [
      {
        textColor: $scope.clusterIconTextColor,
        url: $scope.clusterIcon,
        height: $scope.clusterIconSize,
        width: $scope.clusterIconSize
      },
      {
        textColor: $scope.clusterIconTextColor,
        url: $scope.clusterIcon,
        height: $scope.clusterIconSize,
        width: $scope.clusterIconSize
      },
      {
        textColor: $scope.clusterIconTextColor,
        url: $scope.clusterIcon,
        height: $scope.clusterIconSize,
        width: $scope.clusterIconSize
      }
    ];

    var mcOptions = {
        gridSize: $scope.clusterIconSize,
        styles: clusterStyles
    };

    //Add Markers
    $scope.markerClusterer = new MarkerClusterer(map, $scope.dynMarkers, mcOptions);

    //Datalist event listeners
    $scope.searchChange = function(){
      //Zoom in to school if one is selected
      var isSchool = false;
      var sid = '';

      for (var i=0; i < $scope.schoolz.length; i++) {

        var s = $scope.schoolz[i];

        var fieldVal = s.FIELD2+', '+s.FIELD23;

        if(fieldVal == $scope.address){
          isSchool = true;
          sid = fieldVal;
        }
      }
      if(isSchool){
        //Set zoom if school is found
        $scope.zoom = $scope.zoomDefault * 3;
        //Open school's infowindow
        google.maps.event.trigger($scope.dynMarkers[$scope.address], 'click');
      }
    };

    //Keep map in NZ
    $scope.allowedBounds = new google.maps.LatLngBounds(
         new google.maps.LatLng(-47.567955, 166.168009), 
         new google.maps.LatLng(-33.164021, -173.855656)
    );

    var lastCenter = map.getCenter();

    google.maps.event.addListener(map, 'dragstart', function() {
        lastCenter = map.getCenter();
    });

    google.maps.event.addListener(map, 'dragend', function() {
        if($scope.allowedBounds.contains(map.getCenter())) return;

        map.setCenter(lastCenter);
    });

  });//end $scope.$on('mapInitialized'

});//end app.controller