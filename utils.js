// Utility functions for the 2048 game

function createEmptyBoard(size) {
    return Array.from({ length: size }, () => Array(size).fill(0));
}

function cloneBoard(board) {
    return board.map(row => row.slice());
}

function calculateScore(tiles) {
    return tiles.flat().reduce((sum, value) => sum + value, 0);
}

// export { createEmptyBoard, cloneBoard, calculateScore };
