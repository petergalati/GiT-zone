import {APIProvider, Map, Marker} from "@vis.gl/react-google-maps";
import { useState} from "react";
import { Menu } from "./menu";
//import { addZone } from "../../../backend/firebase/query.js";
const nullMarker =[
    {
    position:{lat: 51.507351, lng: -0.127758 },
    clickable :true,
    title:'starter'
},
    ]
const zones = [];  
// console.  



const BadMap = () => {
    const [markerList, setMarkerList] = useState(nullMarker);
    const [mapKey, setMapKey] = useState(1);
    const [menuPosition, setMenuPosition] = useState(null)
    const [showMenu, setShowMenu] = useState(false);

    const handleMapClick = (mapsMouseEvent) => {

        const newMarker = {
            position: mapsMouseEvent.detail.latLng,
            clickable: true,
            title: "New Marker" + markerList.length.toString()
        };
        setMenuPosition(mapsMouseEvent.detail.latLng);
        setShowMenu(true);
        setMapKey((prevKey) => prevKey + 1);
        setMarkerList((prevMarkers) => [...prevMarkers, newMarker]);

    };
    const handleAddZone = (zoneData) => {
        zones.push(zoneData)
        console.log(zones) // Assuming addZone is imported
        setShowMenu(false);};


    return (<div style={{ height: '100vh', width: '100%' }}>
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
            {showMenu && <Menu position={menuPosition} onAddZone={handleAddZone} />}
        </APIProvider>

            
    </div>
    );
}

function map() {

    return (
        BadMap()
    )
}

export default map
