const Gameboard = (function () {
    let board = [
    "", "", "", 
    "", "", "", 
    "", "", ""];
    
    let markers = ["X", "O"];
    
    function updateBoard(place, marker) {
        board[place] = marker;
    }
    
    function getBoard() {
        return board;
    }
    
    
    function roundStarter() {
        board = [
        "", "", "", 
        "", "", "", 
        "", "", ""];

        GameController.resetTurn();
    }

    function resetBoard() {
        displayController.destroyModal();
        roundStarter();
        GameController.Player1.resetScore();
        GameController.Player2.resetScore();
        displayController.render();
        
    }
    
    function nextRound() {
        displayController.destroyModal();
        roundStarter();
        displayController.render();

    }

    return {updateBoard, markers, getBoard, resetBoard, nextRound};
})();


// Player factory
function Player(name, marker) {
    let score = 0;
    function getScore() {
        return score;
    }

    function resetScore() {
        score = 0;
    }

    function incrementScore() {
        score++;
    }
    return { name, marker, getScore, resetScore, incrementScore };
}


// the main game controller
const GameController = (function () {
    //create two Players
        let Player1 = Player("Player1", Gameboard.markers[0]);
        let Player2 = Player("Player2", Gameboard.markers[1]);
    
    let turn = 1;
    const resetTurn = () => turn = 1;
    function turnSwitcher() {
            if (turn % 2 == 1) { //odd turns played by Player1
                return `${Player1.marker}`;
            } else {
                return `${Player2.marker}`;
            }        
    }
    

    function choice(place) {
        if (!(Gameboard.markers.includes((Gameboard.getBoard())[place - 1])) && (place <= 9)) {            
            if(turn <= 9) {
                let marker = turnSwitcher();
                Gameboard.updateBoard((place - 1), marker);
                turn++;
                displayController.render();
                checkWin();
            } else {
                console.log("All players done playing");
                // probably announce winner or something in the future
            }            
        } else {
            console.log("That place is already occupied");
            
        }
    };

    let filledPlaces = {
            X: function() {
                let indicesContainingX = [];
                (Gameboard.getBoard()).forEach((element, index) => {
                    if(element === 'X') {
                        indicesContainingX.push(index);
                    }
                });
                return indicesContainingX;
            },
            
            O: function() {
                let indicesContainingO = [];
                (Gameboard.getBoard()).forEach((element, index) => {
                    if(element === 'O') {
                        indicesContainingO.push(index);
                    }
                });
                return indicesContainingO;
            }
        }

    function checkWin() {
        let winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        
        let xFilled = filledPlaces.X();
        for (const element of winningCombinations) {
            if (element.every(index => xFilled.includes(index))) {
                displayController.announceWinner(Player1);
                break;
            }
        }            
        let oFilled = filledPlaces.O();
        for (const element of winningCombinations) {
            if (element.every(index => oFilled.includes(index))) {
                displayController.announceWinner(Player2);
                break;
            }
        } 
        
        if (turn == 10) {
            displayController.announceWinner(); //announce tie if all the turns are over/all the boxes have been filled
        }
    }

    
    return { choice, Player1, Player2, resetTurn};
})();


const displayController = (function() {
    function render() {
        let boardUI = document.querySelector(".board");
        boardUI.innerHTML = "";
        let boardArray = Gameboard.getBoard();
        for (let i = 0; i < 9; i++) {
            let box = document.createElement("div");
            box.setAttribute("class", "box");
            box.setAttribute("id", i+1);
            if (boardArray[i] == '') {
                box.textContent = "";
            } else {
                if (boardArray[i] == 'X') {
                    box.textContent = "X";
                    box.setAttribute("class", "box X");
                } else {
                    box.textContent = "O";
                    box.setAttribute("class", "box O");
                }
            }
            click(box);
            boardUI.appendChild(box);            
        };
    };

    function click(box) {
        box.addEventListener("click", (e) => {
            GameController.choice(e.target.id);
            console.log(Gameboard.getBoard());
            
        })
    }

    function createModal(winnerAnnouncement) {
        let body = document.querySelector("body");
        let modal = document.createElement("dialog");
        let h1 = document.createElement("h1");
        let resetBoardBtn = document.createElement("button");
        let nextRoundBtn = document.createElement("button");
        let p1Score = document.createElement("p");
        let p2Score = document.createElement("p");

        h1.setAttribute("class", "announcement");
        resetBoardBtn.setAttribute("id", "reset");
        resetBoardBtn.textContent = "Reset"
        nextRoundBtn.setAttribute("id", "next-round");
        nextRoundBtn.textContent = "Next Round";

        
        h1.textContent = winnerAnnouncement;
        p1Score.textContent = `${GameController.Player1.name} : ${GameController.Player1.getScore()}`
        p2Score.textContent = `${GameController.Player2.name} : ${GameController.Player2.getScore()}`
        
        modal.appendChild(h1);
        modal.appendChild(p1Score);
        modal.appendChild(p2Score);
        modal.appendChild(resetBoardBtn);
        modal.appendChild(nextRoundBtn);
        body.appendChild(modal);
        
        displayModal(modal);
        addListeners(resetBoardBtn, nextRoundBtn);

    }


    function displayModal(modal) {
        modal.showModal();
    }


    function destroyModal() {
        let modal = document.querySelector("dialog");
        let body = document.querySelector("body");
        modal.close();
        modal.innerHTML = "";
        body.removeChild(modal);
        console.log("Modal closed and destoyed");
    }

    function announceWinner(winner) {
        if (winner == undefined) {
            console.log("its a tie");
            createModal("It's a Tie"); 
        } else {
            console.log(`The winner is ${winner.name}`);
            winner.incrementScore();            
            createModal(`The winner is ${winner.name}`);
        }
    }
    

    function addListeners(...args) {
        args.forEach(element => {
            if (element.id == "reset") {
                element.addEventListener("click", () => {
                    Gameboard.resetBoard();
                })
            }

            if (element.id == "next-round") {
                element.addEventListener("click", () => {
                    Gameboard.nextRound();
                })
            }
        })
    }
    
    return {render, announceWinner, destroyModal,};
})();


displayController.render();
