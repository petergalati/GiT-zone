import React from 'react'
import {GoogleMap, Marker, useJsApiLoader} from '@react-google-maps/api';

const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyDVGnLbmVRcZ9s82BWKTJ01SipwMv9fDQU"
  })


  const dummyMarkers =[{
      position:{lat: 51.507351, lng: -0.127758}
  },{position:{lat: 52.507351, lng: -0.127758}}]
  return  (
      <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMap
          mapContainerStyle={{
              width: '1000px',
              height: '700px'
          }}
          center={{lat: 51.507351, lng: -0.127758}}
          zoom={15}
      >
          {dummyMarkers.map((marker,index)=>(
              <Marker  position={marker.position}/>
          ))}

        <></>
      </GoogleMap>
        </div>
  )
}

export default React.memo(MyComponent)