class GameStates: 
    def __init__(self, ai_game): 
        self.settings = ai_game.settings
        self.reset_states()
        self.high_score = 0
        self.level = 1
    
    def reset_states(self):
        self.ships_left = self.settings.ship_limit
        self.score = 0
        