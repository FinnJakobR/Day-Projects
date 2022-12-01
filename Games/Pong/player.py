import pygame
from settings.settings import *
import random

class Player :
    def __init__(self,player, playerType):
        self.player = player
        self.gameInstance = pygame.display.get_surface()
        self.type = playerType
        self.speed = SPEED
        self.velocity = -1
        self.height = PLAYER_HEIGHT
        self.width = PLAYER_WIDTH
        self.currentPosX = self.calcInitPosX()
        self.currentPosY = self.calcInitPosY()


    def renderPlayer(self):
        pygame.draw.rect(self.gameInstance, PLAYER_COLOR, (self.currentPosX, self.currentPosY, self.width, self.height))

    def calcInitPosY(self):
        screenHeight = HEIGHT
        mid = (screenHeight / 2 ) - self.height
        return mid

    def calcInitPosX(self):
        if(self.player == 1):
            return INIT_X_POS
        
        if(self.player == 2):
            return WIDTH - INIT_X_POS

    def GoUp(self): 
        if(self.currentPosY > 0):
            self.currentPosY+=self.velocity
            self.renderPlayer()
    
    def GoDown(self):
        if(self.currentPosY < (HEIGHT - self.height)):
           self.currentPosY = self.currentPosY - self.velocity
           self.renderPlayer()


    def listenForKeys(self):

        if self.type == "REAL":
            player1GoUp = False;
            player1GoDown = False;
            
            player2GoUp = False;
            player2GoDown = False

            
            keys = pygame.key.get_pressed()

            if(keys[pygame.K_UP] and self.player == 2):
                player2GoUp = True
                
            if(keys[pygame.K_UP] == 0):
                player2GoUp = False
                
            if(keys[pygame.K_DOWN] and self.player == 2):
                player2GoDown = True
                
            if(keys[pygame.K_DOWN] == 0):
                player2GoDown = False
                
            if(keys[pygame.K_w] and self.player == 1):
                player1GoUp = True
                
            if(keys[pygame.K_w] == 0):
                player1GoUp = False
                
            if(keys[pygame.K_s] and self.player == 1):
                player1GoDown = True
                
            if(keys[pygame.K_s] == 0):
                play1GoDown = False
            
            if(player1GoUp and self.player == 1):
                self.GoUp()
                
            if(player1GoDown and self.player == 1):
                self.GoDown()
                
            if(player2GoUp and self.player == 2):
                self.GoUp()
                
            if(player2GoDown and self.player == 2):
                self.GoDown()
    

    def playCpu(self,ballY, ballX):
        randomize = random.randint(1,3)
        if(self.type == "CPU"):
            if(self.player == 2 and ballX > WIDTH / 2 and randomize == 2):
                self.currentPosY = ballY
                self.renderPlayer()

            if(self.player == 1 and ballX < WIDTH / 2 and randomize == 2):
                self.currentPosY = ballY
                self.renderPlayer()
        return 

    def playAI(self):
        pass


    def resetPlayer(self):
        self.currentPosX = self.calcInitPosX()
        self.currentPosY = self.calcInitPosY()
        self.renderPlayer()


