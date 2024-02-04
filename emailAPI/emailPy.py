## RUN THIS FILE ON REGULAR UPDATE( 5 MINS?)
##Steps to make functional:
#Create JS to python API
#Reference in relevant data frames
#Add a few example email addresses to send to
import json
import os.path
import base64
import math
#import node_modules
#input = '[{"radius":5,"nickname":"Zone 1","epicenter":{"lng":-0.1278,"lat":51.5074},"capacity":100,"isFC":false,"imM":true},{"nickname":"test_zone","isWC":false,"isM":false,"radius":10,"capacity":200,"epicenter":{"latitude":5,"longitude":15}}]'
input = requests.get("https://hostname:3001/getZones()")
try:
    json_data = json.loads(input)
except:
    json_data = input
#json_data = getZones()

civ_input = requests.get("https://hostname:3001/getCivilians()") # fix | ability, class, email, location, name, zone
try:
    civ_json_data = json.loads(civ_input)
except:
    civ_json_data = civ_input

with open('lastjson.json', 'r') as file:
    try:
        lastinput= json.load(file)
    except:
        lastinput = []

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
apikey = "AIzaSyDNR2mypaoRVSmUfIWWPGgZ2ALL8UoP5MU"
# If modifying these scopes, delete the file token.json then regenerate it
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.labels']


def main():
    """Shows basic usage of the Gmail API.
    Lists the user's Gmail labels.
    """
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists("emailAPI/token.json"):
        creds = Credentials.from_authorized_user_file("emailAPI/token.json", SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "credentials.json",
                scopes=['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.labels']
            )
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open("emailAPI/token.json", "w") as token:
            token.write(creds.to_json())

    try:
        # Call the Gmail API
        service = build("gmail", "v1", credentials=creds)
        results = service.users().labels().list(userId="me").execute()
        #labels = results.get("labels", [])

        #if not labels:
            #print("No labels found.")
            #return
        #print("Labels:")
        #for label in labels:
            #print(label["name"])

    except HttpError as error:
        # TODO(developer) - Handle errors from gmail API.
        print(f"An error occurred: {error}")
    service = build('gmail', 'v1', credentials=creds)
    return service

def send_email(service, sender, to, subject, body):
    message = create_message(sender, to, subject, body)
    try:
        message = service.users().messages().send(userId=sender, body=message).execute()
        print(f"Message Id: {message['id']}")
        return message
    except Exception as error:
        print(f"An error occurred: {error}")

def create_message(sender, to, subject, body):
    message = f"From: {sender}\nTo: {to}\nSubject: {subject}\n\n{body}"
    return {'raw': base64.urlsafe_b64encode(message.encode()).decode()}


def send_message(service, user_id, message):
    try:
        my_email = "archierowbotham2021@gmail.com"
        message = service.users().messages().send(userId=user_id, body=message).execute()
        print(f"Message sent! Message Id: {message['id']}")
    except Exception as error:
        print(f"An error occurred: {error}")
def proximity_filter(proximity, maxProximity): #-90<=latitude<=90, -180<=longitude<=180

    if(proximity<=maxProximity):
        return True
    return False
def getDistance(latlongUser, latlongSafeZone, radiusSafeZone):
    proximity = haversine(latlongUser[0], latlongUser[1], latlongSafeZone[0], latlongSafeZone[1]) - radiusSafeZone
    return proximity
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in kilometers

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    distance = R * c  # Distance in kilometers
    return distance
if __name__ == "__main__": # fix | ability, class, email, location, name, zone
    gmail_service = main()
    sender_email = 'archierowbotham2021@gmail.com'
    subject = 'New Safezone Alert'
    for civilian in civ_json_data:
        if(civilian["zone"] is None or True): #simplification - always True for current testing purposes, but intent shown
            to_email = civilian["email"]
            latlongUser = civilian["location"]
            userName = civilian["name"] ##put next stuff here
            if(len(json_data) > len(lastinput)): ##ASSUMING APPENDS, APPENDS ONLY ONCE
                new_zone_dict = json_data[-1] # take last one
                to_email = 'archierowbotham2021@gmail.com' #change to user[i]$Email or equivalent
    
                tempdict = new_zone_dict["epicenter"]
                print(tempdict)
                latlongSafeZone = [tempdict["latitude"], tempdict["longitude"]]
                print(latlongSafeZone)
                radiusSafeZone = new_zone_dict["radius"]
                print(type(latlongUser))
                print(type(latlongSafeZone))
                maxProximity = 80 # arbitrary
        
                prox = getDistance(latlongUser, latlongSafeZone, radiusSafeZone)
                doEmail = proximity_filter(prox,maxProximity)

                if(doEmail):
                    latOutput = latlongSafeZone[0]
                    longOutput = latlongSafeZone[1]
                    eastwest = "east"
                    if(longOutput < 0):
                        eastwest = "west"
                    northsouth = "north"
                    if(latOutput < 0):
                        northsouth = "south"
                    latOutput =  abs(latOutput)
                    longOutput = abs(longOutput)
                    body = f"Dear {userName},\n"\
            
                    f"There is a safe zone approximately {prox} km away, at coordinates {latOutput} degrees {eastwest}, {longOutput} degrees {northsouth}\n"\
                    "From the team at Get In Your Zone"
                    send_email(gmail_service, sender_email, to_email, subject, body)
    with open('lastjson.json', 'w') as f:
        json.dump(json_data, f)

    

    

        

