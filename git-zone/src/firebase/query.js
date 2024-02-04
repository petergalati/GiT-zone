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
// Assuming getZones is an async function
async function getCivilianZoneAllocations(civilian) {
    const zones = await getZones(); // await added for async call
    const maxProximity = 100;
    const filteredSafeZones = filterSafeZones(civilian, zones, maxProximity);
    return assignSafeZone(civilian, filteredSafeZones); // Return the assigned safe zone
}

// ^ RELIES ON:
// Assuming haversine function is defined elsewhere correctly
function filterSafeZones(civilian, zones, maxProximity) {
    return zones.filter(zone =>
        haversine(civilian.data.latitude, civilian.data.longitude, zone.data.latitude, zone.data.longitude) <= maxProximity
    );
}

// Function to assign a safe zone to a person based on fitness and type
function assignSafeZone(civilian, filteredZones) {
    const maxProximity = 100; // Define maxProximity if it's needed here
    const zoneClasses = filteredZones.map(zone => {
        let classArray = [];
        if (zone.data.imM === 1) {
            classArray.push("M");
        }
        if (zone.data.isFC === 1) {
            classArray.push("F");
            classArray.push("C");
        }
        return classArray;
    });

    if (civilian.data.fitness === 2) {
        const typeFilteredSafeZones = filteredZones.filter(safeZone => classArray[filteredZones.indexOf(safeZone)].includes(civilian.class));
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
        const sortedSafeZones = filteredZones.sort((a, b) => //idk if this works
            haversine(civilian.data.latitude, civilian.data.longitude, a.data.latitude, a.data.longitude) - 
            haversine(civilian.latitude, civilian.data.longitude, b.data.latitude, b.data.longitude)
        );
        return sortedSafeZones[0];
    }
}


/////////////////////////////////////////////
async function getPersonAndNearest(civilian) {
    const civlat = civilian.data.latitude;
    const civlong = civilian.data.longitude;
    const zones = await getZones();
    let shortestDistance = Number.POSITIVE_INFINITY; // Replaced arbitrary large number with Infinity
    let closestZoneIndex = 0;

    for (let i = 0; i < zones.length; i++) {
        const zone = zones[i];
        const dist = await getHaversine(civlat, civlong, zone.data.latitude, zone.data.longitude);
        if (dist < shortestDistance) {
            shortestDistance = dist;
            closestZoneIndex = i;
        }
    }

    return [civlat, civlong, zones[closestZoneIndex].data.latitude, zones[closestZoneIndex].data.longitude];
}

async function getHaversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in kilometers

    const dlat = toRadians(lat2 - lat1);
    const dlon = toRadians(lon2 - lon1);

    const a = Math.sin(dlat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
}

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}


export async function addCivilian(civilianData) {
    const data = {
        name: civilianData.name,
        email: civilianData.email,
        fitness: civilianData.fitness,
        latitude: civilianData.latitude,
        longitude: civilianData.longitude,
        class: civilianData.class,
    };

    const assignedSafeData = await getCivilianZoneAllocations(data);

    const res = await addDoc(collection(db, "civilians"), data);

    console.log(res);

    return assignedSafeData;

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
        positions.push({ id: doc.id, data: doc.data() });
    });
    // console.log(positions);

    const lastPosSamples = [];
    for (let i = 0; i < positions.length; i++) {
        // posData.push(positions[i].position_data);
        const posSample = positions[i].data.position_data.position_samples;
        // console.log(posSample);
        const lastPosSample = posSample[posSample.length - 1];
        lastPosSamples.push({id: positions[i].id, data: lastPosSample.coords_lat_lng_deg});
    }

    
    return lastPosSamples;
}

