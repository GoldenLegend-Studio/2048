// UI handling for the 2048 game

class GameUI {
    constructor(boardElement, scoreElement) {
        this.boardElement = boardElement;
        this.scoreElement = scoreElement;
    }

    initBoard(size) {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cell = document.createElement('div');
                cell.classList.add('tile');
                cell.style.gridColumnStart = j + 1;
                cell.style.gridRowStart = i + 1;
                this.boardElement.appendChild(cell);
            }
        }
    }

    updateBoardView(tiles) {
        const tileElements = this.boardElement.children;
        for (let i = 0; i < tiles.length; i++) {
            for (let j = 0; j < tiles[i].length; j++) {
                const index = i * tiles.length + j;
                const tile = tileElements[index];
                const value = tiles[i][j];
                tile.textContent = value || '';
                tile.className = 'tile';
                if (value) {
                    tile.classList.add(`tile-${value}`);
                }
            }
        }
    }

    updateScore(score) {
        this.scoreElement.textContent = score;
    }
}

// export default GameUI;
