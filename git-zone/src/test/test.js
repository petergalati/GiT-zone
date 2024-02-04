import { getZones } from "../firebase/query.js";


const testButton = document.getElementById('test-button');
testButton.addEventListener('click', async function() {
    console.log('Button clicked');
    const zones = await getZones();
    console.log(zones);
});