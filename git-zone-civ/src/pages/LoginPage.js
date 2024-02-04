import { useNavigate} from "react-router-dom";
import {useState} from "react";
import {addCivilian} from "../firebase/query";

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
        await addCivilian({
            name: formData.name,
            email: formData.email,
            class: formData.class,
            longitude: parseFloat(formData.longitude),
            latitude: parseFloat(formData.latitude),
            ability: formData.ability,
            id: formData.id
        })
        navigate('/MyMapComponent', { state: { myLocation: { lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude) } } });
        // Here you would typically send formData to your server or API
    };

    const handleRelatedDataFetch = async () => {
        const id = formData.id;
        // Fetch location and ability based on ID from API
        // For example: const response = await fetch(`https://yourapi.com/data/${id}`);
        // Update the formData with the response if needed
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