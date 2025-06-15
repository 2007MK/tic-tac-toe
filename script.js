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

    function disableBoard() {

    }

    return {updateBoard, markers, getBoard, disableBoard, };
})();


// Player factory
function Player(name, marker) {
    return { name, marker };
}


// the main game controller
const GameController = (function () {
    //create two Players
        let Player1 = Player("Player1", Gameboard.markers[0]);
        let Player2 = Player("Player2", Gameboard.markers[1]);
    
    let turn = 1;
    function turnSwitcher() {
            if (turn % 2 == 1) { //odd turns played by Player1
                return `${Player1.marker}`;
            } else {
                return `${Player2.marker}`;
            }        
    }
    

    let board = Gameboard.getBoard();
    function choice(place) {
        if (!(Gameboard.markers.includes(board[place - 1])) && (place <= 9)) {            
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
                board.forEach((element, index) => {
                    if(element === 'X') {
                        indicesContainingX.push(index);
                    }
                });
                return indicesContainingX;
            },
            
            O: function() {
                let indicesContainingO = [];
                board.forEach((element, index) => {
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

    
    return { choice, };
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

    function announceWinner(winner) {
        let modal = document.querySelector("dialog")
        let h1 = document.querySelector(".announcement");
        if (winner == undefined) {
            h1.textContent = "It's a Tie!"; 
            console.log(h1);
        } else {
            h1.textContent = `The winner is ${winner.name}`;
        }
        modal.showModal();
    }

    return {render, announceWinner};
})();


displayController.render();
