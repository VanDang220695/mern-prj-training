import React, { useState } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import classes from 'classnames';

import { MAP_BOX_TOKEN } from '../../../constants';
import MarkerUrl from '../../../assets/images/location.png';

import './Map.css';

const MapComponent = (props) => {
  const { center, zoom } = props;
  const [viewport, setViewPort] = useState({
    width: '100%',
    height: '100%',
    latitude: center.lat,
    longitude: center.lng,
    zoom,
  });

  return (
    <div className={classes('map', props.className)}>
      <ReactMapGL
        mapStyle='mapbox://sprites/mapbox/outdoors-v11'
        mapboxApiAccessToken={MAP_BOX_TOKEN}
        onViewportChange={(newViewport) => setViewPort(newViewport)}
        {...viewport}
      >
        <Marker longitude={center.lng} latitude={center.lat}>
          <div className='map--marker'>
            <img src={MarkerUrl} alt='Marker' />
          </div>
        </Marker>
      </ReactMapGL>
    </div>
  );
};

export default MapComponent;
