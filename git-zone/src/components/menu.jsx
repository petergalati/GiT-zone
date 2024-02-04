export const Menu = ({ position, onAddZone }) => {
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const zoneData = {
            capacity: formData.get('capacity'),
            epicenter: position, // or format as needed
            imM: formData.get('imM'),
            isFC: formData.get('isFC'),
            nickname: formData.get('nickname'),
            radius: formData.get('radius'),
        };
        onAddZone(zoneData);
    };

    return (
        <div style={{ position: 'absolute', top: position.lat, left: position.lng }}>
            <form onSubmit={handleSubmit}>
                {/* Form fields for capacity, imM, isFC, nickname, radius */}
                <label>Capacity
                <input type="number" name="capacity" /></label>
                <label> number of men</label>
                <input type="number" name="imM" />
                <label> number of women/children</label>
                <input type="number" name="isFC" />
                <label> radius</label>
                <input type="number" name="radius" />
                <label> name</label>
                <input type="string" name="nickname" />
                <button type="submit">Add Zone</button>
            </form>
        </div>
    );
};