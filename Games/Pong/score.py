from settings.settings import *
import pygame

class Score :
    def __init__(self,initScore,player):
        pygame.font.init()
        self.score = initScore
        self.fontSize = FONT_SIZE
        self.color = FONT_COLOR
        self.font = FONT
        self.gameInstance = pygame.display.get_surface()
        self.player = player
        self.renderedScore = None
        self.renderedFont = None
    
    def RenderScore(self):
        x = self.calcVector()
        y = Y
        self.gameInstance = pygame.display.get_surface()
        if(self.renderedScore):
            self.gameInstance.fill("black", (x,y,20,50))
        
        self.renderedFont = pygame.font.SysFont(self.font, self.fontSize)
        self.renderedScore =  self.renderedFont.render(self.score, True, self.color)
        self.gameInstance.blit(self.renderedScore, (x,y))
        return

    def calcVector(self):
        screenWidth = WIDTH
        MidBorderWidth = WIDTH_MID_BORDER

        if(self.player == 1):
            midStart = (screenWidth /2) - (MidBorderWidth/2)
            mid = (midStart / 2) - self.fontSize
            return mid
        
        if(self.player == 2):
            midStart = (screenWidth/2) + (MidBorderWidth/2)
            mid = (((screenWidth - midStart) / 2) - self.fontSize) + midStart
            return mid
        
        raise ValueError('There can only be two Players in Pong!')
            


    def addScore(self):
        convScore = int(self.score)
        convScore+=1
        self.score = str(convScore)
        self.RenderScore()
        return 
    
    def undoScore(self):
        self.score-=1
        return
