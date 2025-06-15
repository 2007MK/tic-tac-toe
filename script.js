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

    return {updateBoard, markers, getBoard, };
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
            if (turn % 2 == 1) {
                return `${Player1.marker}`;
            } else {
                return `${Player2.marker}`;
            }        
    }
    

    function choice(place) {
        let board = Gameboard.getBoard();
        if (!(Gameboard.markers.includes(board[place - 1])) && (place <= 9)) {            
            if(turn <= 9) {
                let marker = turnSwitcher();
                Gameboard.updateBoard((place - 1), marker);
                turn++;
            } else {
                console.log("hold on");
            }            
        } else {
            console.log("That place is already occupied");
            
        }
    };

    return { choice, };
})();



