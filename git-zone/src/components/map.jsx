import {APIProvider, Map, Marker} from "@vis.gl/react-google-maps";
import { useState,useEffect} from "react";
import { Menu } from "./menu";
import {Circle} from "./Circle";
import {addZone, getZones} from "../firebase/query.js";
import './styles.css'

const BadMap = () => {
    const [menuPosition, setMenuPosition] = useState(null)
    const [showMenu, setShowMenu] = useState(false);
    const [zoneList, setZoneList] = useState([]);

    useEffect(() => {
        getZones().then(zones => {
            setZoneList(zones);
        });
    }, []);

    const handleMapClick = (mapsMouseEvent) => {


        setMenuPosition(mapsMouseEvent.detail.latLng);
        setShowMenu(true);



    };
    const handleAddZone = (zoneData) => {
        addZone(zoneData)
        zoneList.push(zoneData)


        setShowMenu(false);};


    return (<div className='mapContainer' style={{ height: '100vh', width: '100%' }}>
        <APIProvider apiKey={"AIzaSyDA-4J7rX9bVlBFRLwoEzDcETAzaS3XPk8"}>
            <Map
                key={1}
                width="100%"
                height="400px"
                zoom={15}
                center={{lat: 51.507351, lng: -0.127758}}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                onClick={handleMapClick}

            >
                {/*{markerList.map((marker, index) => (*/}


                {/*))}*/}
                {zoneList.map((zone, index) => (<div>
                    <Circle
                        key={index}
                        center={zone.epicenter}
                        radius={zone.radius*50}
                        strokeColor= {"#00FF00"}
                        strokeOpacity={0.5}
                        strokeWeight={10}
                        fillColor={"#FF0000"}
                        fillOpacity={0.15}

                    />
                        <Marker
                            key={index}
                            position={zone.epicenter}
                            clickable={true}
                            title={zone.nickname}
                        />
                    </div>
                ))}
                {/*{Directions}*/}
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
