const Gameboard = (function () {
    let board = [
    "", "", "", 
    "", "", "", 
    "", "", ""];

    let markers = ["X", "O"];

    function updateBoard(place, marker) {
        board[place] = marker;
        console.log(board);
    }

    function getBoard() {
        return board;
    }

    function resetBoard() {

    }

    return {updateBoard, markers, getBoard, resetBoard, };
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
                console.log(indicesContainingX);
                return indicesContainingX;
            },
            
            O: function() {
                let indicesContainingO = [];
                board.forEach((element, index) => {
                    if(element === 'O') {
                        indicesContainingO.push(index);
                    }
                });
                console.log(indicesContainingO);
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
                announceWinner(Player1);
                break;
            }
        }            
        let oFilled = filledPlaces.O();
        for (const element of winningCombinations) {
            if (element.every(index => oFilled.includes(index))) {
                announceWinner(Player2);
                break;
            }
        }            
    }

    function announceWinner(winner) {
        console.log(`The Winner is: ${winner.name}`);
    }

    return { choice, };
})();



