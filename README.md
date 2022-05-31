# odin-tictactoe
Created as a part of the Odin Project curriculum

**Introduction**
The goal of this project is to create a game of Tic-Tac-Toe using modules and factory functions to avoid global variables. As an added challenge, I implemented the minimax algorithm to create an unbeatable ai. 

**Functionality** 
The page design and functionality is pretty straight forward. It's designed like a computer chip using my own original artwork as the basis. I also adapted some video game buttons I found on codepen (credit to user @reulison). Upon launching the page, the user is given the option to choose player vs player or player vs computer. There is also a reset button, which can be clicked at anytime to reset the game back to mode selection. 

If choosing PvP, the page jumps to symbol selection. It is always assumed the player making the selection is player 1, and will asign player 2 the other symbol. 

If choosing PvC, the page jumps to difficulty selection. The difficulties range from easy (ai only makes a random move) to impossible (ai only makes the optimal move). After selecting difficulty, the player is then given the option to select a symbol. 

The game plays straightforward like tic-tac-toe from there. First to get three in a row is declared the winner. 

**Process** 
This project was significantly more challenging than I anticipated when I started it. I ran into at least a little bit of trouble each step of the way, and needed to redisgn my modules once or twice to get them working properly. It was definitely a great learning opportunity! I started by designing the gameBoard module and ensuring it worked, moved into creating a module that controls the game, then creating a factory function so the game controlling module can create player objects. Once I had the game working player v player, I moved into building out the ai. For the ai, I started by implementing a random move before building out an unbeatable ai using minimax. Finally, I created different difficulties by introduce the chance to make a random move. 

The big thing was wrapping my head around how Javascript accesses values when it comes to Objects. Since a reference to the object is stored, and not the value itself, I often had to work around being unable to directly change variables in my modules. For example, the gameboard is an array. In order to reset the gameboard, I have to change the reference to it using array methods like splice. If I just tried to set gameBoard = [], it wouldn't have worked as its changing the variable but not the reference to it in the memory. 

Minimax was also quite challenging to implement, even with the abundance of information on it online. The algorithm itself isn't too challenging, but getting it working properly was. Essentially, based on a certain board set up, and on the assumption that each player is making optimal moves, you can map out how the game will play out. You can do this in Javascript via recurrsion. The ai will take the current gameBoard, and run it against all possible moves and winning combinations. It does the same for each player and assigns a score to each gameBoard (10 for itself, 0 for a tie, and -10 for the human player). Essentially, the ai is looking for the next move it should make so it makes the least possible moves in order to win (or to not lose). The big issue I ran into was the computer was making moves that always let me win...turns out I had the scores backwards and gave the ai the minimizing score at first. 

**Conclusion**
This was one was a doozy! I had a big family event that also lead to me getting COVID while working on this as well, so I had to take some breaks from the project. I found that each time I returned though, it helped me work through previous issues I was having. Would definitely like to come back to minimax in the future, perhaps trying my hand at making a game of chess. 
