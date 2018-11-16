var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Function that will determine the color of a district based on the district it belongs to
function chooseColor(mag) {
  switch (parseInt(mag)) {
  case "":
    return "teal";
  case 2:
    return "blue";
  case 3:
    return "green";
  case 4:
    return "orange";
  case 5:
    return "purple";
  default:
    return "black";
  }
}


var earthquakeLayer = L.geoJSON([], {
	pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng, {
			stroke: false,
			fillOpacity: 0.75,
			color: "red",
			//fillColor: "red",
			fillColor: chooseColor(feature.properties.mag),
			radius: feature.properties.mag*3
		})
	}
}).bindPopup(function(layer){
	return("<h3>" + layer.feature.properties.place +
		"<h3><hr><p>" + layer.featuer.properties.mag + "</p><hr>" +
		"</h3><p>" + new Date(layer.feature.properties.time) + "</p>"
		);
});

// Perform a GET request to the query URL
d3.json(queryURL,function(data) {
	earthquakeLayer.addData(data.features)
  // Once we get a response, send the data.features object to the createFeatures function
  // createFeatures(data.features);
});


var faultlineURL = "https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_plates.json"
var faultlineLayer = L.geoJSON([], {
	style: function(feature) {
		return {
			color: "gray",
			fill: false,
			weight: 2
		}
  }
});
// }).bindPopup(function (layer) {

// })



function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakeLayer,
    Fautlines: fautlineLayer
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakeLayer, faultlineLayer]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

CreateLegend();

function CreateLegend()
   {
   var legend = L.control({ position: "bottomright" });

   legend.onAdd = function() {
     var div = L.DomUtil.create("div", "info legend");
     var labels = ["0-1","1-2","2-3","3-4","4-5","5+"];
     var legends = [];
     //div.innerHTML = legendInfo;

     for(var i=0;i<labels.length;i++) {
       legends.push("<li style=\"list-style-type:none;\"><div style=\"background-color: " + getColor(i) + "\">&nbsp;</div> "+
                                                        "<div>"+ labels[i]+"</div></li>");
     }

     div.innerHTML += "<ul class='legend'>" + legends.join("") + "</ul>";
     return div;
   };

   // Adding legend to the map
   legend.addTo(myMap);
   }