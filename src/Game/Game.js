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
        const players = [{name: "Human_A", color:"black"}, {name: "Human_B", color:"white"}];
        const board = this._createBoard(props.boardWidth, props.boardHeight, players);
        this.state = {
            players,
            currentPlayer: 0,
            board,
            isFinished: false
        };

        this.getValidMoves = getValidMoves;
        this.updateCaptures = updateCaptures;
        this.validateGameEnd = validateGameEnd;
    }

    _createBoard(width, height, players) {
        const spaces = [];
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

    doMove(x, y) {
        if (!this.state.isFinished) {
            const oldBoard = this.state.board;
            oldBoard[y][x] = this.getCurrentPlayer();
            const board = this.updateCaptures(oldBoard, {x, y});
            const isFinished = this.validateGameEnd(board);
            this.setState({board, isFinished});
            if (!isFinished) {
                this.setNextPlayer();
            }
        }
    }

    render() {
        const {board, isFinished} = this.state
        const player = this.getCurrentPlayer()
        let moves = []
        let message = ""
        if (!isFinished) {
            moves = this.getValidMoves(board, player);
        } else {
            message = "game has finished"
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
            <div className="board-container">
                <p className="message">{isFinished? message : <><span>Current Player: </span><Counter color={player.color} shape={counterShape} /></>}</p>
                <SquareBoard board={board} counterType={counterType} validMoves={moves} spaceCallback={callback} />
            </div>
        );
    }
}

export default Game;