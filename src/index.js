import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import Compare from 'mapbox-gl-compare';
import URLTemplateInput from './URLTemplateInput';

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

var transformZoomOffset = (url, resourceType) => {
  if (resourceType !== 'Tile') return null;

  const zoomOffsetRegex = /(\d+){zoomOffset=(-?\d+)}/;
  const match = url.match(zoomOffsetRegex);
  if (match) {
    const z = Number(match[1]);
    const zoomOffset = Number(match[2]);
    return { url: url.replace(zoomOffsetRegex, String(z + zoomOffset)) };
  }
}

const Application = (props) => {
  const bingURLTemplate = 'https://ecn.t0.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=587&mkt=en-gb&n=z';
  const [urlTemplate, setUrlTemplate] = useState(bingURLTemplate);
  const [zoomOffset, setZoomOffset] = useState(0);

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
      zoom: 0,
      transformRequest: transformZoomOffset,
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
    console.log(zoomOffset);
    if (aerialMap.current.loaded()) {
      if (aerialMap.current.getSource('raster-tiles')) {
        aerialMap.current.removeLayer('raster-tiles');
        aerialMap.current.removeSource('raster-tiles');
      }
      var template = urlTemplate;
      if (zoomOffset && zoomOffset != 0) {
        console.log('hi', zoomOffset);
        template = urlTemplate.replace('{z}', `{z}{zoomOffset=${zoomOffset}}`);
      }
      console.log(template);
      addAerialRasterLayer(aerialMap.current, template);
    }
  }, [urlTemplate, zoomOffset]);

  return (
    <div>
      <URLTemplateInput
          defaultURL={urlTemplate}
          onChangeURL={setUrlTemplate}
          defaultZoomOffset={zoomOffset}
          onChangeZoomOffset={setZoomOffset}
      />
      <div id='comparison-container'>
        <div id='basemap' className='map'></div>
        <div id='aerial' className='map'></div>
      </div>
    </div>
  );
}

ReactDOM.render(<Application />, document.getElementById('app'));
