from fastapi import FastAPI, HTTPException, Request
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

    res = requests.get('https://api.tryterra.co/v2/daily',
        params={
            'user_id': user_id, 
            'start_date': '2024-01-25', 
            'end_date': '2024-02-03', 
            'with_samples': True, 
            'to_webhook': True,            # set this to true if you prefer we send the data to your database or to the webhook you can setup below
        },
        headers={
            'dev-id': dev_id, 
            'x-api-key': api_key 
        }
    )

    data = res.json()

    #print(data)
    

    return { 'user_id': user_id, 'ref': reference_id, 'data': data  }

#@app.post('/consume')
#async def consume(request: Request):
#    data = await request.json()

    # you can now do whatever you want with the data
    # checkout https://docs.tryterra.co/reference/v2
    # to see what the data would look like.

#    return { 'success': 'ok' }

@app.get('/get_firestore_data')
def firebase_query():
    # Replace 'your_collection' with the name of your Firestore collection.
    terra_collection_ref = db.collection('terra')
    
    date_document_ref = terra_collection_ref.document('2022-03-16')

    daily_collection_ref = date_document_ref.collection('daily')
    # Perform your Firestore query here.
    # For example, get all documents in the collection.
    docs = daily_collection_ref.stream()

    for doc in docs:
        try:
            data_dict = doc.to_dict()

            # Check if 'position_data' exists in the document
            if 'position_data' in data_dict:
                position_data = data_dict['position_data']
                
                # Check if 'position_samples' exists in 'position_data'
                if 'position_samples' in position_data:
                    position_samples = position_data['position_samples']
                    
                    # Sort position_samples by timestamp in descending order
                    sorted_samples = sorted(position_samples, key=lambda x: x['timestamp'], reverse=True)
                    
                    # Get the first (latest) position sample
                    latest_position_sample = sorted_samples[0]
                    
                    # Extract 'coords_lat_lng_deg' from the latest position sample
                    coords_lat_lng_deg = latest_position_sample['coords_lat_lng_deg']
                    
                    print(f'Document ID: {doc.id}, Latest Coords Lat/Lng: {coords_lat_lng_deg}')
                else:
                    raise ValueError(f'Document ID: {doc.id}, Error: "position_samples not found in position_data"')
            else:
                raise ValueError(f'Document ID: {doc.id}, Error: "position_data not found in document"')
        except Exception as e:
            print(f'Error processing document {doc.id}: {str(e)}')

schedule.every(5).seconds.do(firebase_query)

async def run_queries():
    while True:
        await fire()
        await asyncio.sleep(5)


@app.get("/zones", response_model=List[dict])
async def get_zones():
    zones = get_zones_from_firestore()
    return zones




