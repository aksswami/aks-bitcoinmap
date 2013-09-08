var mapData = null;
var map = null;
var latitude = 40.02;
var longitude = -87.023;
var infowindow = null;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

function coinmap(position) {
    if (null !== position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
    }

    userLocation();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(coinmap, onError, {
            maximumAge: 300000,
            timeout: 10000,
            enableHighAccuracy: true
        });

    } else {
        alert("GeoLocation is not available.");
    }

}

function userLocation() {

    var image = 'img/my_location.png';
    var latLng = new google.maps.LatLng(latitude, longitude);
    var my_marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: 'My Position',
        animation: google.maps.Animation.DROP,
        icon: image

    });
    if (map !== null) {
        setMarker(map);
    }

    var bounds = new google.maps.LatLngBounds();
    bounds.extend(latLng);
    map.fitBounds(bounds);
    map.setCenter(latLng);
    map.setZoom(10);
}


function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var my_latLng = new google.maps.LatLng(latitude, longitude);
    var mapOptions = {
        zoom: 8,
        center: my_latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        minZoom: 2

    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('direction_panel'));
    infowindow = new google.maps.InfoWindow({
        content: "loading..."
    });
    getLocation();

    // Define the circle
    /* var circle = new google.maps.Circle({
            map: map,
            clickable: false,
            // metres
            radius: user_radius,
            fillColor: '#fff',
            fillOpacity: .6,
            strokeColor: '#313131',
            strokeOpacity: .4,
            strokeWeight: .8
        });
        // Attach circle to marker
        circle.bindTo('center', my_marker, 'position');
        // Get the bounds
        var bounds = circle.getBounds();
        for (var i = 0; i < markers.length; i++) {
            if (bounds.contains(markers[i].getPosition())) {
                //markers[i].setAnimation(google.maps.Animation.DROP);
                markers[i].setMap(map);
            } else {
                markers[i].setMap(null);
            }
        }*/


}

function setMarker(map) {
    //var bound = new google.maps.LatLngBounds();
    var markers = [];
    var user_radius = 1000000;
    $.getJSON("http://overpass.osm.rambler.ru/cgi/interpreter?data=[out:json];(node[%22payment:bitcoin%22=yes];way[%22payment:bitcoin%22=yes];%3E;);out;", function (data) {
        mapData = data;
        var i = 0;
        $.each(data.elements, function (key, value) {
            var tag = value.tags;
            if (undefined !== tag) {
                if (tag['payment:bitcoin'] == 'yes') {
                    i++;
                    var latLng = new google.maps.LatLng(value.lat, value.lon);
                    var markerDetail = locationDetails(value.tags);
                    var buttonDetails = routeButton(latLng);
                    var icon_image = determineIcon(value.tags);
                    var marker = new google.maps.Marker({
                        position: latLng,
                        animation: google.maps.Animation.DROP,
                        html: (markerDetail + buttonDetails),
                        zIndex: 2,
                        icon: icon_image
                    });
                    //bound.extend(latLng);
                    google.maps.event.addListener(marker, "click", function () {
                        infowindow.setContent(this.html);
                        infowindow.open(map, this);

                    });

                    //google.maps.event.addListener(marker, 'click', toggleBounce);
                    markers.push(marker);
                }
            }
        });
        console.log(i);
        //map.fitBounds(bound);
        var markerCluster = new MarkerClusterer(map, markers);
    });
}

function locationDetails(tags) {
    var details = "</br> ";
    if (undefined !== tags) {
        if (undefined !== tags.name)
            details = '<strong>' + tags.name + '</strong></br>';
        if (undefined !== tags.phone)
            details += '<strong>Phone : </strong><em>' + tags.phone + '</em></br>';
        if (undefined !== tags.website)
            details += '<a href="' + tags.website + '">' + tags.website + '</a>';
    }
    return details;
}

function routeButton(latLng) {
    var rbutton = "</br> ";
    if (undefined !== latLng) {
        var abc = 'new google.maps.LatLng' + latLng.toString();
        rbutton = '</br><button onclick="routeMyPosition(' + abc + ');">Direction</button>';
    }
    return rbutton;
}

function routeMyPosition(abc) {
    console.log(abc);
    $('#direction_panel').height($('#map').height());
    $('#direction_panel').html('<img src="img/waiting.gif"></img>');
    calcRoute(new google.maps.LatLng(latitude, longitude), abc);
}

function onError(error) {
    alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

function toggleBounce(marker) {

    if (marker.getAnimation() != null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

function determineIcon(tags) {
    var icon_id = 'bitcoin';
    var split_kv = null;
    var k = null;
    var v = null;
    var temp = undefined;
    for (keyvalue in icon_mapping) {
        if (!icon_mapping.hasOwnProperty(keyvalue)) {
            //The current property is not a direct property of p
            continue;
        } else {
            split_kv = keyvalue.split(':');
            k = split_kv[0];
            v = split_kv[1];
            temp = tags[k];

            if (undefined === temp)
                continue;
            if (temp === v) {
                icon_id = icon_mapping[keyvalue];
                break;
            }
        }
    }
    var icon = icon_mapped[icon_id];
    //console.log(icon);
    return icon;
}

function calcRoute(start, end) {
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            $('#direction_panel').empty();
            directionsDisplay.setDirections(response);
        } else {
            alert("Sorry, Service not available for this route.");
        }
    });
}