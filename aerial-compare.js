// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
// mapboxgl.accessToken = '<your access token here>';
mapboxgl.accessToken = 'pk.eyJ1Ijoia3JpdGhpbiIsImEiOiJja2RoNG1yZzQxY2liMnducjgxbDh6bmFvIn0.CBXSX5tUzonVvhCDMxsdaA';

var baseMap = new mapboxgl.Map({
    container: 'basemap',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [0, 0],
    zoom: 0
});

var aerialMap = new mapboxgl.Map({
    container: 'aerial',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [0, 0],
    zoom: 0
});

// A selector or reference to HTML element
var container = document.getElementById('comparison-container');

var map = new mapboxgl.Compare(baseMap, aerialMap, container, {
    // Set this to enable comparing two maps by mouse movement:
    // mousemove: true
});

// tileguide_server_url = 'https://onetwotwo.sg';
tileguide_server_url = 'http://localhost:8080';
var addTileGuideLayers = (map) => {
  map.addSource('tileguide', {
    type: 'vector',
    tiles: [tileguide_server_url + '/tileguide/{z}/{x}/{y}.mvt',]
  });
  map.addLayer({
    'id': 'centers',
    'type': 'symbol',
    'source': 'tileguide',
    'source-layer': 'centers',
    'layout': {
      'text-field': ['concat', ['get', 'z'], ', ', ['get', 'x'], ', ', ['get', 'y']],
    }
  });
  map.addLayer({
    'id': 'borders',
    'type': 'line',
    'source': 'tileguide',
    'source-layer': 'borders',
  });
};

var addAerialRasterLayer = (map) => {
  map.addSource('raster-tiles', {
    type: 'raster',
    tiles: ['https://www.portlandmaps.com/arcgis/rest/services/Public/Aerial_Photos_Summer_2018/MapServer/tile/{z}/{y}/{x}'],
  });
  map.addLayer({
    id: 'raster-tiles',
    type: 'raster',
    source: 'raster-tiles',
  });
}

baseMap.on('load', () => {
  addTileGuideLayers(baseMap);
});
aerialMap.on('load', () => {
  addAerialRasterLayer(aerialMap);
  addTileGuideLayers(aerialMap);
});

