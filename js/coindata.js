function getCoinData(markers){
   
    $.getJSON("http://overpass.osm.rambler.ru/cgi/interpreter?data=[out:json];(node[%22payment:bitcoin%22=yes];way[%22payment:bitcoin%22=yes];%3E;);out;", function(data){
        
    $.each(data.elements, function(key, value){
         
        /*if(key == "elements")
        $.each(value, function(key1, value1){
            $.each(value1, function(key2, value2){
                 document.write(key2 +": "+value2+"<br/>");
            });
            document.write(key1 +": "+value1+"<br/>");
        
        });*/
        var latLng = new google.maps.LatLng(value.lat,value.lon);
        
        var marker = new google.maps.Marker({'position': latLng});
        markers.push(marker);
       /* document.write(key+": "+value+"<br />"); 
        document.write(value.lat);*/
    });
        alert("hello");
});
}