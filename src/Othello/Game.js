import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { resetPlayers, changeOpponent, nextPlayer } from './Store/playersSlice'
import { resetBoard, updateBoard } from './Store/boardSlice'
import { resetGame, startGame } from './Store/gameStartedSlice'

import './Game.css'
import SquareBoard from './Boards/SquareBoard'
import OthelloCounter from './Counters/Counter'
import Constants from './Constants'

import { getValidMoves, validateGameEnd, updateCaptures, hasEmptySpaces, countPlayerCounters } from './Algorithms/Othello'
import { RandomMoveAI, MostCapturesAI } from './Algorithms/OthelloAI'


export default function Game() { 

    /**
     * Show a Start screen allowing user to select type of opponent, then start the game
     * During gameplay, show the board in the current state, and the current turn.
     * When the game has ended, show the final board with a message about who won.
     * Alongside the board, show a restart button to return to the start screen.
     */

    const dispatch = useDispatch()
    let board = useSelector((state) => state.board.value)
    const { players, activePlayerIndex } = useSelector(state => state.playerData.value)
    const gameStarted = useSelector(state => state.gameStarted.value)

    const counterShape = Constants.counterRound
    const currentPlayer = players[activePlayerIndex]
    let winner = validateGameEnd(board)
    let moves = getValidMoves(board, currentPlayer)
    if (moves.length === 0) {
        console.log("Skipping turn: ", currentPlayer)
        dispatch(nextPlayer())
    }
    let message = ""
    let shownMoves = []
    // separate winning player object from color of winning player, while keeping behaviour consistent
    let winnerColor = false
    if (winner) {
        winnerColor = winner.color
    } else if (!hasEmptySpaces(board)) {
        const counts = countPlayerCounters(board)
        const colors = Object.keys(counts)            // expected keys is always length of 2
        if (colors[0] === colors[1]) {
            winnerColor = "draw"
        } else {
            winnerColor = counts[colors[0]] > counts[colors[1]] ? colors[0] : colors[1]
        }
    }

    const performMove = (x, y) => {
        if (currentPlayer.type === Constants.humanPlayer) {
            console.log("human turn, move=", x, y)
        }
        const loc = {x, y}
        // console.log(board, currentPlayer, loc)
        dispatch(updateBoard({x, y, item: currentPlayer}))
        for (const c of updateCaptures(board, currentPlayer, loc)) {
            dispatch(updateBoard({x:c.x, y:c.y, item: currentPlayer}))
        }
        dispatch(nextPlayer())
    }

    const reset = () => {
        dispatch(resetPlayers())
        dispatch(resetBoard())
        dispatch(resetGame())
    }

    const changeAiOpponent = (e) => {
        const opponentType = e.target.value
        dispatch(changeOpponent({opponentType}))
    }
    
    const beginGame = () => {
        dispatch(startGame())
    }

    if (winnerColor) {
        if (winnerColor === "draw") {
            message = "Game is a Draw!"
        } else {
            message = (<><OthelloCounter color={winnerColor} shape={counterShape} /><span>Is the Winner! </span></>)
        }
    } else if (currentPlayer.type === Constants.humanPlayer) {
        shownMoves = moves
    } 

    // prevents conflicts with state updates and renders. delays AI move until after (re)rendering
    useEffect(() => {
        const winner = validateGameEnd(board)
        if (!winner) {
            if (currentPlayer.type !== Constants.humanPlayer) {
                let opponentAI
                switch (currentPlayer.type) {
                    case Constants.aiPlayerRandom:
                        opponentAI = RandomMoveAI
                        break
                    case Constants.aiPlayerMostCaptures:
                        opponentAI = MostCapturesAI
                        break
                    default:
                        opponentAI = undefined
                }

                const {x, y} = opponentAI.chooseMove(moves, board)

                console.log("conputer turn, move=", x, y)
                setTimeout(() => performMove(x, y), 250)
            }
        }
    })


    const startingLayout = (
        <>
            <h2>Opponent Type</h2>
            <div className="start-controls">
                <div>
                    <input type="radio" defaultChecked id="input-human" name="opponent-type" value={Constants.humanPlayer} 
                        onChange={changeAiOpponent} />
                    <label htmlFor="input-human">Human</label>
                </div>
                <div>
                    <input type="radio" id="input-ai-random" name="opponent-type" value={Constants.aiPlayerRandom}
                        onChange={changeAiOpponent} />
                    <label htmlFor="input-ai-random">AI, Random Moves</label>
                </div>
                <div>
                    <input type="radio" id="input-ai-captures" name="opponent-type" value={Constants.aiPlayerMostCaptures} 
                        onChange={changeAiOpponent} />
                    <label htmlFor="input-ai-captures">AI, Highest Captures</label>
                </div>
            </div>
            <button className="start" onClick={beginGame}>Start</button>
        </>
    )

    const boardLayout = (
        <>
            <div className="message">{winner? 
                message : 
                <><span>Current Turn: </span><OthelloCounter color={currentPlayer.color} shape={counterShape} /></>}
            </div>
            <div className="board-container">
                <SquareBoard board={board} CounterComponent={OthelloCounter} counterShape={counterShape} validMoves={shownMoves} spaceCallback={performMove} />
            </div>
            <button className="reset" onClick={reset}>Reset</button>
        </>
    )

    // console.log("rendering...")

    return (gameStarted ? boardLayout : startingLayout)
}