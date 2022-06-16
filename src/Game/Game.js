import React from 'react';
import './Game.css';
import SquareBoard from './SquareBoard';
import Counter from './Counter'
import Constants from './Constants';
import {getValidMoves, validateGameEnd, updateCaptures} from './Othello';

class Game extends React.Component {

    static getValidMoves;
    static updateCaptures;
    static validateGameEnd;

    constructor(props) {
        super(props)
        const players = [{name: "Human_A", color:"black"}, {name: "Human_B", color:"white"}]
        const board = this.createBoard(Constants.boardWidth, Constants.boardHeight, players)
        this.state = {
            players,
            currentPlayer: 0,
            board,
            isFinished: false,
            winner: false
        };

        this.getValidMoves = getValidMoves;
        this.updateCaptures = updateCaptures;
        this.validateGameEnd = validateGameEnd;
    }

    createBoard(width, height, players) {
        let spaces = [];
        for (let i = 0; i < height; i++) {
            const row = [];
            for (let j = 0; j < width; j++) {
                row.push(Constants.emptySpace);
            }
            spaces.push(row);
        }

        spaces[3][3] = players[1];
        spaces[3][4] = players[0];
        spaces[4][3] = players[0];
        spaces[4][4] = players[1];
        return spaces;
    }

    setNextPlayer() {
        let p = this.state.currentPlayer;
        p = p === this.state.players.length - 1 ? 0 : p + 1;
        this.setState({currentPlayer: p});
    }

    getCurrentPlayer() {
        return this.state.players[this.state.currentPlayer];
    }

    resetGame() {
        const players = [{name: "Human_A", color:"black"}, {name: "Human_B", color:"white"}]
        const board = this.createBoard(Constants.boardWidth, Constants.boardHeight, players)
        this.setState({
            players,
            currentPlayer: 0,
            board,
            isFinished: false,
            winner: false
        })
    }

    doMove(x, y) {
        if (!this.state.isFinished) {
            const oldBoard = this.state.board;
            oldBoard[y][x] = this.getCurrentPlayer();
            const board = this.updateCaptures(oldBoard, {x, y});
            // winner will be false, or the name of the winning player
            const winner = this.validateGameEnd(board);
            const isFinished = !winner ? false : true
            this.setState({board, isFinished, winner});
            if (!isFinished) {
                this.setNextPlayer();
            }
        }
    }

    render() {
        const {board, isFinished, winner} = this.state
        // console.log(isFinished, winner)
        const player = this.getCurrentPlayer()
        let moves = []
        let winnerColor = undefined
        if (!isFinished) {
            moves = this.getValidMoves(board, player);
        } else {
            for (const p of this.state.players) {
                console.log(p, winner)
                if (p.name === winner) {
                    winnerColor = p.color
                    break
                }
            }
        }

        const counterType = Constants.counterRound
        let counterShape = "square";
        if (counterType === Constants.counterRound) {
            counterShape = "round";
        }

        const callback = (x, y) => {
            this.doMove(x,y);
        };
        return (
            <>
                <div className="message">{isFinished? 
                    <><Counter color={winnerColor} shape={counterShape} /><span>Is the Winner! </span></> : 
                    <><span>Current Turn: </span><Counter color={player.color} shape={counterShape} /></>}
                </div>
                <div className="board-container">
                    <SquareBoard board={board} counterType={counterType} validMoves={moves} spaceCallback={callback} />
                </div>
                <button className="reset" onClick={() => this.resetGame()}>Restart</button>
            </>
        );
    }
}

export default Game;