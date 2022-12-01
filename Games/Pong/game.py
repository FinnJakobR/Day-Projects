import pygame,sys
from settings.settings import *
from Level import *
from score import * 
from player import * 
from ball import *

class Game :
   def __init__(self):
    pygame.init()
    self.screen = pygame.display.set_mode((WIDTH,HEIGHT))
    pygame.display.set_caption("PONG!")
    self.clock = pygame.time.Clock()

    self.player1 = Player(1,PLAYER_ONE)
    self.player2 = Player(2, PLAYER_TWO)
    self.player1Score = Score("0",1)
    self.player2Score = Score("0", 2)
    self.map = Level()
    self.ball = Ball()


   def run(self):
    
    while True:
        for event in pygame.event.get():
            if(event.type == pygame.QUIT):
                pygame.quit()
                sys.exit()
                    
        self.screen.fill("black")

        self.player2Score.RenderScore()
        self.player1Score.RenderScore()

        self.player1.renderPlayer()
        self.player2.renderPlayer()

        self.player1.listenForKeys()
        self.player2.listenForKeys()

        self.player1.playCpu(self.ball.currentPosY, self.ball.currentPosX)
        self.player2.playCpu(self.ball.currentPosY, self.ball.currentPosX)

        self.map.createMap()


        player1PosY = self.player1.currentPosY
        player2PosY = self.player2.currentPosY

        self.ball.updatePos(player1PosY,player2PosY)

        isScored = self.ball.scored()

        if(isScored == 1):
            self.player1Score.addScore()
            self.player1.resetPlayer()
            self.player2.resetPlayer()
            self.ball.reset()
        
        if(isScored == 2):
            self.player2Score.addScore()
            self.player1.resetPlayer()
            self.player2.resetPlayer()
            self.ball.reset()

        currentPlayer1Score = int(self.player1Score.score)
        currentPlayer2Score = int(self.player2Score.score)

        if(currentPlayer1Score > WINNING_SCORE -1):
            self.newRound()

        if(currentPlayer2Score > WINNING_SCORE -1):
            self.newRound()


        pygame.display.update()


   def newRound(self):
    newRound = Game()
    newRound.run()
     




if __name__ == "__main__":
    game = Game()
    game.run()
