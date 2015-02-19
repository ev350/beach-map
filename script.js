jQuery(function($) {
    // Asynchronously Load the map API
    var script = document.createElement('script');
    script.src = "http://maps.googleapis.com/maps/api/js?sensor=false&callback=initialize";
    document.body.appendChild(script);
});

function initialize() {
    var map;
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
        mapTypeId: 'hybrid',
    };

    // Display a map on the page
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    map.setTilt(45);


    var layer = new google.maps.FusionTablesLayer({
      query: {
        select: 'Location',
        from: '1NIVOZxrr-uoXhpWSQH2YJzY5aWhkRZW0bWhfZw'
      },
      map: map
    });

    // Create the legend and display on the map
    var legend = document.createElement('div');
    legend.id = 'legend';
    var content = [];
    content.push('<h3>Water Quality</h3>');
    content.push('<p><div class="color grey"></div>Not Tested</p>');
    content.push('<p><div class="color black"></div>Fail</p>');
    content.push('<p><div class="color red"></div>Poor</p>');
    content.push('<p><div class="color orange"></div>Acceptable</p>');
    content.push('<p><div class="color blue"></div>Good</p>');
    content.push('<p><div class="color green"></div>Excellent</p>');
    legend.innerHTML = content.join('');
    legend.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);



    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;

    // Loop through our array of markers & place each one on the map
    for( i = 0; i < beaches.length; i++ ) {
        (function(beach) {
          var position = new google.maps.LatLng(beach.latitude, beach.longitude);
          bounds.extend(position);

          var pinNotTested = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + "A3A3A3",
            new google.maps.Size(21, 34),
            new google.maps.Point(0,0),
            new google.maps.Point(10, 34));

          var pinFail = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + "000000",
            new google.maps.Size(21, 34),
            new google.maps.Point(0,0),
            new google.maps.Point(10, 34));

          var pinPoor = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + "FF0000",
            new google.maps.Size(21, 34),
            new google.maps.Point(0,0),
            new google.maps.Point(10, 34));

          var pinAcceptable = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + "FF9900",
            new google.maps.Size(21, 34),
            new google.maps.Point(0,0),
            new google.maps.Point(10, 34));

          var pinGood = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + "3399FF",
            new google.maps.Size(21, 34),
            new google.maps.Point(0,0),
            new google.maps.Point(10, 34));

          var pinExcellent = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + "00FF00",
            new google.maps.Size(21, 34),
            new google.maps.Point(0,0),
            new google.maps.Point(10, 34));


          marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: ({
                "Not Tested": pinNotTested,
                "Fail (swimming not advised)": pinFail,
                "Poor": pinPoor,
                "Acceptable": pinAcceptable,
                "Good": pinGood,
                "Excellent": pinExcellent
            })[beach.waterQuality],
            title: beach.name
          });

          // Allow each marker to have an info window
          google.maps.event.addListener(marker, 'click', (function(marker, i) {
              return function() {
                  infoWindow.setContent(
                      '<div class="info_content">' +
                      '<h2>' + beach.name + '</h2>' +
                      '<p><b>Activities: </b>' + (beach.activities || 'None').split('\n').join('<br />') + '</p>' +
                      '<p><b>Facilities: </b>' + (beach.facilities || 'None') + '</p>' +
                      '<p><b>Lifeguard: </b>' + beach.lifeguard + '</p>' +
                      '<p><b>Beach Type: </b>' + beach.type + '</p>' +
                      '<p><b>Water Quality: </b>' + beach.waterQuality + '</p>' +
                      '<hr />' +
                      '<p><b>Info: </b>' + beach.touristInfo + '</p>' +
                      '</div>'
                  );

                  infoWindow.open(map, marker);
              }
          })(marker, i));

          // Automatically center the map fitting all markers on the screen
          map.fitBounds(bounds);

        })(beaches[i]);
    }

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(6);
        google.maps.event.removeListener(boundsListener);
    });

}
