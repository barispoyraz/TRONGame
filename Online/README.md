TRON Game Online Version - Using Node JS
==================

Client   |   Server
---   |   ---
***Triggers***   |   ***Triggers***   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   Connection  | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   Opponent Ready Information
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   Ready State   | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   Update Game Canvas
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   Key Press   | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   Update Opponent Information
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;      | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   Game Over State
***Handles***   |   ***Handles***
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   Waiting Information | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   Connection
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   Update Game Canvas | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   Disconnect
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   Update Opponent Information | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   Key Press
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   Game Over State | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   Ready State


Connection: Player connects to the server 
Ready State: Player presses R key to be ready, and this information is sent to server  
Key Press: Client catches the keyboard events and sends the information to server. Server uses the information to update the player's body  
Opponent Ready Information: Server checks the waiting list to see if there are exactly 2 players and sends an information to be displayed  
Update Game Canvas: Server sends the position information on each client. Clients use this information to draw the canvas  
Update Opponent Information: Server checks for opponents movement and informs the player
Game Over State: Server looks for collisions and informs clients if there is a collision  
 Disconnect: When the game is over, server deletes the player list and the socket list
 
