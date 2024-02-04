from fastapi import FastAPI, HTTPException
from google.cloud import firestore
from fastapi.responses import RedirectResponse
from typing import List
import asyncio
import requests
import schedule

app = FastAPI()

dev_id = 'getinthezone-prod-QNQC2ozrna'

api_key = 'TGX7QhWBsMu12QMz_rwPPdG--kn8nuSE'

base_url = 'http://127.0.0.1:8000'

# Initialize Firestore client
db = firestore.Client.from_service_account_json('get-in-the-zone-ich24-firebase-adminsdk-78vgj-3090d99d6e.json')

# Function to fetch zones from Firestore
def get_zones_from_firestore() -> List[dict]:
    zones_collection = db.collection('zones')
    zones = [zone.to_dict() for zone in zones_collection.stream()]
    return zones

@app.get('/login')
async def auth():
    res = requests.post("https://api.tryterra.co/v2/auth/generateWidgetSession", headers={
  "dev-id": dev_id, "x-api-key": api_key
}, json={ "reference_id": "test-username", "lang": "en", "auth_success_redirect_url": f'{base_url}/on_auth_success', "auth_failure_redirect_url": 'https://failure.url' })
    data = res.json()
    url = data['url']
    return RedirectResponse(url)

@app.get('/on_auth_success')
async def auth_success(user_id: str, reference_id: str):

    res = requests.get('https://api.tryterra.co/v2/body',
        params={
            'user_id': user_id, 
            'start_date': '1706918400', 
            'end_date': '1707017316', 
            'with_samples': True, 
            'to_webhook': True,            # set this to true if you prefer we send the data to your database or to the webhook you can setup below
        },
        headers={
            'dev-id': dev_id, 
            'x-api-key': api_key 
        }
    )

    data = res.json()

    return RedirectResponse('https://www.google.com')

    


@app.get("/zones", response_model=List[dict])
async def get_zones():
    zones = get_zones_from_firestore()
    return zones