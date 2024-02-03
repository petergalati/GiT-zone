import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, doc, setDoc } from "firebase/firestore";

export async function addZone(zoneData) {
    const db = getFirestore();

    const zoneData = {
        capacity: zoneData.capacity,
        epicenter: zoneData,
        imM: zoneData.imM,
        isFC: zoneData.isFC,
        nickname: zoneData.nickname,
        radius: zoneData.radius,
    };

    const res = await db.collection("zones").add({zoneData});
    console.log(res);
};

export async function getZones() {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, "zones"));
    const zones = [];
    querySnapshot.forEach((doc) => {
        zones.push(doc.data());
    });
    console.log(zones);
    return zones;
};

