import sys
import pygame
from settings import Settings
from ship import Ship
from bullet import Bullet
from alien import Alien
from game_states import GameStates
from button import Button
from score_board import ScoreBoard

class AlienInvate:
    def __init__(self):
        pygame.init()
        self.settings = Settings()
        self.clock = pygame.time.Clock() # 创建clock对象
        # self.screen = pygame.display.set_mode((self.settings.screen_width, self.settings.screen_height))
        self.screen = pygame.display.set_mode((0, 0), pygame.FULLSCREEN) # 全屏模式
        self.settings.screen_width = self.screen.get_rect().width
        self.settings.screen_height = self.screen.get_rect().height
        pygame.display.set_caption("Alien Invate")
        self.states = GameStates(self)
        self.sb = ScoreBoard(self)
        self.ship = Ship(self)
        self.bullets = pygame.sprite.Group() # 创建一个用于存储子弹的编组
        # self.bg_color = (230, 230, 230) # 设置背景颜色
        self.aliens = pygame.sprite.Group() # 创建一个用于存储外星人的编组
        self._create_fleet() # 创建外星人群
        self.game_active = False
        self.play_button = Button(self, "Play")
    
    def run_game(self):
        while True:
            self._check_events() # 监视键盘和鼠标事件
            if self.game_active:
                self.ship.update() # 更新飞船位置
                self._update_bullets() # 更新子弹位置
                self._update_aliens() # 更新外星人位置
            self._update_screen()
            self.clock.tick(60) # 尽可能控制游戏循环频率为60帧每秒

    def _check_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                sys.exit()
            elif event.type == pygame.KEYDOWN:
                self._check_keydown_events(event)
            elif event.type == pygame.KEYUP:
                self._check_keyUp_events(event)
            elif event.type == pygame.MOUSEBUTTONDOWN:
                mouse_pos = pygame.mouse.get_pos()
                self._check_play_button(mouse_pos)

    def _check_keydown_events(self, event):
        if event.key == pygame.K_RIGHT: # 向右移动飞船
            self.ship.moving_right = True
        elif event.key == pygame.K_LEFT: # 向左移动飞船
            self.ship.moving_left = True
        elif event.key == pygame.K_q: # 退出游戏
            sys.exit()
        elif event.key == pygame.K_SPACE: 
            self._fire_bullet() # 发射子弹
    
    def _fire_bullet(self):
       if len(self.bullets) < self.settings.bullets_allowed:
            new_bullet = Bullet(self)
            self.bullets.add(new_bullet)
    
    def _check_keyUp_events(self, event):
        if event.key == pygame.K_RIGHT:
            self.ship.moving_right = False
        elif event.key == pygame.K_LEFT:
            self.ship.moving_left = False
    
    def _update_screen(self):
        self.screen.fill(self.settings.bg_color) # 使用背景颜色填充屏幕
        for bullet in self.bullets.sprites():
            bullet.draw_bullet()
        self.ship.blitme() # 绘制飞船
        self.aliens.draw(self.screen) # 绘制外星人

        self.sb.show_score()
        if not self.game_active:
            self.play_button.draw_button()
        pygame.display.flip()

    def _update_bullets(self):
        self.bullets.update()
        for bullet in self.bullets.copy():
            if bullet.rect.bottom <= 0:
                self.bullets.remove(bullet)
        self._check_bullet_alien_collisions()

    def _create_fleet(self):
        # 创建一个外星人，并计算一行可容纳多少个外星人
        alien = Alien(self)
        alien_width, alien_height = alien.rect.size
        current_x, current_y = alien_width, alien_height
        while current_y < (self.settings.screen_height - alien_height * 4):
            while current_x < (self.settings.screen_width - alien_width * 2):
                self._create_alien(current_x, current_y)
                current_x += alien_width * 2
            current_x = alien_width
            current_y += alien_height * 2

    def _create_alien(self, x_position, y_position):
        new_alien = Alien(self)
        new_alien.x = x_position
        new_alien.rect.x = x_position
        new_alien.rect.y = y_position
        new_alien.y = y_position
        self.aliens.add(new_alien)

    def _update_aliens(self): # 更新外星人群中所有外星人的位置
        self._check_fleet_edges()
        self.aliens.update()
        if pygame.sprite.spritecollideany(self.ship, self.aliens):
            self._ship_hit()
        self._check_aliens_bottom()

    def _check_fleet_edges(self):
        for alien in self.aliens.sprites():
            if alien.check_edges():
                self._change_fleet_direction()
                break
    
    def _change_fleet_direction(self):
        for alien in self.aliens.sprites():
            alien.rect.y += self.settings.fleet_dorp_speed
        self.settings.fleet_direction *= -1

    def _check_bullet_alien_collisions(self):
        collisions = pygame.sprite.groupcollide( # 检查是否有子弹击中外星人 有的话就删除相应的子弹和外星人
            self.bullets, self.aliens, True, True)
        if collisions:
            for aliens in collisions.values():
                self.states.score += self.settings.alien_points * len(collisions)
            self.sb.prep_score()
            self.sb.check_high_score()
        
        if not self.aliens:
            self.bullets.empty()
            self._create_fleet()
            self.settings.increase_speed()
            self.states.level += 1
            self.sb.pre_level()
            self.sb.pre_ship()

    def _ship_hit(self):
        if (self.states.ships_left > 0):
            self.states.ships_left -= 1
            self.aliens.empty()
            self.bullets.empty()
            self._create_fleet()
            self.ship.center_ship()
            pygame.time.delay(500)
        else:
            self.game_active = False
            pygame.mouse.set_visible(True) # 显示鼠标光标

    def _check_aliens_bottom(self):
        for alien in self.aliens.sprites():
            if alien.rect.bottom >= self.settings.screen_height:
                self._ship_hit()
                break
    
    def _check_play_button(self, mouse_pos):
        button_clicked = self.play_button.rect.collidepoint(mouse_pos)
        if button_clicked and not self.game_active:
            self.states.reset_states()
            self.sb.prep_score() # 重置得分图像
            self.sb.pre_level()
            self.sb.pre_ship()
            self.game_active = True
            self.aliens.empty()
            self.bullets.empty()
            self._create_fleet()
            self.ship.center_ship()
            self.settings.initialize_dynamic_settings()
            pygame.mouse.set_visible(False) # 隐藏鼠标光标

if __name__ == '__main__':
    ai = AlienInvate()
    ai.run_game()
    
