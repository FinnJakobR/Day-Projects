
from asyncio import constants
import json
import requests
import os 

def SEND_MESSAGE(Bot_id,chat_id, body):
    if(type(chat_id) is not int):
        print("CHAT ID IS NOT A VALID TYPE")
        return
    
    response = requests.get("https://api.telegram.org/bot{}/sendMessage?chat_id={}&text={}&parse_mode={}".format(Bot_id, chat_id, body, "markdown"))
    
    if(response.status_code == 400):
        print("ERROR WHILE SENDING MESSAGE")
        print(response.text)
        return
    
    return response.text

    
def RECIEVE_MESSAGE(Bot_id):
    response = requests.get("https://api.telegram.org/bot{}/getupdates".format(Bot_id))
    
    if(response.status_code == 400):
        print("ERROR WHILE SENDING MESSAGE")
        print(response.text)
        return
    
    return response.text

def SEND_CALENDAR(path, bot_id, chat_id):

    url = "https://api.telegram.org/bot" + bot_id +'/sendDocument?'

    data = {
        "chat_id": chat_id,
        "parse_mode": "markdown",
        "filename": "Event"
    }
    r = requests.post(url, data=data, files={'document': open(path, 'rb')}, stream=True)

    if(r.status_code == 400):
        print(r.text)
        return
    
    os.remove("./ICS/Data.ics")
    return

    
