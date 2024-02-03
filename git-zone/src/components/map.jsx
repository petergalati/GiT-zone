import {APIProvider, Map, Marker} from "@vis.gl/react-google-maps";
import { useState} from "react";
import { Menu } from "./menu";
import {Circle} from "./Circle";
import Directions from "./Directions";



const zones = [];  
// console.
// const dummy=[{
//     position : {lat: 51.507351, lng: -0.127758}
//
// },{
//     position: {lat: 52.007351, lng: -0.127758}
// }]



const BadMap = () => {
    const [markerList, setMarkerList] = useState([]);
    const [circleList,setCircleList] = useState([])
    const [menuPosition, setMenuPosition] = useState(null)
    const [showMenu, setShowMenu] = useState(false);

    const handleMapClick = (mapsMouseEvent) => {


        setMenuPosition(mapsMouseEvent.detail.latLng);
        setShowMenu(true);



    };
    const handleAddZone = (zoneData) => {
        zones.push(zoneData)
        console.log(zones)
        const newMarker = {
            position: zoneData.epicenter,
            clickable: true,
            title: zoneData.nickname
        };
        const newCircle ={
            position: zoneData.epicenter,
            radius: parseInt(zoneData.radius)*50
        }
        setCircleList((prevCircles)=>[...prevCircles,newCircle]);
        setMarkerList((prevMarkers) => [...prevMarkers, newMarker]);


        setShowMenu(false);};


    return (<div style={{ height: '100vh', width: '100%' }}>
        <APIProvider apiKey={"AIzaSyDVGnLbmVRcZ9s82BWKTJ01SipwMv9fDQU"}>
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
                {markerList.map((marker, index) => (
                    <Marker
                        key={index}
                        position={marker.position}
                        clickable={marker.clickable}
                        title={marker.title}
                    />

                ))}
                {circleList.map((circle, index) => (<div>
                    <Circle
                        key={index}
                        center={circle.position}
                        radius={circle.radius}
                        strokeColor= {"#00FF00"}
                        strokeOpacity={0.8}
                        strokeWeight={10}
                        fillColor={"#FF0000"}
                        fillOpacity={0.35}
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
