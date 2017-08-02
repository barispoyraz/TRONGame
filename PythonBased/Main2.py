import wx

SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600


class TronGame(wx.Frame):
    def __init__(self, parent, title):
        super(TronGame, self).__init__(parent, title=title, size=(SCREEN_WIDTH, SCREEN_HEIGHT))

        self.SetMinSize((SCREEN_WIDTH, SCREEN_HEIGHT))
        self.SetMaxSize((SCREEN_WIDTH, SCREEN_HEIGHT))

        self.main_menu_panel = MainMenuPanel(self)
        self.credits_panel = CreditsPanel(self)

        self.credits_panel.Hide()

        self.sizer = wx.BoxSizer(wx.VERTICAL)
        self.sizer.Add(self.main_menu_panel, 1, wx.EXPAND)
        self.sizer.Add(self.credits_panel, 1, wx.EXPAND)
        self.SetSizer(self.sizer)

        self.Show()


class MainMenuPanel(wx.Panel):
    def __init__(self, parent):
        wx.Panel.__init__(self, parent=parent)
        self.SetBackgroundColour(wx.BLACK)

        font = self.GetFont()
        font.SetPointSize(32)
        label = wx.StaticText(self, label="TRON Game", pos=(280, 100))
        label.SetForegroundColour(wx.WHITE)
        label.SetFont(font)

        play_button = wx.Button(self, id=1, label="Play", pos=(355, 250))
        credits_button = wx.Button(self, id=2, label="Credits", pos=(355, 300))
        quit_button = wx.Button(self, id=3, label="Quit", pos=(355, 350))

        self.Bind(wx.EVT_BUTTON, self.switch_panels, play_button)
        self.Bind(wx.EVT_BUTTON, self.switch_panels, credits_button)
        self.Bind(wx.EVT_BUTTON, self.switch_panels, quit_button)

    def switch_panels(self, event):
        if event.GetId() is 1:
            self.GetParent().Hide()
            import Main as game
            game.main()
            self.GetParent().Close()
        elif event.GetId() is 2:
            self.GetParent().main_menu_panel.Hide()
            self.GetParent().credits_panel.Show()
        else:
            self.GetParent().Close()
        self.GetParent().Layout()


class CreditsPanel(wx.Panel):
    def __init__(self, parent):

        wx.Panel.__init__(self, parent=parent)

        self.SetBackgroundColour(wx.BLACK)

        font = self.GetFont()
        font.SetPointSize(32)
        label = wx.StaticText(self, label="Credits", pos=(320, 100))
        label.SetForegroundColour(wx.WHITE)
        label.SetFont(font)

        back_button = wx.Button(self, id=4, label="Back", pos=(660, 500))

        self.Bind(wx.EVT_BUTTON, self.switch_panels, back_button)

    def switch_panels(self, event):
        if event.GetId() is 4:
            self.GetParent().credits_panel.Hide()
            self.GetParent().main_menu_panel.Show()
        self.GetParent().Layout()


def main():
    app = wx.App()
    game = TronGame(None, title="Tron Game")
    game.Center()
    game.Show()
    app.MainLoop()


if __name__ == "__main__":
    main()
