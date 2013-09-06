

google.maps.event.addDomListener(window, 'load', setup); 

function setup() {
    // wait for PhoneGap to load
    document.addEventListener("deviceready", onDeviceReady, false);
        
    function onDeviceReady() {
        // get device's geographical location and return it as a Position object (which is then passed to onSuccess)
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
}

function onSuccess(position) { 
    var myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    map  = new google.maps.Map(document.getElementById('geoLocation'), {
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	center: myLocation,
	zoom: 15
    }); 
}

var request = { location: myLocation, radius: currentRadiusValue, types: [currentPlaceType] }; 

var service = new google.maps.places.PlacesService(map); 
service.nearbySearch(request, callback);

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
	map: map,
	position: place.geometry.location
    }); 
}

infowindow  = new google.maps.InfoWindow();

google.maps.event.addListener(marker, 'click', function () {
	infowindow.setContent(place.name);
	infowindow.open(map, this);
});