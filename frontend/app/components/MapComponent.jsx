import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapComponent = () => {
  const containerStyle = {
    width: '100%',
    height: '400px', // Ajusta la altura según tus necesidades
  };

  const center = {
    lat: -36.818428, // Coordenada de latitud para Las Heras, Concepción, Chile
    lng: -73.043196, // Coordenada de longitud para Las Heras, Concepción, Chile
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyBbsNmU1YV6dyq8mVZxw9ARsqUQaJqxFzE">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={19} // Ajusta el zoom según lo necesario
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
