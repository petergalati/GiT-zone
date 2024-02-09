import { db } from './setup.js'; // adjust the path as needed
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { getDistance } from 'geolib';

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
    // console.log(res);
};

export async function getCivilians(){
    const querySnapshot = await getDocs(collection(db, 'civilians'));
    const civilians = []
    querySnapshot.forEach((doc) => {
        civilians.push(doc.data());
    })
    // console.log(civilians);
    return civilians;
}

export async function addCivilian(civilianData) {
    try {
        const zone = await getZoneAllocation(civilianData);
        console.log(zone);

        // if (!zone) {
        //     // Handle undefined zone here
        //     // console.error('Zone is undefined');
        //     // Optionally, throw an error or assign a default value
        //     // throw new Error('Zone allocation failed');
        //     // zone = defaultZoneValue;
        // }

        let data = {
            name: civilianData.name,
            email: civilianData.email,
            ability: civilianData.ability,
            latitude: civilianData.latitude,
            longitude: civilianData.longitude,
            class: civilianData.class,
            zone: zone // Use null or a default value if zone is undefined
        };

        console.log(data)
        const res = await addDoc(collection(db, "civilians"), data);
        return data;
    } catch (error) {
        // console.error('Error in addCivilian:', error);
        throw error;
    }
}


// // console.log(res);

// return assignedSafeData;



// / civillian stuff

async function getZoneAllocation(civilianData) {

    const data = {
        ability: civilianData.ability, // 0, 1, 2
        latitude: civilianData.latitude,
        longitude: civilianData.longitude,// { latitude: x, longitude: y }
        class: civilianData.class, // M, F, C
    };

    const zones = await getZonesAndId();
    console.log(zones)

    const distances = zones.map(zone => {
        const distance = getDistance(
            { latitude: zone.data.epicenter.lat, longitude: zone.data.epicenter.lng },
            { latitude: data.latitude, longitude: data.longitude }
        );
        return { zoneId: zone.id, zone : zone, distance : distance };
    });

    distances.sort((a, b) => a.distance - b.distance);
    console.log(data.ability)
    console.log(distances[0].zoneId)
    // // console.log(distances)
    if (data.ability === '0') {
        // return the closest zone with the lowest capacity
        console.log(distances[0].zoneId)
        return distances[0].zoneId
    } else if (data.ability === '1') {
        // return the closest zone with the same category as the civilian
        return distances[0].zoneId
    } else if (data.ability === '2') {
        // return the second closest zone and the same class as the civilian
        return distances[0].zoneId
    }
    // // console.log(distances);
}

//////////////////////////////////////////////////
export async function getZones() {
    const querySnapshot = await getDocs(collection(db, 'zones'));
    const zones = [];
    querySnapshot.forEach((doc) => {
        zones.push(doc.data());
    });
    return zones;
};

export async function getZonesAndId() {
    const querySnapshot = await getDocs(collection(db, 'zones'));
    const zones = [];
    querySnapshot.forEach((doc) => {
        zones.push({id: doc.id, data: doc.data()});
    });
    // // console.log(zones);
    return zones;

}

// dhillons terra stuff

export async function getLatestPosition() {
    const querySnapshot = await getDocs(collection(db, 'terra/2022-03-16/activity'));
    const positions = [];
    querySnapshot.forEach((doc) => {
        positions.push({ id: doc.id, data: doc.data() });
    });
    // // console.log(positions);

    const lastPosSamples = [];
    for (let i = 0; i < positions.length; i++) {
        // posData.push(positions[i].position_data);
        const posSample = positions[i].data.position_data.position_samples;
        // // console.log(posSample);
        const lastPosSample = posSample[posSample.length - 1];
        lastPosSamples.push({id: positions[i].id, data: lastPosSample.coords_lat_lng_deg});
    }


    return lastPosSamples;
}


