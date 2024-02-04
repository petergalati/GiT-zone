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
// function filterSafeZones(civilian, zones, maxProximity) {
//     return zones.filter(zone =>
//         haversine(civilian.data.latitude, civilian.data.longitude, zone.data.latitude, zone.data.longitude) <= maxProximity
//     );
// }
// Function to assign a safe zone to a person based on fitness and type
// function assignSafeZone(civilian, filteredZones) { // this won't work off the bat
//     if (civilian.data.fitness === 2) {
//         const typeFilteredSafeZones = filteredZones.filter(safeZone => safeZone.type === person.type);
//         const sortedSafeZones = typeFilteredSafeZones.sort((a, b) =>
//             (a.data.currentRefugees / a.data.capacity) - (b.data.currentRefugees / b.data.capacity)
//         );
//         return sortedSafeZones[0];
//     } else if (civilian.data.fitness === 1) {
//         const halfMaxProximity = maxProximity / 2;
//         const closeSafeZones = filterSafeZones(civlian, zones, halfMaxProximity);
//         const typeFilteredSafeZones = closeSafeZones.filter(safeZone => safeZone.data.type === civilian.data.type);
//         const sortedSafeZones = typeFilteredSafeZones.sort((a, b) =>
//             (a.data.currentRefugees / a.data.capacity) - (b.data.currentRefugees / b.data.capacity)
//         );
//         return sortedSafeZones[0];
//     } else {
//         const sortedSafeZones = filteredZones.sort((a, b) =>
//             getHaversine(civilian.data.latitude, civilian.data.longitude, a.data.latitude, a.data.longitude) -
//             getHaversine(civilian.latitude, civilian.data.longitude, b.data.latitude, b.data.longitude)
//         );
//         return sortedSafeZones[0];
//     }
// }




/////////////////////////////////////////////
export async function getPersonAndNearest(civilian){ // FOR NIC
    const civlat = civilian.position.lat;
    const civlong = civilian.position.lng;
    const querySnapshot = await getDocs(collection(db, "placeholder")) //unsure here PETER
    getZones().then(zones=>{
    let index = 0;

    const shortdist = 1000000000; //arbitrarily big, replace with positive infinity? idk how that works in js
    for (let i = 0; i < zones.length; i++) {
        const zone = zones[i];
        const zonelat = zone.epicenter.lat;
        const zonelong = zone.epicenter.lng;
        const dist = getHaversine(civlat,civlong,zonelat,zonelong);
        if(dist < shortdist)
        {
            index = i;
        }


    }
    return {zone:zones[index].epicenter,civpos:civilian.position}});


}
export async function getHaversine(lat1, lon1, lat2, lon2){ //check that this works, it was basically copied from python
    const R = 6371;  //Earth radius in kilometers

    const dlat = (lat2 - lat1) * (Math.PI / 180);
    const dlon = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c  //Distance in kilometers
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

