var app = angular.module('schoolzApp', ['ngMap']);

app.controller('mapControl', function($scope, $http, $interval) {
  var map;

	$scope.setCookie = function(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	};

	$scope.getCookie = function(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
	};

	$scope.setInfowindow = function(marker, html, id, map){
		var infowindow = new google.maps.InfoWindow({
			//position: latLng,
			content: html
		});

		this.infowindow = infowindow;

		//this.windows.push(infowindow);

		//Pan to marker and show infowindow when marker is clicked
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map, this);
			map.panTo(this.position);
		});
	};

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
		var cookieVal = (showMarkers) ? 'on' : 'off';

		//Update cookie
		$scope.setCookie(type, cookieVal, $scope.cookeExpiryDays);

		//Reload page if clustering is turned on
		if($scope.clusterActive){
			location.reload();
		}else{
			//Loop through all items in selected array and show/hide markers
			for (var i=0; i < markerArray.length; i++) {
				if(type == 'pylons'){
					var showLines = (showMarkers) ? map : null;
					for(var j in $scope.pylonz[i]){
						 $scope.lines[j].setMap(showLines);
					}
				}else{
					var id = markerArray[i].id;
					$scope.dynMarkers[id].setVisible(showMarkers);
				}
			}
		}

	};

	$scope.toggleClustering = function(){
		var cookieVal = 'off';
		if($scope.clusterActive){
			cookieVal = 'on';
		}
		$scope.setCookie('clustering', cookieVal, $scope.cookeExpiryDays);
		location.reload();
	};

  //Load data
  $scope.schoolz = schoolz;
  $scope.substationz = substationz;
  $scope.pylonz = pylonz;
  //$scope.busz = busz;
  $scope.playcentrez = playcentrez;

  $scope.defaultAddress = 'Whangarei, New Zealand';
  $scope.address = $scope.defaultAddress;

  $scope.zoomDefault = 12;
  $scope.zoom = $scope.zoomDefault;

  $scope.clusterIcon = 'images/cluster.png';
  $scope.clusterIconTextColor = 'white';
  $scope.clusterIconSize = 50;
	$scope.clusterActive = ($scope.getCookie('clustering') == 'off') ? false : true;

  $scope.dynMarkers = [];
  $scope.windows = [];
  $scope.schoolhtml = [];
  $scope.substationhtml = [];
  $scope.lines = [];
  $scope.busroutz = [];
  $scope.playcentrehtml = [];

	$scope.checkedSchools = ($scope.getCookie('schools') == 'off') ? false : true;
	$scope.checkedPlaycentres = ($scope.getCookie('playcentres') == 'off') ? false : true;
	$scope.checkedSubstations = ($scope.getCookie('substations') == 'off') ? false : true;
	$scope.checkedPylons = ($scope.getCookie('pylons') == 'off') ? false : true;

	$scope.cookeExpiryDays = 30;

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
            $scope.lines[j] = new google.maps.Polyline({
              map: map,
              path: line[j],
              geodesic: true,
              strokeColor: red,
              strokeOpacity: 1.0,
              strokeWeight: 2
          });

					if(!$scope.checkedPylons){
						$scope.lines[j].setMap(null);
					}
        }

    }

    //Add bus routz
    /*for(var i=0; i < $scope.busz.length; i++){
        var bus = $scope.busz[i];
        //console.log(bus.name);
        $scope.busroutz[i] = new google.maps.Polyline({
          map: map,
          path: bus.coords,
          geodesic: true,
          strokeColor: blue,
          strokeOpacity: 1.0,
          strokeWeight: 2
        });
    }*/


    //--------------Schools-------------------
		//Only add markers if both clustering and this marker type are turned on

		var addSchoolsMarker = false;

		if($scope.clusterActive){
			if($scope.checkedSchools){
				addSchoolsMarker = true;
			}
		}else{
			addSchoolsMarker = true;
		}

		if(addSchoolsMarker){
			for (var i=0; i < $scope.schoolz.length; i++) {

	      var s = new School(i);

	      var latLng = new google.maps.LatLng(s.lat, s.lng);

	      //Add markers
	      var marker = new google.maps.Marker({
	        position: latLng,
	        title: s.markerTitle,
	        icon: 'images/school.png',
					map: map,
					opacity: 0.8
	      });

				$scope.dynMarkers[s.id] = marker;
				//Set infowindow in a function or it won't work properly
	      $scope.setInfowindow(marker, s.schoolhtml, s.id, map);
				//Hide marker if unckecked
				if(!$scope.checkedSchools){
					$scope.dynMarkers[s.id].setVisible(false);
				}

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
				map: map,
				opacity: 0.9
      });

      $scope.dynMarkers[p.id] = marker;

      //Set infowindow in a function or it won't work properly
      $scope.setInfowindow(marker, p.playcentrehtml, p.id, map);

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
				map: map,
				opacity: 0.7
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

        var fieldVal = s.Name+', '+s.City;

        if(fieldVal == $scope.address){
          isSchool = true;
          sid = s.id;
        }

      }
      if(isSchool){
        //Set zoom if school is found
        $scope.zoom = 16;
        //Open school's infowindow
        google.maps.event.trigger($scope.dynMarkers[sid], 'click');
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

});//end app.controller
