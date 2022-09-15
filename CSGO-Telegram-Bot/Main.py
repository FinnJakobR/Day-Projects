
from ast import While
from email.message import Message
from time import sleep, time
from tkinter.messagebox import RETRY
from SendMessages import SEND_MESSAGE
from SendMessages import RECIEVE_MESSAGE
from SendMessages import SEND_CALENDAR
from counterstrike import counterstrike
import re
import datetime
from ics import Calendar, Event
import threading

BOT_ID = "BOT_ID"
CHAT_ID = 1239294392 

Commands = [];

DAYS = 0
UPCOMMING_TOURNAMENTS = []

currentMonth = datetime.datetime.now().month
currentDay = datetime.datetime.now().day

TODAY =  datetime.date.today().strftime( "%m/%d/%y")


def GenerateDatePlusDays():

    date_1 = datetime.datetime.strptime(TODAY, "%m/%d/%y")

    end_date = date_1 + datetime.timedelta(days=DAYS)

    return end_date.strftime("20%y-%m-%d")


def GetEventsFromLiquidPedia():
    threading.Timer(86000.0, GetEventsFromLiquidPedia).start()
    currentDay = datetime.datetime.now().day
    currentMonth = datetime.datetime.now().month
    DateTime = GenerateDatePlusDays()
    csgo_obj = counterstrike("EVENT_REMINDER")
    tournaments = csgo_obj.get_tournaments()
    length = len(tournaments)
    rightTournaments = []

    for i in range(0, length):
        
        date = tournaments[i]["date"]
        if(date != "Tournament Postponed"):
            day = Getday(date, True)
            year = GetYear(date, True)
            month = GetMonth(date, True)
            timeStamp = GenerateTimeStamp(day,month,year)

            if(day.isnumeric()):
                 if((int(month) < int(currentMonth)) or (int(day) < int(currentDay))):
                     timeStamp = None
            
            tournaments[i]["date"] = timeStamp

            if(tournaments[i]["date"] == None):
                del tournaments[i]["date"]
                length = len(tournaments)

            else:
                rightTournaments.append(tournaments[i])
         
        else: 
          del tournaments[i]
     
    UPCOMMING_TOURNAMENTS = rightTournaments

    ShouldSend(UPCOMMING_TOURNAMENTS)
    return

def Getday(date, isOneDay):
    splittedDate = date.split()

    return splittedDate[1].replace(",", "")

def GetYear(date, isOneDay):
    splittedDate = date.split()
    return splittedDate[len(splittedDate) -1]

def GetMonth(date, isOneDay):
    splittedDate = date.split()
    return StringToDateNumber(splittedDate[0])


def GenerateTimeStamp(Day,Month,Year):
    date = Year + "-" + Month + "-" + Day
    return date

def isOneDay(date):
    return re.search("-",date)


def StringToDateNumber(month):

    if(month == "Jan"):
        return "01"
    
    if(month == "Feb"):
        return "02"
    
    if(month == "Mar"):
        return "03"
    
    if(month == "Apr"):
        return "04"
    
    if(month == "May"):
        return "05"
    
    if(month == "Jun"):
        return "06"
    
    if(month == "Jul"):
        return "07"
    
    if(month == "Aug"):
        return "08"
    
    if(month == "Sep"):
        return "09"
    
    if(month == "Oct"):
        return "10"
    
    if(month == "Nov"):
        return "11"


    if(month == "Dec"):
        return "12"

def ShouldSend (tournaments):
    print(tournaments)
    for tournament in tournaments:
        print(tournament["date"] + "==" + GenerateDatePlusDays())
        if(tournament["date"] == GenerateDatePlusDays()):
            if(tournament["prize"] == ""):
                tournament["prize"] = "TBD"
            print("SEND MESSAGE")
            tournament["tournament"] = tournament["tournament"].replace("_", "-")
            BODY = "*A NEW CSGO EVENT IS COMMING TO TOWN!:*\n🎫: {}\n📍:{}\n🗓️: {}\n🏆: {}\n🌐:[Liquipedia](https://liquipedia.net{}) ".format(tournament["tournament"], tournament["event_locaion"], tournament["date"], tournament["prize"], tournament["link"])
            SEND_MESSAGE(Bot_id=BOT_ID, chat_id=CHAT_ID, body=BODY)
            CreateIcsFile(tournament["tournament"],  tournament["date"])
            SEND_CALENDAR("./ICS/Data.ics", BOT_ID, CHAT_ID)


def CreateIcsFile(Name, Date):
    c = Calendar()
    e = Event()
    e.name = Name
    e.begin = Date + " 12:30:00"
    c.events.add(e)
    c.events
    with open("./ICS/Data.ics","w") as my_file:
         my_file.writelines(c.serialize_iter())

    return 

GetEventsFromLiquidPedia()