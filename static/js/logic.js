// Creating the map variable
let myMap = L.map("map", {
    center: [40.7608, -111.8910],
    zoom: 5
  });

// Adding the layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//Defining Function for color scale as per depth
function color(depth) {
  return depth > 90 ? "#d32f2f" :
      depth > 70 ? "#e64a19" :
          depth > 50 ? "#f57f17" :
              depth > 30 ? "#fbc02d" :
                  depth > 10 ? "#81c784" :
                      "#388e3c";
}
//Defining function for size of circles as per magnitude
function marker(magnitude) {
  return magnitude * 10000
}

// Import Data
let quake_data = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Get the data with d3.
d3.json(quake_data).then(function(data) {

    console.log(data);

  //Storing Earthquake data in a variable.
  let quake = data.features

  // Using for loop to reiterate through data set and get coordinates. 
  for (let i = 0; i < quake.length; i++) {

      let coords = quake[i].geometry.coordinates
      let mag = quake[i].properties.mag
      let time = new Date(quake[i].properties.time).toLocaleString()
      let timeUpdated = new Date(quake[i].properties.updated).toLocaleString()
      let markers = L.circle([coords[1], coords[0]], {
          color: 'black',
          fillColor: color(coords[2]),
          fillOpacity: 0.75,
          radius: marker(mag),
          weight: 0.5
      }).addTo(myMap);

      markers.bindPopup("<strong>" + quake[i].properties.place +
          "</strong><br /><br />Magnitude of Earthquake (ML):  " +
          quake[i].properties.mag + "<br /><br />Time of Earthquake: "
          + time + "<br /><br /> Last Updated: " + timeUpdated)
  }
  // Creating legend 
  let legend = L.control({ position: 'bottomleft' })
  legend.onAdd = function () {
      var div = L.DomUtil.create('div', 'info legend')
      var limits = [0, 10, 30, 50, 70, 90]
      var colors = ["#388e3c", "#81c784", "#fbc02d", "#f57f17", "#e64a19", "#d32f2f"]

      for (var i = 0; i < limits.length; i++) {
          div.innerHTML +=
              '<i style="background:' + colors[i] + '"></i> ' +
              limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
      }

      return div;
  };

  legend.addTo(myMap)
});