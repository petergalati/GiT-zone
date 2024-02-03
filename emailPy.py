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
if __name__ == "__main__":
    gmail_service = main()

    # Replace 'email@example.com' with the authorized email
    sender_email = 'archierowbotham2021@gmail.com'
    # Replace 'recipient@example.com' with the recipient's email
    to_email = 'archierowbotham2021@gmail.com'
    subject = 'Get In The Zone Alert'
    body = 'This is a test email sent using Gmail API.'

    send_email(gmail_service, sender_email, to_email, subject, body)
def proximity_filter(latlongUser, latlongSafeZone, radiusSafeZone, maxProximity): #-90<=latitude<=90, -180<=longitude<=180
    latDifference = latlongUser[0] - latlongSafeZone[0]
    longDifference = latlongUser[1] - latlongSafeZone[1]
    distance = math.sqrt(latDifference^2 + longDifference^2)
    proximity = distance - radiusSafeZone
    if(proximity<maxProximity):
        return True
    return False
