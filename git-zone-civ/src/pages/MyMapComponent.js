import React from 'react';
import {GoogleMap, Marker, DirectionsRenderer, Circle} from '@react-google-maps/api';
import {getPersonAndNearest, getZones} from "../firebase/query";
import './MyMapComponent.css'
import { useLocation } from 'react-router-dom';

const containerStyle = {
    width: '100%',
    height: '600px'
};

const civilian = [{
    position : {lat: 51.507351, lng: -0.127758}
},
    { position : {lat: 51.407351, lng: -0.208758}},
    { position : {lat: 51.607351, lng: -0.127758}}]




function MyMapComponent() {
    const [directionsResponse, setDirectionsResponse] = React.useState(null);
    const [zoneList, setZoneList] = React.useState([]);
    const [selectedCiv,setSelectedCiv] = React.useState([0]);
    const [selectedZone, setSelectedZone] = React.useState(0);
    const location = useLocation();
    const myLocation = location.state?.myLocation;
    const loadRouteWithZone = async (zoneIndex) => {
        setSelectedZone(zoneIndex);

        if (civilian.length > 0 && zoneList.length > zoneIndex && myLocation) {
            await loadRoute({lat: myLocation.lat,lng :myLocation.lng}, zoneList[zoneIndex].epicenter);
        }
    };
    const loadRoute = async (start, end) => {
        const directionsService = new window.google.maps.DirectionsService();
        const results = await directionsService.route({
            origin: start,
            destination: end,
            travelMode: window.google.maps.TravelMode.WALKING,
        });
        setDirectionsResponse(results);
    };
    const loadRouteWithCiv = async (civIndex) => {
        setSelectedCiv(civIndex);

        if (zoneList.length > 0 && myLocation) {
            await loadRoute(civilian[civIndex], zoneList[0].epicenter);
        }
    };


    React.useEffect(() => {

        getZones().then(zones => {
            setZoneList(zones);
            if (zones.length > 1 && myLocation) {
                loadRoute({lat: myLocation.lat,lng :myLocation.lng}, zones[0].epicenter);
            }
        });


    }, []);
    function setCiv(civ){
        setSelectedCiv(civ)

    }



    return (
        <div className="map-container">
            <GoogleMap
                mapContainerClassName="google-map"
            key={1}
            zoom={15}
            center={{lat: 51.507351, lng: -0.127758}}
        >
            {
                zoneList.map((zone) => (<div>
                <Circle
                center={zone.epicenter}
                radius={zone.radius*50}
                options={{fillColor:'#ff0000',
                    strokeColor:'#00ff00',
                    strokeOpacity:0.5,
                    strokeWeight:10,
                    fillOpacity:0.15}}

                />
                <Marker position={zone.epicenter} title={zone.nickname}/>
                </div>))
            }


            {directionsResponse && (
                <DirectionsRenderer directions={directionsResponse} />
            )}
        </GoogleMap>
            <div className="button-container">
            <button onClick={() => loadRouteWithCiv(0)}>civ 1</button>
            <button onClick={() => loadRouteWithCiv(1)}>civ 2</button>
            <button onClick={() => loadRouteWithCiv(2)}>civ 3</button>

            <button onClick={() => loadRouteWithZone(0)}>Zone 1</button>
            <button onClick={() => loadRouteWithZone(1)}>Zone 2</button>
            <button onClick={() => loadRouteWithZone(2)}>Zone 3</button>
            </div>
</div>
    );
}

export default React.memo(MyMapComponent);
