import os.path
import base64
import math

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
apikey = "AIzaSyDNR2mypaoRVSmUfIWWPGgZ2ALL8UoP5MU"
# If modifying these scopes, delete the file token.json.
SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]


def main():
    """Shows basic usage of the Gmail API.
    Lists the user's Gmail labels.
    """
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
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
        with open("../../emailPy/token.json", "w") as token:
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
    latDifference = latlongUser[0] - latlongSafeZone[0]

    longDifference = latlongUser[1] - latlongSafeZone[1]
    vertical = latDifference * 110.9
    horizontal = longDifference * 87.8
    distance = math.sqrt(vertical^2 + horizontal^2)
    proximity = distance - radiusSafeZone
    return proximity
if __name__ == "__main__":
    gmail_service = main()
    sender_email = 'archierowbotham2021@gmail.com'
    subject = 'New Safezone Alert'
    users = [None] * 10 #update for sql
    for i in range(10):

        to_email = 'archierowbotham2021@gmail.com' #change to user[i]$Email?
        userc = [None] * 4 #update when sql
        latlongUser = userc[0]
        latlongSafeZone = userc[1]
        radiusSafeZone = userc[2]
        maxProximity = userc[3]

        prox = getDistance(latlongUser, latlongSafeZone, radiusSafeZone)
        doEmail = proximity_filter(prox,maxProximity)
        if(doEmail):
            body = 'Dear {userName}, \n There is a safe zone approximately {prox} km away, at coordinates {latlongUser[0]} degrees east, {latlongUser[1]} north \n From the team at Get In Your Zone'
            send_email(gmail_service, sender_email, to_email, subject, body)



