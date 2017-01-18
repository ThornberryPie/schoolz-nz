var app = angular.module('schoolzApp', ['ngMap']);

app.controller('mapControl', function($scope, $http, $interval) {
  var map;

  //Get the database from schoolz.js
  $scope.schoolz = schoolz;
  $scope.substationz = substationz;
  $scope.pylonz = pylonz;
  //$scope.busz = busz;
  $scope.playcentrez = playcentrez;

  $scope.defaultAddress = 'Whangarei, New Zealand';
  $scope.address = $scope.defaultAddress;

  //$scope.zoomDefault = 5;
  $scope.zoomDefault = 12;
  $scope.zoom = $scope.zoomDefault;

  $scope.clusterIcon = 'images/cluster.png';
  $scope.clusterIconTextColor = 'white';
  $scope.clusterIconSize = 50;
	$scope.clusterActive = true;

  $scope.dynMarkers = [];
  $scope.windows = [];
  $scope.schoolhtml = [];
  $scope.substationhtml = [];
  $scope.lines = [];
  $scope.routz = [];
  $scope.playcentrehtml = [];

	$scope.checkedSchools = true;
	$scope.checkedPlaycentres = false;
	$scope.checkedSubstations = false;
	$scope.checkedPylons = true;

  //Init function
  $scope.$on('mapInitialized', function(event, evtMap) {

    map = evtMap;
    var red = '#ec2933';
    var green = '#23d84f';
    var blue = '#40b1fa';
    var pts = [];

    //Add power lines
    for(var i=0; i < $scope.pylonz.length; i++){
        var line = $scope.pylonz[i];
        //var name =  line.getAttribute("label");
        //console.log(name);
        for(var j in line){
            //console.log(line[j]);
            $scope.lines[j] = new google.maps.Polyline({
              map: map,
              path: line[j],
              geodesic: true,
              strokeColor: red,
              strokeOpacity: 1.0,
              strokeWeight: 2
          });
        }
				if(!$scope.checkedPylons){
					$scope.lines[j].setVisible(false);
				}
    }

    //Add bus routz
    /*for(var i=0; i < $scope.busz.length; i++){
        var bus = $scope.busz[i];
        //console.log(bus.name);
        $scope.routz[i] = new google.maps.Polyline({
          map: map,
          path: bus.coords,
          geodesic: true,
          strokeColor: blue,
          strokeOpacity: 1.0,
          strokeWeight: 2
        });
    }*/


    //Add schools
    for (var i=0; i < $scope.schoolz.length; i++) {

      var s = new School(i);

      var latLng = new google.maps.LatLng(s.lat, s.lng);

      //Add markers
      var marker = new google.maps.Marker({
        position: latLng,
        title: s.markerTitle,
        icon: 'images/school.png',
				map: map
      });

      $scope.dynMarkers[s.id] = marker;

      //Set infowindow in a function or it won't work properly
      s.setInfowindow(marker, s.schoolhtml, s.id, map);

			if(!$scope.checkedSchools){
				$scope.dynMarkers[s.id].setVisible(false);
			}

    }

    //Add playcentres
    for (var i=0; i < $scope.playcentrez.length; i++) {

      var p = new Playcentre(i);

      var latLng = new google.maps.LatLng(p.lat, p.lng);

      //Add markers
      var marker = new google.maps.Marker({
        position: latLng,
        title: p.markerTitle,
        icon: 'images/playcentre.png',
				map: map
      });

      $scope.dynMarkers[p.id] = marker;

      //Set infowindow in a function or it won't work properly
      s.setInfowindow(marker, p.playcentrehtml, p.id, map);

			if(!$scope.checkedPlaycentres){
				$scope.dynMarkers[p.id].setVisible(false);
			}

    }

		//Add substations
		for (var i=0; i < $scope.substationz.length; i++) {

      var s = new Substation(i);

      var latLng = new google.maps.LatLng(s.lat, s.lng);

      //Add markers
      var marker = new google.maps.Marker({
        position: latLng,
        title: s.address+', '+s.suburb,
        icon: 'images/substation.png',
				map: map
      });

      $scope.dynMarkers[s.id] = marker;

			//Hide markers if they should be hidden on page load
			if(!$scope.checkedSubstations){
				$scope.dynMarkers[s.id].setVisible(false);
			}

    }

    //Style clusterers
		if($scope.clusterActive){
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
		}

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
        $scope.zoom = 18;
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

    //Clear search field if set to default value
    if(document.getElementById('map_search').value == $scope.defaultAddress){
      document.getElementById('map_search').value = '';
    }

  });//end $scope.$on('mapInitialized'

	$scope.toggleMarkerType = function(type){

		switch(type){
			case 'schools':
				var markerArray = $scope.schoolz;
				var boxModel = $scope.checkedSchools;
			break;
			case 'substations':
				var markerArray = $scope.substationz;
				var boxModel = $scope.checkedSubstations;
			break;
			case 'pylons':
				var markerArray = $scope.pylonz;
				var boxModel = $scope.checkedPylons;
			break;
			case 'playcentres':
				var markerArray = $scope.playcentrez;
				var boxModel = $scope.checkedPlaycentres;
			break;
		}
		var showMarkers = (boxModel) ? true : false;
		//Loop through all items in selected array and show/hide markers
		for (var i=0; i < markerArray.length; i++) {
			var id = markerArray[i].id;
			$scope.dynMarkers[id].setVisible(showMarkers);
		}

		//google.maps.event.trigger(map,'resize');

	};

});//end app.controller
