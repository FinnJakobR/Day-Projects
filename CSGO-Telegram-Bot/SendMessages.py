
from asyncio import constants
import json
from operator import index
from posixpath import splitdrive
import re
from sqlite3 import Timestamp
from sys import is_finalizing
from time import sleep, time
import requests
import os 
import threading
import datetime
from Levenshtein import distance as Levinstein_distance

COMMANDS = ["follow", "unfollow", "commands"]

FOLLOW_TOURNAMENTS = []


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
    
    messages = json.loads(response.text)
    messages["result"] = DeleteOldMessages(messages)

    
    return messages

def DeleteOldMessages(messages):
    currentTimeStamp = int(time())
    TimestampBeforeSeconds = int((datetime.datetime.now() - datetime.timedelta(seconds=5)).timestamp())
    message = messages["result"]
   

    for message in list(messages["result"]):

        if("date" in message["channel_post"]):
            if(int(message["channel_post"]["date"]) < TimestampBeforeSeconds):
              messages["result"].remove(message)  
              
        
    
    return messages["result"]




        


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
    
    os.remove(path)
    return

    
def MESSAGE_LISTENER(bot_id, chat_id):
    Message_obj = RECIEVE_MESSAGE(bot_id)
    for res in Message_obj["result"]:
        isMessageFromABot = isMessageFromBot(res)
        if((isMessageFromABot is not True) and (isValidCommand(res))):
            
            if isFollowCommand(res):
                name = GetTournamentName(res["channel_post"]["text"])
                if(name.lower() in GetTournaments()):
                    #Valid Tournament
                    if name.lower() not in FOLLOW_TOURNAMENTS:
                        FOLLOW_TOURNAMENTS.append(name.lower())
                        SEND_MESSAGE(bot_id, chat_id, "sucessfull followed Tournament: *{}*".format(name))
                        FollowEventInFile(name.lower())
                    else:
                       SEND_MESSAGE(bot_id, chat_id, "Tournament: *{}* is Allready Followed".format(name)) 
                    
                    print("IS Vaild Tournament")

                    sleep(6.0)

                    
                
                else: 
                    SEND_MESSAGE(bot_id, chat_id, "Could not find a Tournament with this Name do you mean : {}".format(TournamentSimularity(name)))

                    sleep(6.0)
                    
                    #DELETE_MESSAGE(bot_id, chat_id, message_id)
            if isCommandListCommand(res):
                print("IS COMMNDS COMMAND")
                Body = "*AvailableCommands:*\nfollow: _follow a Tournament_\nunfollow _unfollow a Tournament_"
                SEND_MESSAGE(bot_id, chat_id, Body)
                sleep(6.0)

            if isUnfollowCommand(res):
                name = GetTournamentName(res["channel_post"]["text"])
                if name.lower() in FOLLOW_TOURNAMENTS:
                    FOLLOW_TOURNAMENTS.remove(name.lower())
                    Body = "sucessfull Unfollowed Tournament: *{}* ".format(name)
                    SEND_MESSAGE(bot_id, chat_id, Body)
                    UnfollowEventInFile(name.lower())
                    sleep(6.0)
                #unfollow


        
        elif isMessageFromABot is not True and isValidCommand(res) is not True:

            DELETE_MESSAGE(bot_id=bot_id, chat_id=chat_id, message_id=res["channel_post"]["message_id"])

    threading.Timer(5.0, MESSAGE_LISTENER(bot_id=bot_id, chat_id=chat_id)).start()

def isMessageFromBot(message):
    if "pinned_message" in message["channel_post"]:
        return True
    
    return False

def isUnfollowCommand(message):
    TextData = message["channel_post"]["text"].lower()
    SplittedtextData = TextData.split()
    print(SplittedtextData)

    if(SplittedtextData[0] == "unfollow"):
        return True
    
    return False

def isValidCommand(message):
    if("pinned_message" in message["channel_post"]):
       return True

    TextData = message["channel_post"]["text"].lower().split()

    if(TextData[0] not in COMMANDS):
        return False
 
    return True

def isCommandListCommand(message):
    TextData = message["channel_post"]["text"].lower()
    SplittedtextData = TextData.split()
    print(SplittedtextData)

    if(SplittedtextData[0] == "commands"):
        return True
    
    return False
 
def isFollowCommand(message):
      TextData = message["channel_post"]["text"].lower()
      SplittedtextData = TextData.split()
      print(SplittedtextData)

      if(SplittedtextData[0] == "follow"):
        return True
    
      return False


def GetTournamentName(command):
    splittedCommand = command.split()
    del splittedCommand[0]

    name = " ".join(splittedCommand)

    return name


def GetTournaments():
    f = open("./Tournaments.json")
    Tournaments = json.load(f)
    return Tournaments


def TournamentSimularity(TournamentName):
    Tournaments = GetTournaments()
    Distances = []
    for Tournament in Tournaments:
        Distance = Levinstein_distance(TournamentName,Tournament)
        Distances.append(Distance)
    
    MinValue = min(Distances)
    index = Distances.index(MinValue)

    return Tournaments[index]

def UnfollowEventInFile(event):
    f = open("./FollowedTournaments.json", "r+")
    jsonData = json.load(f)
    list(jsonData).remove(event)
    f.write(json.dumps(jsonData))
    f.close()
    return

def FollowEventInFile(event):
     f = open("./FollowedTournaments.json", "r+")
     jsonData = json.load(f)
     jsonData.append(event)
     print(jsonData)
     f.seek(0)
     f.write(json.dumps(jsonData))
     f.truncate()
     f.close()
     return


def DELETE_MESSAGE(bot_id,chat_id, message_id):
    

    response = requests.get("https://api.telegram.org/bot{}/deleteMessage?chat_id={}&message_id={}".format(bot_id,chat_id,message_id))

    if(response.status_code == 400):
        return
    return
    



