import React from 'react'
import PropTypes from 'prop-types'

import { useSelector, useDispatch } from 'react-redux'
import { RESET as RESET_PLAYERS, CHANGE_OPPONENT, NEXT } from './Store/playersSlice'
import { RESET as RESET_BOARD, UPDATE as UPDATE_BOARD } from './Store/boardSlice'
import { RESET as RESET_ENDGAME, FINISH } from './Store/isFinishedSlice'
import { UPDATE as UPDATE_MOVES } from './Store/validMovesSlice'


import './GameStateless.css'
import SquareBoard from './Boards/SquareBoard'
import OthelloCounter from './Counters/Counter'
import Constants from './Constants'

import { getValidMoves, validateGameEnd, updateCaptures, hasEmptySpaces, countPlayerCounters } from './Algorithms/Othello'
import { RandomMoveAI, MostCapturesAI } from './Algorithms/OthelloAI'

/** default Players, used during initialisation / game reset */
const defaultPlayers = [{ type: Constants.humanPlayer, color: Constants.colorBlack }, { type: Constants.humanPlayer, color: Constants.colorWhite }]
/** index of AI opponent, for quick reference  */
const aiPlayerIndex = 1

export default function GameStateless() { 

    /**
     * Show a Start screen allowing user to select type of opponent, then start the game
     * During gameplay, show the board in the current state, and the current turn.
     * When the game has ended, show the final board with a message about who won.
     * Alongside the board, show a restart button to return to the start screen.
     */

    const counterShape = Constants.counterRound
    const board = useSelector((state) => state.board.value)
    const { players, activePlayerIndex } = useSelector(state => state.playerData.value)
    const isFinished = useSelector(state => state.isFinished.value)
    let moves = useSelector(state => state.validMoves.value)
    let winner = ""
    const gameStarted = false
    let message = ""

    const currentPlayer = players[activePlayerIndex]

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

    let shownMoves = []
    if (!isFinished && currentPlayer.type === Constants.humanPlayer) {
        shownMoves = moves
    }
    
    
    // only render available moves for human players
    if (isFinished) {
        if (winner === "draw") {
            message = "Game is a Draw!"
        } else {
            let winnerColor = undefined
            for (const p of players) {
                if (p.name === winner) {
                    winnerColor = p.color
                    break
                }
            }
            message = (<><OthelloCounter color={winnerColor} shape={counterShape} /><span>Is the Winner! </span></>)
        }
    } 

    const spaceCallback = (x, y) => {}
    const resetCallback = () => {
        // dispatch - RESET_PLAYERS to players
        // dispatch - RESET_BOARD to board
        // dispatch - RESET_ENDGAME to isFinished   --- do we need this???
        // dispatch - RESET_WINNER to winner
    }
    const changeOpponentCallback = (e) => {}
    const startGame = () => {
        moves = getValidMoves(board, currentPlayer)
        // dispatch - UPDATE_MOVES with {payload: moves} to validMoves
        // dispatch - START_GAME to gameStarted
    }
    

    console.log(board, players, activePlayerIndex, moves, gameStarted, isFinished, winner)

    const startingLayout = (
        <>
            <h2>Opponent Type</h2>
            <div className="start-controls">
                <div>
                    <input type="radio" defaultChecked id="input-human" name="opponent-type" value={Constants.humanPlayer} 
                        onChange={changeOpponentCallback} />
                    <label htmlFor="input-human">Human</label>
                </div>
                <div>
                    <input type="radio" id="input-ai-random" name="opponent-type" value={Constants.aiPlayerRandom}
                        onChange={changeOpponentCallback} />
                    <label htmlFor="input-ai-random">AI, Random Moves</label>
                </div>
                <div>
                    <input type="radio" id="input-ai-captures" name="opponent-type" value={Constants.aiPlayerMostCaptures} 
                        onChange={changeOpponentCallback} />
                    <label htmlFor="input-ai-captures">AI, Highest Captures</label>
                </div>
            </div>
            <button className="start" onClick={startGame}>Start</button>
        </>
    )

    const boardLayout = (
        <>
            <div className="message">{isFinished? 
                message : 
                <><span>Current Turn: </span><OthelloCounter color={currentPlayer.color} shape={counterShape} /></>}
            </div>
            <div className="board-container">
                <SquareBoard board={board} CounterComponent={OthelloCounter} counterShape={counterShape} validMoves={shownMoves} spaceCallback={spaceCallback} />
            </div>
            <button className="reset" onClick={resetCallback}>Reset</button>
        </>
    )

    return (gameStarted ? boardLayout : startingLayout)
}