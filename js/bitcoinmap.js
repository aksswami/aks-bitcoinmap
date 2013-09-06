var mapData = null;
var map = null;

function coinmap(position) {
    var lat = null;
    var lng = null;
    if (null !== position) {
        lat = position.coords.latitude;
        lng = position.coords.longitude;
    }
    lat = 40.02;
    lng = -87.023;
    loadMap(lat, lng);
}


function loadMap(latitude, longitude) {

    var my_latLng = new google.maps.LatLng(latitude, longitude);
    var mapOptions = {
        zoom: 8,
        center: my_latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        minZoom: 2

    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    var my_marker = new google.maps.Marker({
        position: my_latLng,
        map: map,
        title: 'My Position',
        animation: google.maps.Animation.DROP

    });
    //google.maps.event.addListener(my_marker, 'click', toggleBounce(my_marker));

    var markers = [];
    var user_radius = 1000000;
    $.getJSON("http://overpass.osm.rambler.ru/cgi/interpreter?data=[out:json];(node[%22payment:bitcoin%22=yes];way[%22payment:bitcoin%22=yes];%3E;);out;", function (data) {
        mapData = data;
        $.each(data.elements, function (key, value) {

            var latLng = new google.maps.LatLng(value.lat, value.lon);
            var marker = new google.maps.Marker({
                position: latLng,
                animation: google.maps.Animation.DROP
            });
            //google.maps.event.addListener(marker, 'click', toggleBounce);
            markers.push(marker);
        });

        var markerCluster = new MarkerClusterer(map, markers);
        tooltipBubble(markers);


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

    });
}


function tooltipBubble(markers) {
    if (null !== mapData) {
        var i = 0;
        $.each(mapData.elements, function (key, value) {
            var infoBubble = new InfoBubble({
                map: map,
                content: "<a href='" + value.node + "'>" + value.tags + "</a>",
                hideCloseButton: false,
            });

            //infoBubble.open(map, this.marker);

            google.maps.event.addListener(markers[i], 'click', function(infoBubble, i) {
                if (!infoBubble.isOpen()) {
                    infoBubble.open(map, markers[i]);
                }
            });
        });
        i++;
    }
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