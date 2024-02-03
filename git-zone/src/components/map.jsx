import {APIProvider, Map, Marker} from "@vis.gl/react-google-maps";
import { useState} from "react";
const nullMarker =[
    {
    position:{lat: 51.507351, lng: -0.127758 },
    clickable :true,
    title:'penis'
},    {
        position:{lat: 51.607351, lng: -0.127758 },
        clickable :true,
        title:'penis2'
    }]



const BadMap = () => {
    const [markerList, setMarkerList] = useState(nullMarker);
    const [mapKey, setMapKey] = useState(1);

    const handleMapClick = (mapsMouseEvent) => {
        console.log('Clicked LatLng:', mapsMouseEvent.latLng);
        const newMarker = {
            position: mapsMouseEvent.latLng,
            clickable: true,
            title: "New Marker"
        };
        setMapKey((prevKey) => prevKey + 1);
        setMarkerList((prevMarkers) => [...prevMarkers, newMarker]);
    };


    return (<div style={{ height: '75vh', width: '75%' }}>
        <APIProvider apiKey={"AIzaSyDVGnLbmVRcZ9s82BWKTJ01SipwMv9fDQU"}>
            <Map
                key={mapKey}
                width="100%"
                height="400px"
                zoom={15}
                center={{lat: 51.507351, lng: -0.127758}}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                onClick={handleMapClick}

            >

                {markerList.map((marker, index) => (
                    <Marker
                        key={index}
                        position={marker.position}
                        clickable={marker.clickable}
                        title={marker.title}
                    />

                ))}

            </Map>
        </APIProvider>
            {markerList.map((marker,index)=>(
                <div>{index}{marker.title}</div>
                ))

            }
    </div>
    );
}

function map() {

    return (
        BadMap()
    )
}

export default map
