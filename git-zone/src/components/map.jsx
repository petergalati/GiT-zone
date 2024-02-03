import {APIProvider, Map} from "@vis.gl/react-google-maps";

const badMap = () => {
    return (
        <APIProvider apiKey={"AIzaSyDVGnLbmVRcZ9s82BWKTJ01SipwMv9fDQU"}>
            <Map
                width="100%"
                height="400px"
                zoom={3}
                center={{ lat: 22.54992, lng: 0 }}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
            />
        </APIProvider>
    );

}
function map(){
    return(
        badMap()
    )
}
export default map