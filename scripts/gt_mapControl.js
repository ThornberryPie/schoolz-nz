var app = angular.module('schoolzApp', ['ngMap']);

app.controller('mapControl', function($scope, $http, $interval) {
  var map;
  $scope.defaultAddress = 'Otara, New Zealand';
  $scope.address = $scope.defaultAddress;
  $scope.zoomDefault = 16;
  $scope.zoom = $scope.zoomDefault;
  $scope.clusterIcon = 'images/markers/cluster.png';
  $scope.clusterIconTextColor = 'white';
  $scope.clusterIconSize = 32;
  $scope.cookeExpiryDays = 30;
	$scope.opacity = 0.666;
	$scope.openWindow = '';

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

		//Pan to marker and show infowindow when marker is clicked
		google.maps.event.addListener(marker, 'click', function() {
			if($scope.openWindow !== ''){
				$scope.openWindow.close();
			}
			infowindow.open(map, this);
			map.panTo(this.position);

			$scope.openWindow = infowindow;
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
			case 'kindys':
				var markerArray = $scope.kindyz;
				var boxModel = $scope.checkedKindys;
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

	$scope.dynMarkers = [];
	$scope.lines = [];
	$scope.busroutz = [];
  //Load data
  $scope.schoolz = schoolz2016;
  $scope.substationz = substationz;
  $scope.pylonz = pylonz;
  //$scope.busz = busz;
  $scope.playcentrez = playcentrez;
	$scope.kindyz = kindyz;
	$scope.kindygroupz = kindygroupz;


	$scope.clusterActive = ($scope.getCookie('clustering') == 'off') ? false : true;

	$scope.checkedSchools = ($scope.getCookie('schools') == 'off') ? false : true;
	$scope.checkedPlaycentres = ($scope.getCookie('playcentres') == 'off') ? false : true;
	$scope.checkedSubstations = ($scope.getCookie('substations') == 'off') ? false : true;
	$scope.checkedPylons = ($scope.getCookie('pylons') == 'off') ? false : true;
	$scope.checkedKindys = ($scope.getCookie('kindys') == 'off') ? false : true;

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
              strokeOpacity: $scope.opacity,
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


		//Add markers to map
		$scope.addMarkers = function(type, count, show){

			var addMarker = false;
			//Don't add markers if clustering is on and this market type is not checked
			if($scope.clusterActive){
				if(show){
					addMarker = true;
				}
			}else{
				addMarker = true;
			}

			//Exit function if this marker type shouldn't be shown
			if(!addMarker){
				return;
			}

			for (var i=0; i < count; i++) {
				switch(type){
					case 'schools':
						var obj = new School(i);
						var markerTitle = obj.markerTitle;
						var markerIcon = 'images/markers/school.png';
					break;
					case 'substations':
						var obj = new Substation(i);
						var markerTitle = obj.address+', '+obj.suburb;
						var markerIcon = 'images/markers/substation.png';
					break;
					case 'kindys':
						var obj = new Kindy(i);
						var markerTitle = obj.name;
						var markerIcon = 'images/markers/kindy.png';
						//Use group icon if kindy group is defined
						if(obj.group !== ''){
							for (var j=0; j < $scope.kindygroupz.length; j++) {
								if($scope.kindygroupz[j].name == obj.group){
									markerIcon = 'images/markers/kg/'+$scope.kindygroupz[j].image;
								}
							}
						}
					break;
					case 'playcentres':
						var obj = new Playcentre(i);
						var markerTitle = obj.markerTitle;
						var markerIcon = 'images/markers/playcentre.png';
					break;
				}

	      var latLng = new google.maps.LatLng(obj.lat, obj.lng);

	      //Add markers
	      var marker = new google.maps.Marker({
	        position: latLng,
	        title: markerTitle,
	        icon: markerIcon,
					map: map,
					opacity: (type == 'schools') ? 1 : $scope.opacity
	      });

	      $scope.dynMarkers[obj.id] = marker;

				//Set infowindows for all marker types except substations
				if(type != 'substations'){
				             //Set infowindow in a function or it won't work properly
			      $scope.setInfowindow(marker, obj.infowindowhtml, obj.id, map);
				}

				//Hide markers if they should be hidden on page load
				if(!show){
					$scope.dynMarkers[obj.id].setVisible(false);
				}

	    }
		};

		//Add markers
		$scope.addMarkers('schools', $scope.schoolz.length, $scope.checkedSchools);
		$scope.addMarkers('substations', $scope.substationz.length, $scope.checkedSubstations);
		$scope.addMarkers('kindys', $scope.kindyz.length, $scope.checkedKindys);
		$scope.addMarkers('playcentres', $scope.playcentrez.length, $scope.checkedPlaycentres);


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

//Start jQuery
$(document).ready(function(){

	var legend = $('.map-legend');

	//Add min height to legend so button still shows when legend is hidden
	legend.css('min-height', legend.outerHeight());

	//Toggle map legend
	$('.toggle-legend-view').on('click', function(){
		$('.map-legend').toggleClass('open');
	});

});
