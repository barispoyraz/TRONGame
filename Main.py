import pygame
import sys
import time

from Player import Player

pygame.init()

SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600

WHITE = pygame.Color(255, 255, 255)
BLACK = pygame.Color(0, 0, 0)
BLUE = pygame.Color(66, 134, 244)
RED = pygame.Color(255, 0, 0)
LIGHT_BLUE = pygame.Color(66, 215, 244)
PINK = pygame.Color(237, 21, 172)

playSurface = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("TRON Game!")
fpsController = pygame.time.Clock()


def text(text2, font, color):
    text_surf = font.render(text2, True, color)
    return text_surf, text_surf.get_rect()


def game_over(winner):
    game_over_font = pygame.font.SysFont("monaco", 72)
    if winner is 1:
        game_over_surf, game_over_rect = text("Player 1 Win", game_over_font, RED)
    else:
        game_over_surf, game_over_rect = text("Player 2 Win", game_over_font, RED)

    game_over_rect.center = ((SCREEN_WIDTH/2), (SCREEN_HEIGHT/2))
    playSurface.blit(game_over_surf, game_over_rect)

    pygame.display.flip()
    time.sleep(4)

    game_over_menu()
    """pygame.quit()
    quit()"""


def game_over_menu():
    playSurface.fill(BLACK)
    over_text = pygame.font.SysFont("monaco", 48)
    over_surf, over_rect = text("What would you like to do?", over_text, WHITE)
    over_rect.center = ((SCREEN_WIDTH / 2), (SCREEN_HEIGHT / 2))
    playSurface.blit(over_surf, over_rect)


def pause():
    paused = True

    pause_text = pygame.font.SysFont("monaco", 48)
    pause_text_surf, pause_text_rect = text("Game Paused Press P to Continue", pause_text, WHITE)
    pause_text_rect.center = ((SCREEN_WIDTH / 2), (SCREEN_HEIGHT / 2))
    playSurface.blit(pause_text_surf, pause_text_rect)

    pygame.display.update()

    while paused:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                quit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_p:
                    paused = False

        """button(playSurface, "Continue", 100, 500, 100, 50, BLACK, BLUE)"""
        fpsController.tick(23)

    playSurface.fill(BLACK)


# Player 1: W, A, S, D , Player 2: UP ARROW, LEFT ARROW, DOWN ARROW, RIGHT ARROW
def game_loop():

    # Player 1 & Player 2 Starting Positions, Directions
    player1_start_pos = [100, 100]
    player2_start_pos = [700, 500]

    player1_body = [[100, 100]]
    player2_body = [[700, 500]]

    player1 = Player(pygame.K_w, pygame.K_s, pygame.K_a, pygame.K_d, LIGHT_BLUE)
    player2 = Player(pygame.K_UP, pygame.K_DOWN, pygame.K_LEFT, pygame.K_RIGHT, PINK)

    player1_direction = 'RIGHT'
    player2_direction = 'LEFT'

    player1_change_to = player1_direction
    player2_change_to = player2_direction

    stopped = False

    while not stopped:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                stopped = True
            elif event.type == pygame.KEYDOWN:
                # Pause
                if event.key == pygame.K_p:
                    paused = True
                    pause()
                    pygame.display.update()
                # Player 1 Controller
                if event.key == getattr(player1, 'right_key'):
                    player1_change_to = 'RIGHT'
                if event.key == getattr(player1, 'left_key'):
                    player1_change_to = 'LEFT'
                if event.key == getattr(player1, 'up_key'):
                    player1_change_to = 'UP'
                if event.key == getattr(player1, 'down_key'):
                    player1_change_to = 'DOWN'

                # Player 2 Controller
                if event.key == getattr(player2, 'right_key'):
                    player2_change_to = 'RIGHT'
                if event.key == getattr(player2, 'left_key'):
                    player2_change_to = 'LEFT'
                if event.key == getattr(player2, 'up_key'):
                    player2_change_to = 'UP'
                if event.key == getattr(player2, 'down_key'):
                    player2_change_to = 'DOWN'

                # Exit Game (May turn into pause at some point)
                if event.key == pygame.K_ESCAPE:
                    pygame.quit()
                    quit()

        # Validation of the Direction: Player 1
        if player1_change_to == 'RIGHT' and not player1_direction == 'LEFT':
            player1_direction = 'RIGHT'
        if player1_change_to == 'LEFT' and not player1_direction == 'RIGHT':
            player1_direction = 'LEFT'
        if player1_change_to == 'UP' and not player1_direction == 'DOWN':
            player1_direction = 'UP'
        if player1_change_to == 'DOWN' and not player1_direction == 'UP':
            player1_direction = 'DOWN'

        # Validation of the Direction: Player 2
        if player2_change_to == 'RIGHT' and not player2_direction == 'LEFT':
            player2_direction = 'RIGHT'
        if player2_change_to == 'LEFT' and not player2_direction == 'RIGHT':
            player2_direction = 'LEFT'
        if player2_change_to == 'UP' and not player2_direction == 'DOWN':
            player2_direction = 'UP'
        if player2_change_to == 'DOWN' and not player2_direction == 'UP':
            player2_direction = 'DOWN'

        # Movement: Player 1
        if player1_direction == 'RIGHT':
            player1_start_pos[0] += 5
        if player1_direction == 'LEFT':
            player1_start_pos[0] -= 5
        if player1_direction == 'UP':
            player1_start_pos[1] -= 5
        if player1_direction == 'DOWN':
            player1_start_pos[1] += 5

        # Movement: Player 2
        if player2_direction == 'RIGHT':
            player2_start_pos[0] += 5
        if player2_direction == 'LEFT':
            player2_start_pos[0] -= 5
        if player2_direction == 'UP':
            player2_start_pos[1] -= 5
        if player2_direction == 'DOWN':
            player2_start_pos[1] += 5

        # Increase Body: Player 1
        player1_body.insert(0, list(player1_start_pos))
        # Increase Body: Player 2
        player2_body.insert(0, list(player2_start_pos))

        # Draw Player 1 & Player 2
        for player1_pos in player1_body:
            pygame.draw.rect(playSurface, getattr(player1, 'color'), pygame.Rect(player1_pos[0], player1_pos[1], 5, 5))
        for player2_pos in player2_body:
            pygame.draw.rect(playSurface, getattr(player2, 'color'), pygame.Rect(player2_pos[0], player2_pos[1], 5, 5))

        # Boundaries
        if player1_start_pos[0] > SCREEN_WIDTH - 10 or player1_start_pos[0] < 0:
            game_over(2)
        if player1_start_pos[1] > SCREEN_HEIGHT - 10 or player1_start_pos[1] < 0:
            game_over(2)

        if player2_start_pos[0] > SCREEN_WIDTH - 10 or player2_start_pos[0] < 0:
            game_over(1)
        if player2_start_pos[1] > SCREEN_HEIGHT - 10 or player2_start_pos[1] < 0:
            game_over(1)

        # Collision to yourself
        for blocks in player1_body[1:]:
            if player1_start_pos[0] == blocks[0] and player1_start_pos[1] == blocks[1]:
                game_over(2)

        for blocks in player2_body[1:]:
            if player2_start_pos[0] == blocks[0] and player2_start_pos[1] == blocks[1]:
                game_over(1)

        # Collision to other player
        # Player 1 colliding to Player 2
        for blocks in player2_body[1:]:
            if player1_start_pos[0] == blocks[0] and player1_start_pos[1] == blocks[1]:
                game_over(2)

        # Player 2 colliding to Player 1
        for blocks in player1_body[1:]:
            if player2_start_pos[0] == blocks[0] and player2_start_pos[1] == blocks[1]:
                game_over(1)

        pygame.display.update()
        fpsController.tick(23)


def game_menu():
    print("TODO")


# TODO
def show_credits(screen):
    screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
    pygame.display.set_caption("TRON Game!")
    screen.fill(BLACK)
    pygame.display.update()


def button(screen, msg, x, y, w, h, init_color, focus_color, action = None):
    mouse = pygame.mouse.get_pos()
    click = pygame.mouse.get_pressed()

    if x + w > mouse[0] > x and y + h > mouse[1] > y:
        pygame.draw.rect(screen, focus_color, (x, y, w, h))
        if click[0] == 1 and action is not None:
            if action == "play":
                print("Play")
            elif action == "credits":
                print("Credits Page")
                show_credits(screen)
            elif action == "exit":
                print("Exiting")
                pygame.quit()
                quit()

    else:
        pygame.draw.rect(screen, init_color, (x, y, w, h))

    play_text = pygame.font.SysFont("Times New Roman", 28)
    play_text_surf, play_text_rect = text(msg, play_text, WHITE)
    # play_text_rect.center( (350 + (100/2)), (225 + (50/2)) )
    play_text_rect.center = ( (x + (w/2)), (y + (h/2)))
    screen.blit(play_text_surf, play_text_rect)


def main():
    game_loop()
    pygame.quit()
    quit()

if __name__ == "__main__":
    main()
