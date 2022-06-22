import React from 'react';
import './Game.css';
import { store } from './Store/store'
import { Provider } from 'react-redux'
import SquareBoard from './Boards/SquareBoard'
import OthelloCounter from './Counters/Counter'
import Constants from './Constants'
import {getValidMoves, validateGameEnd, updateCaptures, hasEmptySpaces, countPlayerCounters} from './Algorithms/Othello'
import {RandomMoveAI, MostCapturesAI} from './Algorithms/OthelloAI'

/** default Players, used during initialisation / game reset */
const defaultPlayers = [{type: Constants.humanPlayer, color: Constants.colorBlack}, {type: Constants.humanPlayer, color: Constants.colorWhite}]
/** index of AI opponent, for quick reference  */
const aiPlayerIndex = 1


/**
 * Controller Component for the Othello Game.
 */
class Game extends React.Component {

    constructor(props) {
        super(props)
        const players = defaultPlayers
        const board = this.createBoard(Constants.boardWidth, players)
        this.state = {
            gameStarted: false,
            players,
            currentPlayer: 0,
            board,
            isFinished: false,
            winner: false,       // note: this is set to false, or to the winning player
            validMoves: []
        }

        /** retrieves the available moves at this time */
        this.getValidMoves = getValidMoves
        /** identifies captures counters and updates the board */
        this.updateCaptures = updateCaptures
        /** identifies if the game has ended */
        this.validateGameEnd = validateGameEnd
        /** object controlling the AI if player 2 is computer. 
         * see @external ./Algorithms/OthelloAI for more info 
         */
        this.OpponentAI = undefined

        this.handleChangeSecondPlayer = this.handleChangeSecondPlayer.bind(this)
    }

    /**
     * creates the board state 
     * @returns {Object[][]} a 2D array representing the initial board state
     */
    createBoard() {
        let spaces = [];
        for (let i = 0; i < Constants.boardSize; i++) {
            const row = []
            for (let j = 0; j < Constants.boardSize; j++) {
                row.push(Constants.emptySpace)
            }
            spaces.push(row)
        }

        spaces[3][3] = defaultPlayers[1]
        spaces[3][4] = defaultPlayers[0]
        spaces[4][3] = defaultPlayers[0]
        spaces[4][4] = defaultPlayers[1]
        return spaces;
    }

    /**
     * Changes the second player to an AI or to a human.
     * @param {Object} e trigger event, contains which player type to change to.
     * 
     * This will also change the OpponentAI member object. If changing to an AI, an AI
     * Controller object will be loaded, otherwise the change is unimportant. 
     * 
     * @external ./Algorithms/OthelloAI for more info about the OpponentAI object
     * @public
     */
    handleChangeSecondPlayer(e) {
        const playerType = e.target.value
        let {players} = this.state
        players[aiPlayerIndex].type = playerType
        this.setState({players})
        switch (playerType) {
            case Constants.aiPlayerRandom:
                this.OpponentAI = RandomMoveAI
                break
            case Constants.aiPlayerMostCaptures:
                this.OpponentAI = MostCapturesAI
                break
            default:
                this.OpponentAI = undefined
        }
    }

    /**
     * updates the active player to the next player.
     * also handle skipping turns if necessary.
     * 
     * At this time, if the next player is an AI, this also triggers the AI to 
     * perform a game move. 
     * @public
     */
    handleNextPlayer() {
        if (!this.state.isFinished) {
            const prevPlayer = this.state.currentPlayer
            const {board} = this.state
            let p = prevPlayer
            p = p === this.state.players.length - 1 ? 0 : p + 1

            // if next player cannot make a move, skip their turn
            let moves = this.getValidMoves(board, this.state.players[p])
            if (moves.length === 0) {
                p = p === this.state.players.length - 1 ? 0 : p + 1
            }

            // not sure if this can happen, thinking it shouldn't
            moves = this.getValidMoves(board, this.state.players[p])
            if (moves.length === 0) {
                console.error("Neither player can make a valid move!")
            }

            this.setState({currentPlayer: p, validMoves: moves})

            // console.log(this.state.currentPlayer, this.getCurrentPlayer(), p)
            if (this.state.players[p].type !== Constants.humanPlayer) {
                // prevents recursion in handleNextPlayer 
                setTimeout(() => {this.handleAIMove()}, 250)
            }
        }
    }


    /** returns the current player object 
     * @public
     */
    getCurrentPlayer() {
        return this.state.players[this.state.currentPlayer]
    }

    /** begins a new game, allowing rendering of the board 
     * @public
     */
    startGame() {
        const {board} = this.state
        this.setState({gameStarted: true})
        const moves = this.getValidMoves(board, this.getCurrentPlayer())
        this.setState({validMoves: moves})
    }

    /** reinitialises the game state and removes the board 
     * @public
     */
    resetGame() {
        const players = defaultPlayers
        const board = this.createBoard(Constants.boardWidth, players)
        this.setState({
            gameStarted: false,
            players,
            currentPlayer: 0,
            board,
            isFinished: false,
            winner: false,       // note: this is set to false, or to the winning player
            validMoves: []
        })
    }

    /** 
     * helper method to handle updating board and end-game state 
     * @public
     */
    updateBoardAndEndGame(x, y) {
        const oldBoard = this.state.board
        oldBoard[y][x] = this.getCurrentPlayer()
        const board = this.updateCaptures(oldBoard, { x, y })
        // winner will be false, or the name of the winning player
        let winner = this.validateGameEnd(board)
        if (!winner && !hasEmptySpaces(board)) {
            const {white, black} = countPlayerCounters(board)
            if (white > black) {
                winner = Constants.colorWhite
            } else if (black > white) {
                winner = Constants.colorBlack
            } else {
                winner = "draw"
            }
        }
        const isFinished = winner ? true : false
        this.setState({ board, isFinished, winner })
    }

    /**
     * Callback method for when a human player performs a game move.
     * 
     * @param {int} x X position of the player move
     * @param {int} y Y position of the player move
     * @public
     */
    handleHumanMove(x, y) {
        if (!this.state.isFinished) {
            this.updateBoardAndEndGame(x, y)
            this.handleNextPlayer()
        }
    }

    /**
     * handles a move by an AI.
     * 
     * expects the OpponentAI member to contain an object implementing the 
     * AI interface.
     * 
     * @external ./Algorithms/OthelloAI for more info about the AI object
     * @public
     */
    handleAIMove() {
        const {board, validMoves} = this.state
        const player = this.getCurrentPlayer()
        // console.log(player, validMoves)
        if (!this.state.isFinished) {
            try {
                const {x, y} = this.OpponentAI.chooseMove(validMoves, board)
                this.updateBoardAndEndGame(x, y)
                this.handleNextPlayer()
            } catch (error) {
                console.error(error)
            }
        }
    }

    render() {
        /**
         * Show a Start screen allowing user to select type of opponent, then start the game
         * During gameplay, show the board in the current state, and the current turn.
         * When the game has ended, show the final board with a message about who won.
         * Alongside the board, show a restart button to return to the start screen.
         */
        const {board, isFinished, winner, gameStarted} = this.state
        const player = this.getCurrentPlayer()
        // console.log(board, isFinished, winner, player)
        let moves = []
        let winnerColor = undefined
        // only render available moves for human players
        if (!isFinished && this.getCurrentPlayer().type === Constants.humanPlayer) {
            moves = this.state.validMoves
        } else {
            for (const p of this.state.players) {
                if (p.name === winner) {
                    winnerColor = p.color
                    break
                }
            }
        }
        const counterShape = Constants.counterRound

        const callback = (x, y) => {
            this.handleHumanMove(x,y);
        }

        const startingLayout = (
            <>
                <h2>Opponent Type</h2>
                <div className="start-controls">
                    <div>
                        <input type="radio" defaultChecked id="input-human" name="opponent-type" value={Constants.humanPlayer} 
                            onChange={this.handleChangeSecondPlayer} />
                        <label htmlFor="input-human">Human</label>
                    </div>
                    <div>
                        <input type="radio" id="input-ai-random" name="opponent-type" value={Constants.aiPlayerRandom}
                            onChange={this.handleChangeSecondPlayer} />
                        <label htmlFor="input-ai-random">AI, Random Moves</label>
                    </div>
                    <div>
                        <input type="radio" id="input-ai-captures" name="opponent-type" value={Constants.aiPlayerMostCaptures} 
                            onChange={this.handleChangeSecondPlayer} />
                        <label htmlFor="input-ai-captures">AI, Highest Captures</label>
                    </div>
                </div>
                <button className="start" onClick={() => this.startGame()}>Start</button>
            </>
        )

        let message = ""
        if (isFinished) {
            if (winner === "draw") {
                message = "Game is a Draw!"
            } else {
                message = (<><OthelloCounter color={winnerColor} shape={counterShape} /><span>Is the Winner! </span></>)
            }
        } 

        const boardLayout = (
            <>
                <div className="message">{isFinished? 
                    message : 
                    <><span>Current Turn: </span><OthelloCounter color={player.color} shape={counterShape} /></>}
                </div>
                <div className="board-container">
                    <SquareBoard board={board} CounterComponent={OthelloCounter} counterShape={counterShape} validMoves={moves} spaceCallback={callback} />
                </div>
                <button className="reset" onClick={() => this.resetGame()}>Reset</button>
            </>
        )

        return gameStarted ? boardLayout : startingLayout
    }
}

export default Game;