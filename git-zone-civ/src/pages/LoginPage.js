import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCivilian } from "../firebase/query";

export default function LoginPage(){
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        class: '',
        longitude : '',
        latitude : '',
        ability: '',
        id: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);

        try {
            // Await the result of the asynchronous function call
            const data = await addCivilian({
                name: formData.name,
                email: formData.email,
                ability: formData.ability,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                class: formData.class,
            });            // Navigate with the resolved data
            navigate('/MyMapComponent', { state: { data } });
        } catch (error) {
            console.error('Error adding civilian:', error);
            // Handle error if necessary
        }
    };

    const handleRelatedDataFetch = async () => {
        const id = formData.id;
        try {
            const response = await fetch('http://localhost:3001/getLatestPosition'); // Replace with your actual API endpoint
            const data = await response.json();

            const matchingEntry = data.find(entry => entry.id === id);
            if (matchingEntry) {
                setFormData({
                    ...formData,
                    latitude: matchingEntry.data[0],
                    longitude: matchingEntry.data[1]
                });
            } else {
                console.log("No matching ID found");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
            <input type="text" name="class" value={formData.class} onChange={handleChange} placeholder="Class" />
            <input type="number" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Longitude" />
            <input type="number" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Latitude" />
            <input type="text" name="ability" value={formData.ability} onChange={handleChange} placeholder="Ability" />
            <input type="text" name="id" value={formData.id} onChange={handleChange} placeholder="ID" />
            <button type="button" onClick={handleRelatedDataFetch}>Terra</button>
            <button type="submit" onCLick={handleSubmit}>Submit</button>

        </form>
    );
}
//<Link to={'/MyMapComponent'}>hello</Link>