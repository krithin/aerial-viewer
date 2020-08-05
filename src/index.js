import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import Compare from 'mapbox-gl-compare';

// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
// mapboxgl.accessToken = '<your access token here>';
mapboxgl.accessToken = 'pk.eyJ1Ijoia3JpdGhpbiIsImEiOiJjamR6anRzOXUwZmdoMzJsanFyYmx6dDRoIn0.eHcws4Zzktx3d0iPN4Oumg';

// tileguide_server_url = 'https://onetwotwo.sg';
const tileguide_server_url = 'http://localhost:8080';
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
};

const Application = (props) => {
  React.useEffect(() => {
    const baseMap = new mapboxgl.Map({
      container: 'basemap',
      style: 'mapbox://styles/mapbox/light-v10',
      center: [0, 0],
      zoom: 0
    });
    const aerialMap = new mapboxgl.Map({
      container: 'aerial',
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [0, 0],
      zoom: 0
    });
    baseMap.on('load', () => {
      addTileGuideLayers(baseMap);
    });
    aerialMap.on('load', () => {
      addAerialRasterLayer(aerialMap);
      addTileGuideLayers(aerialMap);
    });

    // A selector or reference to HTML element
    var container = document.getElementById('comparison-container');

    var compare = new Compare(baseMap, aerialMap, container, {
      orientation: 'vertical',
      mousemove: false,
    })
  }, []);

  return (
    <div>
      <div id='url-template-container' className='sidebarStyle'>
        <label>URL Template:<input id='url-template' /></label>
      </div>
      <div id='comparison-container'>
        <div id='basemap' className='map'></div>
        <div id='aerial' className='map'></div>
      </div>
    </div>
  );
}

ReactDOM.render(<Application />, document.getElementById('app'));
