import React from 'react';
import {GoogleMap, Marker, DirectionsRenderer, Circle} from '@react-google-maps/api';
import { getZones, getZonesAndId} from "../firebase/query";
import './MyMapComponent.css'
import { useLocation } from 'react-router-dom';





function MyMapComponent() {
    const [directionsResponse, setDirectionsResponse] = React.useState(null);
    const location = useLocation();
    const myLocation = {lat : location.state?.data.latitude,lng:location.state?.data.longitude };
    const myTarget = location.state?.data.zone;
    console.log(myTarget)
    const loadRoute = async (start, end) => {
        const directionsService = new window.google.maps.DirectionsService();
        const results = await directionsService.route({
            origin: start,
            destination: end,
            travelMode: window.google.maps.TravelMode.WALKING,
        });
        setDirectionsResponse(results);
    };

    let myZone = getZones()[0]
    React.useEffect(() => {


        for (let i=0;i<getZonesAndId();i++){
            if (getZonesAndId()[i].id===myTarget){
                myZone=getZonesAndId()[i].data;
            }
        }
        loadRoute({lat: myLocation.lat, lng: myLocation.lng}, myZone.epicenter).then(r  =>{})

        ;
    }, []);
    console.log("PENIS",myZone)

    return (
        <div className="map-container">
            <GoogleMap
                mapContainerClassName="google-map"
            key={1}
            zoom={15}
            center={{lat: 51.507351, lng: -0.127758}}
        >
            {/*{*/}
            {/*    zoneList.map((zone) => (<div>*/}
            {/*    <Circle*/}
            {/*    center={zone.epicenter}*/}
            {/*    radius={zone.radius*50}*/}
            {/*    options={{fillColor:'#ff0000',*/}
            {/*        strokeColor:'#00ff00',*/}
            {/*        strokeOpacity:0.5,*/}
            {/*        strokeWeight:10,*/}
            {/*        fillOpacity:0.15}}*/}

            {/*    />*/}
            {/*    <Marker position={zone.epicenter} title={zone.nickname}/>*/}
            {/*    </div>))*/}
            {/*}*/}
            <Circle
                center={myZone.epicenter}
                radius={myZone.radius*50}
                options={{fillColor:'#ff0000',
                    strokeColor:'#00ff00',
                    strokeOpacity:0.5,
                    strokeWeight:10,
                    fillOpacity:0.15}}/>
                <Marker position={myZone.epicenter} title={myZone.nickname}/>

            {directionsResponse && (
                <DirectionsRenderer directions={directionsResponse} />
            )}
        </GoogleMap>
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
