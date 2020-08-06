import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import Compare from 'mapbox-gl-compare';

// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
// mapboxgl.accessToken = '<your access token here>';
mapboxgl.accessToken = 'pk.eyJ1Ijoia3JpdGhpbiIsImEiOiJjamR6anRzOXUwZmdoMzJsanFyYmx6dDRoIn0.eHcws4Zzktx3d0iPN4Oumg';

// const tileguide_server_url = 'https://onetwotwo.sg';
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
  }, 'centers');
};

var addAerialRasterLayer = (map, urlTemplate) => {
  map.addSource('raster-tiles', {
    type: 'raster',
    tiles: [urlTemplate],
  });
  map.addLayer({
    id: 'raster-tiles',
    type: 'raster',
    source: 'raster-tiles',
  }, 'borders');
};

const URLTemplateInput = (props) => {
  const textArea = React.useRef();
  return (
    <div id='url-template-container' className='sidebarStyle'>
      <label>URL Template:
        <textarea ref={textArea} id='url-template' rows="1" defaultValue={props.value} onChange={() => props.onChange(textArea.current.value)} />
      </label>
    </div>
  )
};

const Application = (props) => {
  const bingURLTemplate = 'https://ecn.t0.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=587&mkt=en-gb&n=z';
  const [urlTemplate, setUrlTemplate] = useState(bingURLTemplate);

  const baseMap = React.useRef(null);
  const aerialMap = React.useRef(null);
  React.useEffect(() => {
    baseMap.current = new mapboxgl.Map({
      container: 'basemap',
      style: 'mapbox://styles/mapbox/light-v10',
      center: [0, 0],
      zoom: 0
    });
    baseMap.current.on('load', () => {
      addTileGuideLayers(baseMap.current);
    });
    aerialMap.current = new mapboxgl.Map({
      container: 'aerial',
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [0, 0],
      zoom: 0
    });
    aerialMap.current.on('load', () => {
      addTileGuideLayers(aerialMap.current);
      addAerialRasterLayer(aerialMap.current, bingURLTemplate);
    });

    // A selector or reference to HTML element
    var container = document.getElementById('comparison-container');

    new Compare(baseMap.current, aerialMap.current, container, {
      orientation: 'vertical',
      mousemove: false,
    });
  }, []);

  React.useEffect(() => {
    console.log(urlTemplate);
    if (aerialMap.current.loaded()) {
      if (aerialMap.current.getSource('raster-tiles')) {
        aerialMap.current.removeLayer('raster-tiles');
        aerialMap.current.removeSource('raster-tiles');
      }
      addAerialRasterLayer(aerialMap.current, urlTemplate);
    }
  }, [urlTemplate]);

  return (
    <div>
      <URLTemplateInput defaultValue={urlTemplate} onChange={setUrlTemplate} />
      <div id='comparison-container'>
        <div id='basemap' className='map'></div>
        <div id='aerial' className='map'></div>
      </div>
    </div>
  );
}

ReactDOM.render(<Application />, document.getElementById('app'));
