// Game logic related to the 2048 game

// Board class handles the core logic of the 2048 game
// It manages the tiles, performs actions, and checks game status

class Board {
    constructor(size, tiles = null) {
        this.size = size; // Size of the board (e.g., 4 for a 4x4 grid)
        this.tiles = tiles || this.createEmptyBoard(); // Initialize tiles
        this.startScore = this.score(); // Initial score
    }

    createEmptyBoard() {
        // Create an empty board filled with zeros
        return Array.from({ length: this.size }, () => Array(this.size).fill(0));
    }

    clone() {
        // Create a deep copy of the board
        return new Board(this.size, this.tiles.map(row => row.slice()));
    }

    getActions() {
        // Return possible actions based on the current board state
        if (this.hasLost() || this.hasWon()) {
            return [];
        }
        return ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    }

    doAction(action) {
        // Perform the specified action on the board
        let originalTiles = this.tiles.map(row => [...row]);
        switch(action) {
            case 'ArrowLeft':
                for (let i = 0; i < this.size; i++) {
                    this.tiles[i] = this.slide(this.tiles[i]);
                }
                break;
            case 'ArrowRight':
                for (let i = 0; i < this.size; i++) {
                    this.tiles[i] = this.slide(this.tiles[i].reverse()).reverse();
                }
                break;
            case 'ArrowUp':
                for (let i = 0; i < this.size; i++) {
                    const column = this.tiles.map(row => row[i]);
                    const newColumn = this.slide(column);
                    for (let j = 0; j < this.size; j++) {
                        this.tiles[j][i] = newColumn[j];
                    }
                }
                break;
            case 'ArrowDown':
                for (let i = 0; i < this.size; i++) {
                    const column = this.tiles.map(row => row[i]).reverse();
                    const newColumn = this.slide(column).reverse();
                    for (let j = 0; j < this.size; j++) {
                        this.tiles[j][i] = newColumn[j];
                    }
                }
                break;
        }
        if (this.tiles.toString() !== originalTiles.toString()) {
            return this.addNewTile();
        }
        return { x: null, y: null };
    }

    slide(row) {
        // Slide and merge a row to the left
        const filteredRow = row.filter(val => val !== 0); // Remove zeros
        for (let i = 0; i < filteredRow.length - 1; i++) {
            if (filteredRow[i] === filteredRow[i + 1]) {
                filteredRow[i] *= 2; // Merge tiles
                filteredRow.splice(i + 1, 1);
            }
        }
        while (filteredRow.length < this.size) {
            filteredRow.push(0); // Pad with zeros
        }
        return filteredRow;
    }

    score() {
        // Calculate the total score of the board
        return this.tiles.flat().reduce((sum, value) => sum + value, 0);
    }

    getResult() {
        // Calculate the result score
        return this.score() - this.startScore;
    }

    addNewTile() {
        // Add a new tile (2 or 4) to a random empty position
        const emptyCells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.tiles[i][j] === 0) {
                    emptyCells.push({x: i, y: j});
                }
            }
        }
        if (emptyCells.length > 0) {
            const {x, y} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const value = Math.random() < 0.9 ? 2 : 4;
            this.tiles[x][y] = value;
            return {x, y};
        }
        return {x: null, y: null};
    }

    hasWon() {
        // Check if any tile has reached 2048
        return this.tiles.flat().includes(2048);
    }

    hasLost() {
        // Check if there are no empty tiles and no possible merges
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.tiles[i][j] === 0) {
                    return false;
                }
                if (
                    (i > 0 && this.tiles[i][j] === this.tiles[i-1][j]) ||
                    (i < this.size-1 && this.tiles[i][j] === this.tiles[i+1][j]) ||
                    (j > 0 && this.tiles[i][j] === this.tiles[i][j-1]) ||
                    (j < this.size-1 && this.tiles[i][j] === this.tiles[i][j+1])
                ) {
                    return false;
                }
            }
        }
        return true;
    }

    checkGameStatus() {
        // Determine the current game status: won, over, or ongoing
        if (this.hasWon()) {
            return 'won';
        } else if (this.hasLost()) {
            return 'over';
        } else {
            return 'ongoing';
        }
    }
}

// export default Board;