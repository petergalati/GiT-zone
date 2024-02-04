import './styles.css'
export const Menu = ({ position, onAddZone }) => {
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const zoneData = {
            capacity: formData.get('capacity'),
            epicenter: position, // or format as needed
            imM:  formData.get('imM') === 'on',
            isFC:  formData.get('isFC') === 'on',
            nickname: formData.get('nickname'),
            radius: formData.get('radius'),
        };
        onAddZone(zoneData);
    };

    return (
        <div  className="menu" style={{ position: 'absolute', top: position.lat, left: position.lng }}>
            <form onSubmit={handleSubmit}>
                {/* Form fields for capacity, imM, isFC, nickname, radius */}
                <label className="form-label">Capacity
                <input className="form-input" type="number" name="capacity" /></label>
                <label className="form-label"> for men</label>
                <input className="form-input" type="checkbox" name="imM" />
                <label className="form-label"> for women and children</label>
                <input className="form-input" type="checkbox" name="isFC" />
                <label className="form-label"> radius</label>
                <input className="form-input" type="number" name="radius" />
                <label className="form-label"> name</label>
                <input className="form-input" type="string" name="nickname" />
                <button type="submit">Add Zone</button>
            </form>
        </div>
    );
};