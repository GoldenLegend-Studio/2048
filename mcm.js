class MCM {
    constructor(board) {
        this.originalBoard = board;
        this.statistic = [];
    }

    run(iterations) {
        let count = Number(iterations);

        while (count--) {
            this.simulate();
        }
        
        return this.getBestAction();
    }

    simulate() {
        const board = this.originalBoard.clone();
        let actions = board.getActions();
        let path = [];

        while (actions.length) {
            const action = actions[Math.floor(Math.random() * actions.length)];
            path.push(action);
            board.doAction(action);
            actions = board.getActions();
        }

        this.updateStatistic(path[0], board.getResult());
    }

    updateStatistic(action, score) {
        const target = this.statistic.find(item => item.action === action);
        if (!target) {
            this.statistic.push({
                action: action,
                score: score
            });
        } else {
            target.score += score;
        }
    }

    getBestAction() {
        return this.statistic.reduce(
            (best, current) => (current.score > best.score ? current : best)
        ).action;
    }
}

// export default MCM;
