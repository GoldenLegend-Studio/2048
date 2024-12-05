// import Board from './gameLogic.js';
// import GameUI from './uiHandler.js';
// import { createEmptyBoard, cloneBoard, calculateScore } from './utils.js';
// import MCM from './mcm.js';

class Game2048 {
    constructor() {
        this.board = new Board(4);
        this.ui = new GameUI(document.getElementById('grid'), document.getElementById('score'));
        this.score = 0;
        this.previousStates = [];
        this.aiInterval = null;
        this.ui.initBoard(this.board.size);
        this.addEventListeners();
        this.setupEventListeners();
        this.board.addNewTile();
        this.board.addNewTile();
        this.ui.updateBoardView(this.board.tiles);
    }

    saveState() {
        this.previousStates.push({
            tiles: cloneBoard(this.board.tiles),
            score: this.score
        });
    }

    undo() {
        if (this.previousStates.length > 0) {
            const lastState = this.previousStates.pop();
            this.board.tiles = lastState.tiles;
            this.score = lastState.score;
            this.ui.updateBoardView(this.board.tiles);
            this.ui.updateScore(this.score);
        }
    }

    highlightNewTile(x, y) {
        if (x !== null && y !== null) {
            const tileElements = document.getElementById('grid').children;
            const index = x * this.board.size + y;
            const tile = tileElements[index];
            tile.classList.add('new-tile');
        }
    }

    move(direction) {
        this.saveState();
        let { x, y } = this.board.doAction(direction);
        this.ui.updateBoardView(this.board.tiles);
        this.highlightNewTile(x, y);
        this.checkGameStatus();
        this.score = calculateScore(this.board.tiles);
        this.ui.updateScore(this.score);
    }

    checkGameStatus() {
        const status = this.board.checkGameStatus();
        if (status === 'won') {
            this.showSuccessModal();
            this.pauseAI();
        } else if (status === 'over') {
            this.showGameOverModal();
            this.pauseAI();
        }
    }

    resetGame() {
        this.board = new Board(4);
        this.score = 0;
        this.ui.updateScore(this.score);
        this.board.addNewTile();
        this.board.addNewTile();
        this.ui.updateBoardView(this.board.tiles);
        this.previousStates = [];
    }

    aiControl() {
        this.aiInterval = setInterval(() => {
            let bestAction = new MCM(this.board).run(400);
            this.move(bestAction);
        }, 200);
    }

    pauseAI() {
        clearInterval(this.aiInterval);
        this.aiInterval = null;
    }

    addEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                this.move(e.key);
            }
        });

        const resetButtonMain = document.getElementById('reset-button-main');
        resetButtonMain.onclick = () => {
            this.resetGame();
        };

        // Touch support for mobile
        let touchStartX = 0;
        let touchStartY = 0;

        this.ui.boardElement.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        this.ui.boardElement.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;

            if (Math.abs(diffX) > Math.abs(diffY)) {
                // Horizontal swipe
                this.move(diffX > 0 ? 'ArrowRight' : 'ArrowLeft');
            } else {
                // Vertical swipe
                this.move(diffY > 0 ? 'ArrowDown' : 'ArrowUp');
            }
        });

        this.ui.boardElement.addEventListener('mousedown', (e) => {
            touchStartX = e.clientX;
            touchStartY = e.clientY;
        });

        this.ui.boardElement.addEventListener('mouseup', (e) => {
            const touchEndX = e.clientX;
            const touchEndY = e.clientY;

            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;

            if (Math.abs(diffX) > Math.abs(diffY)) {
                // Horizontal swipe
                this.move(diffX > 0 ? 'ArrowRight' : 'ArrowLeft');
            } else {
                // Vertical swipe
                this.move(diffY > 0 ? 'ArrowDown' : 'ArrowUp');
            }
        });
    }

    setupEventListeners() {
        const undoButton = document.getElementById('undo-button');
        undoButton.addEventListener('click', () => this.undo());

        const aiControlButton = document.getElementById('ai-control-button');
        aiControlButton.addEventListener('click', () => this.aiControl());

        const pauseAIButton = document.getElementById('pause-ai-button');
        pauseAIButton.addEventListener('click', () => this.pauseAI());
    }

    showSuccessModal() {
        const modal = document.getElementById('success-modal');
        modal.classList.add('show');

        const closeModal = document.getElementById('close-success-modal');
        const resetButton = document.getElementById('reset-success-button');

        closeModal.onclick = () => {
            modal.classList.remove('show');
        };

        resetButton.onclick = () => {
            modal.classList.remove('show');
            this.resetGame();
        };
    }

    showGameOverModal() {
        const modal = document.getElementById('game-over-modal');
        const finalScore = document.getElementById('final-score');
        finalScore.textContent = this.score;
        modal.classList.add('show');

        const closeModal = document.getElementById('close-modal');
        const resetButton = document.getElementById('reset-button');

        closeModal.onclick = () => {
            modal.classList.remove('show');
        };

        resetButton.onclick = () => {
            modal.classList.remove('show');
            this.resetGame();
        };
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Game2048();
});
