import requests

# Add a zone
zone_data = {
    "capacity": 100,
    "epicenter": {"lat": 51.5074, "lng": -0.1278},
    "imM": True,
    "isFC": False,
    "nickname": "Zone 1",
    "radius": 5
}

response = requests.post('http://localhost:3000/addZone', json=zone_data)
print(response.text)

# Get zones
response = requests.get('http://localhost:3000/getZones')
zones = response.json()
print(zones)
