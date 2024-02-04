import { db } from './setup.js'; // adjust the path as needed
import { collection, getDocs, addDoc } from 'firebase/firestore';

export async function addZone(zoneData) {

    const data = {
        capacity: zoneData.capacity,
        epicenter: zoneData.epicenter,
        imM: zoneData.imM,
        isFC: zoneData.isFC,
        nickname: zoneData.nickname,
        radius: zoneData.radius,
    };

    const res = await addDoc(collection(db, "zones"), data);
    console.log(res);
};
export async function getCivilians(){
    const querySnapshot = await getDocs(collection(db, 'civilians'));
    const civilians = []
    querySnapshot.forEach((doc) => {
        civilians.push(doc.data());
    })
    console.log(civilians);
    return civilians;
}
//////////////////////////////////////////
export async function getCivilianZoneAllocations(){ //SOMEONE ELSE FIGURE OUT MAX PROXIMITY
    const querySnapshot = await getDocs(collection(db, "placeholder")) //unsure here PETER
    const civilians = getCivilians();
    const zones = getZones();
    //DJKFN;SOEKJF
}
// ^ RELIES ON:
function filterSafeZones(civilian, zones, maxProximity) {
    return zones.filter(zone =>
        haversine(civilian.data.latitude, civilian.data.longitude, zone.data.latitude, zone.data.longitude) <= maxProximity
    );
}
// Function to assign a safe zone to a person based on fitness and type
function assignSafeZone(civilian, filteredZones) { // this won't work off the bat
    if (civilian.data.fitness === 2) {
        const typeFilteredSafeZones = filteredZones.filter(safeZone => safeZone.type === person.type);
        const sortedSafeZones = typeFilteredSafeZones.sort((a, b) =>
            (a.data.currentRefugees / a.data.capacity) - (b.data.currentRefugees / b.data.capacity)
        );
        return sortedSafeZones[0];
    } else if (civilian.data.fitness === 1) {
        const halfMaxProximity = maxProximity / 2;
        const closeSafeZones = filterSafeZones(civlian, zones, halfMaxProximity);
        const typeFilteredSafeZones = closeSafeZones.filter(safeZone => safeZone.data.type === civilian.data.type);
        const sortedSafeZones = typeFilteredSafeZones.sort((a, b) =>
            (a.data.currentRefugees / a.data.capacity) - (b.data.currentRefugees / b.data.capacity)
        );
        return sortedSafeZones[0];
    } else {
        const sortedSafeZones = filteredZones.sort((a, b) =>
            haversine(civilian.data.latitude, civilian.data.longitude, a.data.latitude, a.data.longitude) - 
            haversine(civilian.latitude, civilian.data.longitude, b.data.latitude, b.data.longitude)
        );
        return sortedSafeZones[0];
    }
}




/////////////////////////////////////////////
export async function getPersonAndNearest(civilian){ // FOR NIC
    const civlat = civilian.data.latitude;
    const civlong = civilian.data.longitude;
    const querySnapshot = await getDocs(collection(db, "placeholder")) //unsure here PETER
    const zones = getZones();
    index = 0;
    shortdist = 1000000000; //arbitrarily big, replace with positive infinity? idk how that works in js
    for (let i = 0; i < zones.length; i++) {
        const zone = zones[i];
        const zonelat = zone.data.latitude;
        const zonelong = zone.data.longitude;
        dist = getHaversine(civlat,civlong,zonelat,zonelong);
        if(dist < shortdist)
        {
            index = i;
        }

        
    }
    return [civlat, civlong, zones[index].data.latitude, zones[index].data.longitude];


}
export async function getHaversine(lat1, lon1, lat2, lon2){ //check that this works, it was basically copied from python
    R = 6371;  //Earth radius in kilometers

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    distance = R * c  /Distance in kilometers
    return distance
}




//////////////////////////////////////////////////
export async function getZones() {
    const querySnapshot = await getDocs(collection(db, 'zones'));
    const zones = [];
    querySnapshot.forEach((doc) => {
        zones.push(doc.data());
    });
    console.log(zones);
    return zones;
};

// dhillons terra stuff

export async function getLatestPosition() {
    const querySnapshot = await getDocs(collection(db, 'terra/2022-03-16/activity'));
    const positions = [];
    querySnapshot.forEach((doc) => {
        positions.push(doc.data());
    });
    console.log(positions);
    return positions;
}

