import pygame
from pygame.sprite import Sprite
class Ship(Sprite):
    def __init__(self, ai_game):
        super().__init__()
        self.screen = ai_game.screen
        self.settings = ai_game.settings
        self.image = pygame.image.load('python/alien_python/images/ship.bmp')
        self.rect = self.image.get_rect() # 获取飞船的外接矩形
        self.screen_rect = ai_game.screen.get_rect()
        self.rect.midbottom = self.screen_rect.midbottom # 设置飞船初始位置 在屏幕底部中央
        self.x = float(self.rect.x)
        self.moving_right = False
        self.moving_left = False

       
    def blitme(self):
        self.screen.blit(self.image, self.rect) # 在指定位置绘制飞船

    def update(self):
        if self.moving_right and self.rect.right < self.screen_rect.right:
            self.x += self.settings.ship_speed
        if self.moving_left and self.rect.left > 0:
            self.x -= self.settings.ship_speed
        self.rect.x = self.x
    
    def center_ship(self):
        self.rect.midbottom = self.screen_rect.midbottom
        self.x = float(self.rect.x)