
function GoogleMap(){
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    var addrs = [];
    var places;
    this.initialize = function(){  
        var map = showMap();
        addMarkersToMap(map);
    };
    
    var showMap = function(){
        var mapOptions = {
            zoom: 4,
            center: new google.maps.LatLng(-33, 151),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }; 
        var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        directionsDisplay.setMap(map); //alert("asdasd"); 
        var defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(-33.8902, 151.1759),
            new google.maps.LatLng(-33.8474, 151.2631));
        map.fitBounds(defaultBounds);
        addSearchBox(map);
        return map;
    }
    
    
    var addSearchBox = function(map){
        var input = /** @type {HTMLInputElement} */(document.getElementById("target"));
  
        var searchBox = new google.maps.places.SearchBox(input);
        var markers = [];
        
        google.maps.event.addListener(searchBox, 'places_changed', function() {
            places = searchBox.getPlaces();
        
            for (var i = 0, marker; marker = markers[i]; i++) {
                marker.setMap(null);
            }
        
            markers = [];
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0, place; place = places[i]; i++) {
                var image = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };
        
                var marker = new google.maps.Marker({
                    map: map,
                    icon: image,
                    title: place.name,
                    position: place.geometry.location
                });
        
            markers.push(marker);
        
            bounds.extend(place.geometry.location);
            }
            map.fitBounds(bounds);
        });
        
        google.maps.event.addListener(map, 'bounds_changed', function() {
            var bounds = map.getBounds();
            searchBox.setBounds(bounds);
        });
    }
    
    this.calcRoute = function() {
        var start = addrs[0];
        var end = addrs[0];
        var waypts = [];
        for (var i = 1; i < addrs.length; i++) {    
            waypts.push({
                location:addrs[i],
                stopover:true}); 
        }
        var request = {
            origin: start, 
            destination: end,
            waypoints: waypts,
            optimizeWaypoints: true,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                var route = response.routes[0];
                var summaryPanel = document.getElementById("directions_panel");
                summaryPanel.innerHTML = "";
                // For each route, display summary information.
                for (var i = 0; i < route.legs.length; i++) {
                    var routeSegment = i + 1;
                    summaryPanel.innerHTML += "<b>Route Segment: " + routeSegment + "</b><br />";
          summaryPanel.innerHTML += route.legs[i].start_address + " to ";
          summaryPanel.innerHTML += route.legs[i].end_address + "<br />";
          summaryPanel.innerHTML += route.legs[i].distance.text + "<br /><br />";
                }
            }
        });
    }
    
    this.addRoute = function(){
		var address = document.getElementById("target");
		
        /*for(var i = 0, place; place = places[i]; i++) {
        
            alert(place.geometry.location.lat());
            alert(place.geometry.location.lng());
        }*/
        //addrs.push(address.value);
        //alert(places.toString());
        var currLat = places[0].geometry.location.lat();
        var currLng = places[0].geometry.location.lng();
        //alert(currLng);
        addrs.push(new google.maps.LatLng(currLat, currLng));
        //alert(places[0].geometry.location.lat());
		
		//alert(addrs.toString());
	}
    
    var addMarkersToMap = function(map){
        
        var mapBounds = new google.maps.LatLngBounds();
        var latitudeAndLongitudeOne = new google.maps.LatLng('-33.890542','151.274856');
         
        var markerOne = new google.maps.Marker({
            position: latitudeAndLongitudeOne,
            map: map
        });
         
        var latitudeAndLongitudeTwo = new google.maps.LatLng('57.77828', '14.17200');
         
        var markerOne = new google.maps.Marker({
            position: latitudeAndLongitudeTwo,
            map: map
        });
        
        mapBounds.extend(latitudeAndLongitudeOne);
        mapBounds.extend(latitudeAndLongitudeTwo);
 
        map.fitBounds(mapBounds);
    }
}

