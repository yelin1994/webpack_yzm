class Settings:
    def __init__(self):
        self.screen_width = 1200
        self.screen_height = 800
        self.bg_color = (230, 230, 230)
        self.ship_speed = 1.5
        self.ship_limit = 3

        self.bullet_speed = 3.0 # 子弹速度
        self.bullet_width = 10
        self.bullet_height = 15
        self.bullet_color = (250, 00, 00)
        self.bullets_allowed = 100 # 屏幕上允许存在的子弹数

        self.alien_speed = 1.0 # 外星人速度
        self.fleet_direction = 1 # 1表示向右移动，-1表示
        self.fleet_dorp_speed = 10 # 外星人下移速度

        self.speedup_scale = 1.1 # 游戏节奏加快速度
        self.initialize_dynamic_settings()
    
    def initialize_dynamic_settings(self): # 初始化随游戏进行而变化的设置
        self.ship_speed = 1.5
        self.bullet_speed = 3.0
        self.alien_speed = 1.0
        self.fleet_direction = 1
        self.alien_points = 50

    def increase_speed(self): # 提高速度设置
        self.ship_speed *= self.speedup_scale
        self.bullet_speed *= self.speedup_scale
        self.alien_speed *= self.speedup_scale
        self.alien_points = int(self.alien_points * self.speedup_scale)