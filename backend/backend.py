from fastapi import FastAPI, HTTPException
from google.cloud import firestore
#from fastapi.request import 
from typing import List
import requests

app = FastAPI()

dev_id = 'getinthezone-prod-QNQC2ozrna'

api_key = ''

# Initialize Firestore client
db = firestore.Client.from_service_account_json('get-in-the-zone-ich24-firebase-adminsdk-78vgj-3090d99d6e.json')

# Function to fetch zones from Firestore
def get_zones_from_firestore() -> List[dict]:
    zones_collection = db.collection('zones')
    zones = [zone.to_dict() for zone in zones_collection.stream()]
    return zones

@app.get('/login')
async def auth():
    res = requests.post('https://api.tryterra.co/auth/generateWidgetSession', headers={'dev-id': dev_id, 'x-api-key': api_key})
    data = res.json()
    url = data['url']

@app.get("/zones", response_model=List[dict])
async def get_zones():
    zones = get_zones_from_firestore()
    return zones



