import React from 'react';
import {GoogleMap, Marker, DirectionsRenderer, Circle} from '@react-google-maps/api';
import { getZones, getZonesAndId} from "../firebase/query";
import './MyMapComponent.css'
import { useLocation } from 'react-router-dom';

const dummy ={
    capacity: "7",
    epicenter: {lat:51.487624970251915,lng:-0.10817865330247978},
    imM:true,
    isFC:false,
    nickname:"veeraj is gay",
    radius:"3"}

function MyMapComponent() {
    const [directionsResponse, setDirectionsResponse] = React.useState(null);
    const [myZone,setMyZone] = React.useState(dummy)
    const location = useLocation();
    const myLocation = {
        lat: location.state?.data.latitude,
        lng: location.state?.data.longitude}
    const myTarget = location.state?.data.zone;

    const loadRoute = async (start, end) => {
        const directionsService = new window.google.maps.DirectionsService();
        const results = await directionsService.route({
            origin: start,
            destination: end,
            travelMode: window.google.maps.TravelMode.WALKING,
        });
        setDirectionsResponse(results);
    };

    React.useEffect(() => {

        getZonesAndId().then(zones => {

            if (zones.length && myLocation) {
                for (let i = 0;i<zones.length;i++){
                    if (zones[i].id === myTarget){
                        setMyZone(zones[i].data)
                        loadRoute({lat: myLocation.lat,lng :myLocation.lng}, zones[i].data.epicenter);

                    }
                }

            }
        });


    }, []);


    return (
        <div className="map-container">
            { (
                <GoogleMap
                    mapContainerClassName="google-map"
                    key={1}
                    zoom={15}
                    center={{lat :51.509865, lng :-0.118092}} // Ensure myZone is not null before accessing properties
                >
                    {directionsResponse && (
                    <DirectionsRenderer directions={directionsResponse}/>
                )}
                    {console.log(myZone)}
                    <Circle
                        center={myZone.epicenter}
                        radius={parseFloat(myZone.radius )* 50}
                        options={{
                            fillColor: '#ff0000',
                            strokeColor: '#00ff00',
                            strokeOpacity: 0.5,
                            strokeWeight: 10,
                            fillOpacity: 0.15
                        }}
                    />
                    <Marker position={myZone.epicenter} title={myZone.nickname}/>

                </GoogleMap>
            )}
            {/*<div className="button-container">*/}

            {/*/!*<button onClick={() => loadRouteWithCiv(0)}>civ 1</button>*!/*/}
            {/*/!*<button onClick={() => loadRouteWithCiv(1)}>civ 2</button>*!/*/}
            {/*/!*<button onClick={() => loadRouteWithCiv(2)}>civ 3</button>*!/*/}
            {/*    {zoneList.map((zone,index)=>(*/}

            {/*        <button onClick={() => loadRouteWithZone(index)}>Zone {index.toString()}</button>*/}
            {/*    ))}*/}
            {/*/!*<button onClick={() => loadRouteWithZone(0)}>Zone 1</button>*!/*/}
            {/*/!*<button onClick={() => loadRouteWithZone(1)}>Zone 2</button>*!/*/}
            {/*/!*<button onClick={() => loadRouteWithZone(2)}>Zone 3</button>*!/*/}
            {/*</div>*/}
</div>
    );
}

export default React.memo(MyMapComponent);
