import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCivilian } from "../firebase/query";

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        class: '',
        longitude: '',
        latitude: '',
        ability: '',
        id: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Your existing submit logic
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
            {/* Your existing form inputs */}
            <button type="button" onClick={handleRelatedDataFetch}>Terra</button>
            <button type="submit">Submit</button>
        </form>
    );
}
