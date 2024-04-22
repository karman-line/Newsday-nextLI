
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/style.json',   
    //'https://api.maptiler.com/maps/dataviz/style.json?key=YqvLLeXqjNmKZqMQQeMb',
    center: [-73.16693025867198,40.804516529189186],
    zoom: 9.0,
    bearing: 0,
    pitch: 40,
    interactive: false
});


// 2050
fetch('https://newsday.carto.com/api/v2/sql?api_key=KX0PHwIl-egHMqmINEHNUg&q=SELECT cartodb_id,ST_AsGeoJSON(the_geom) as the_geom FROM nextli_floodplain_30inch')
        .then(response => {
            if (response.ok) {
                console.log("It's working!!!")
                return response.json();
            }
            throw new Error('Network response was not ok at LI_30in_100.');
        })
        .then(data => {
            // Convert the data to GeoJSON
            const geojsonX = {
                type: 'FeatureCollection',
                features: data.rows.map(row => {
                    return {
                        type: 'Feature',
                        geometry: JSON.parse(row.the_geom),
                        properties: { ...row, the_geom: undefined }
                    };
                })
            };

            // Add the LI_30in_100 (first) source and layer to the map
            map.addSource('geojson1', {
                'type': 'geojson',
                'data': geojsonX
            });
            map.addLayer({
                'id': 'geojson-layer1',
                'type': 'fill',
                'source': 'geojson1',
                'layout': {},
                'paint': {
                    'fill-color': '#A621FA',
                    'fill-opacity': 0.4
                }
            });
        })
        .catch(error => {
            console.log('There has been a problem with your fetch operation at LI_30in_100: ', error.message);
        });

// 2100
fetch('https://newsday.carto.com/api/v2/sql?api_key=KX0PHwIl-egHMqmINEHNUg&q=SELECT cartodb_id,ST_AsGeoJSON(the_geom) as the_geom FROM nextli_floodplain_72in')
        .then(response => {
            if (response.ok) {
                console.log("It's working!!!")
                return response.json();
            }
            throw new Error('Network response was not ok at LI_72in_100.');
        })
        .then(data1 => {
            // Convert the data to GeoJSON
            const geojson = {
                type: 'FeatureCollection',
                features: data1.rows.map(row => {
                    return {
                        type: 'Feature',
                        geometry: JSON.parse(row.the_geom),
                        properties: { ...row, the_geom: undefined }
                    };
                })
            };

            // Add the LI_72in_100 (first) source and layer to the map
            map.addSource('geojson2', {
                'type': 'geojson',
                'data': geojson
            });
            map.addLayer({
                'id': 'geojson-layer2',
                'type': 'fill',
                'source': 'geojson2',
                'layout': {
                    'visibility': 'none'
                },
                'paint': {
                    'fill-color': '#A6BC09',
                    'fill-opacity': 0.4
                }
            });
        })
        .catch(error => {
            console.log('There has been a problem with your fetch operation at LI_72in_100: ', error.message);
        });


map.scrollZoom.disable();

const chapters = {
    'longIsland': {
        center: [-73.22622979347139,40.80298488151999],
        zoom: 8.3,
        bearing: 0,
        pitch: 40
    },
    'mastic': {
        center: [-72.84406658365485,40.75668468617209],
        zoom: 12,
        bearing: 27,
        pitch: 20
    },
    'mastic2': {
        center: [-72.84406658365485,40.75668468617209],
        zoom: 12,
        bearing: 27,
        pitch: 20
    },
    'longbeach': {
        duration: 6000,
        center: [-73.64603516663544,40.608407029838475],
        zoom: 12,
        bearing: 0,
        pitch: 0
    },
    'longbeach2': {
        duration: 6000,
        center: [-73.64603516663544,40.608407029838475],
        zoom: 12,
        bearing: 0,
        pitch: 0
    },
    'montauk': {
        speed: 0.6,
        center: [-72.06154031777514,40.99173955004554],
        zoom: 12,
        bearing: 75,
        pitch: 40
    },
    'montauk2': {
        speed: 0.6,
        center: [-72.06154031777514,40.99173955004554],
        zoom: 10.5,
        bearing: 75,
        pitch: 40
    },
    'northshore': {
        bearing: 0,
        center: [-73.08134610899967,40.931316280272675],
        zoom: 12.3
    },
    'northshore2': {
        bearing: 0,
        center: [-73.08134610899967,40.931316280272675],
        zoom: 10.9
    }
};

// Select all sections
const sections = document.querySelectorAll('section');

// Options for the Intersection Observer
const options = {
  root: null, // use the viewport
  rootMargin: '0px',
  threshold: 0.1 // call the callback when 10% of the section is visible
};

let activeChapterName = 'map';


// Callback for the Intersection Observer
const callback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Get the id of the section
        const id = entry.target.id;
  
        // Set the section as active
        document.getElementById(id).setAttribute('class', 'active');
  
        // If there was a previously active section, remove the 'active' class
        if (activeChapterName && activeChapterName !== id) {
          document.getElementById(activeChapterName).setAttribute('class', '');
        }
  
        // Update the active section
        activeChapterName = id;
  
        // Trigger the map fly
        map.flyTo(chapters[id]);

        // Show the floodplain layer
        // Add event listener for chapter change
        // Check if the new chapter is 'mastic'
        if (id === 'mastic2') {
            // Change the visibility of geojson_layer2 to 'visible'
            map.setLayoutProperty('geojson-layer2', 'visibility', 'visible');
        } else {
            map.setLayoutProperty('geojson-layer2', 'visibility', 'none');
        }
      }
    });
  };
  
  // Create the Intersection Observer
  const observer = new IntersectionObserver(callback, options);
  
  // Start observing all sections
  sections.forEach(section => observer.observe(section));
