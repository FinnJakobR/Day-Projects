
import subprocess
import platform
import time
import threading
from settings.settings import * 
import os


class AI: 
    def __init__(self):
        self.os = getCurrentOS()
        self.windowData = None
        self.windowHeight = HEIGHT
        self.windowWidth = WIDTH
        self.windowID = None


    def startScreenshooting(self):
        self.set_interval(self.makeScreenShot,3)
        
    def makeScreenShot(self):
        if(self.os == "Darwin"):
            #MacOs 
            window = subprocess.check_output("./Games/Pong/externalScripts/windowlist")
            if(b"Python" in window):
                 self.windowData = self.convertByteToString(window)
                 self.windowID =  self.getWindowID()
                 print(self.windowData)
                 self.makeWholeScreenshot()



    def makeWholeScreenshot(self):
        os.system("screencapture -l{} {}wholeScreen.jpg".format(self.windowID,SAVE_PATH))
    
    def convertByteToString(self, str):
        return str.decode("utf-8")
    
    def getWindowID(self):
        data = self.windowData
        dataArr = data.split(",")
        return dataArr[2]

            


    def lern(self):
        pass

    def set_interval(self,func, sec):
      if(self.windowData == None):
        def func_wrapper():
            func()
            self.set_interval(func, sec)
        t = threading.Timer(sec, func_wrapper)
        t.start()
        return t
      else:
        return


def getCurrentOS():
    return platform.system()




