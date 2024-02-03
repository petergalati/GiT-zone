import {APIProvider, Map, Marker} from "@vis.gl/react-google-maps";
import { useState} from "react";
const nullMarker =[
    {
    position:{lat: 51.507351, lng: -0.127758 },
    clickable :true,
    title:'starter'
},
    ]



const BadMap = () => {
    const [markerList, setMarkerList] = useState(nullMarker);
    const [mapKey, setMapKey] = useState(1);

    const handleMapClick = (mapsMouseEvent) => {

        const newMarker = {
            position: mapsMouseEvent.detail.latLng,
            clickable: true,
            title: "New Marker" + markerList.length.toString()
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
