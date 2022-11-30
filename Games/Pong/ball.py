import pygame
from settings.settings import *
from time import *
import random


class Ball :
    def __init__ (self):
        self.currentPosX, self.currentPosY = self.calcMiddleofScreen()
        self.radius = RADIUS
        self.gameInstance = pygame.display.get_surface()
        self.directionX = (random.choice([-1, 1])) /3
        self.directionY = (random.choice([-1, 1])) / 3
    
    def renderBall(self):
        pygame.draw.circle(self.gameInstance, BALL_COLOR, (self.currentPosX, self.currentPosY),self.radius)
        return 

    def calcMiddleofScreen(self):
        screenHeight = HEIGHT
        screenWidth = WIDTH
        x_mid = (screenWidth / 2) - (RADIUS / 2)
        y_mid = (screenHeight / 2) - (RADIUS / 2);

        return (x_mid,y_mid)

    def updatePos(self, player1Y, player2Y): 
        self.renderBall()

        player1YStart = player1Y
        player1End = player1Y + PLAYER_HEIGHT

        player2YStart = player2Y
        player2End = player2YStart + PLAYER_HEIGHT


        if(self.currentPosY >=player1YStart and self.currentPosY <= player1End):
            if((self.currentPosX - RADIUS) <= (INIT_X_POS + PLAYER_WIDTH)):
                self.directionY = -1 * self.directionY
                self.currentPosY = self.currentPosY + self.directionY 
                self.directionX = -1 * self.directionX
                self.currentPosX = self.currentPosX + self.directionX


        if(self.currentPosY >=player2YStart and self.currentPosY <= player2End):
            if((self.currentPosX - RADIUS) >= ((WIDTH- INIT_X_POS) - PLAYER_WIDTH)):
                self.directionY = -1 * self.directionY
                self.currentPosY = self.currentPosY + self.directionY 
                self.directionX = -1 * self.directionX
                self.currentPosX = self.currentPosX + self.directionX

            
        
        if((self.currentPosY - RADIUS) <= 0):
            self.directionY = -1 * self.directionY
            self.currentPosY = self.currentPosY + self.directionY
        
        if((self.currentPosY + RADIUS) >= HEIGHT):
            self.directionY =  -1 * self.directionY
            self.currentPosY = self.currentPosY + self.directionY

        self.currentPosY+=self.directionY
        self.currentPosX+= self.directionX

    def reset(self):
        self.currentPosX, self.currentPosY = self.calcMiddleofScreen()
        self.directionX = (random.choice([-1, 1])) /3
        self.directionY = (random.choice([-1, 1])) / 3
        self.renderBall()

    def scored(self):
        if((self.currentPosX + RADIUS) >= WIDTH ):
            return 1
        
        if((self.currentPosX - RADIUS) <= 0 ):
            return 2
        
        return -1
