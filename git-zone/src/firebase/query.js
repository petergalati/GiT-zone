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

