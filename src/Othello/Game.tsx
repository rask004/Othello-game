import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { resetPlayers, changeOpponent, nextPlayer } from './Store/playersSlice'
import { resetBoard, updateBoard } from './Store/boardSlice'
import { resetGame, startGame } from './Store/gameStartedSlice'
import { clear as clearMessages, addMessage } from './Store/statusMessagesSlice'

import './Game.css'
import SquareBoard from './Boards/SquareBoard'
import OthelloCounter from './Counters/ImageCounter'
import Constants, {Position, SequenceItem, AIObject, Player} from './Constants'
import { MultiMessagePanel } from './Status/StatusPanel'

import { getValidMoves, validateGameEnd, updateCaptures, hasEmptySpaces, countPlayerCounters } from './Algorithms/Othello'
import { RandomMoveAI, MostCapturesAI } from './Algorithms/OthelloAI'


/**
 * Show a Start screen allowing user to select type of opponent, then start the game
 * During gameplay, show the board in the current state, and the current turn.
 * When the game has ended, show the final board with a message about who won.
 * Alongside the board, show a restart button to return to the start screen.
 */
export default function Game() { 

    const dispatch = useDispatch()
    let board:Array<Array<Player>> = useSelector<any, any>(state => state.board.value)
    const { players, activePlayerIndex } = useSelector<any, any>(state => state.playerData.value)
    const gameStarted = useSelector<any, any>(state => state.gameStarted.value)

    const [newCounter, setNewCounter] = useState<SequenceItem|null>()
    const [captures, setCaptures] = useState<SequenceItem[]>([])

    const counterShape = Constants.counterRound
    const currentPlayer = players[activePlayerIndex]
    let winner = validateGameEnd(board)
    let moves = getValidMoves(board, currentPlayer)
    // console.log("Game Stats: player=", currentPlayer, "; moves=", moves, "; gameStarted=", gameStarted, "; gameEndState=", winner)
    if (moves.length === 0 && gameStarted) {
        // console.log("Skipping turn: ", currentPlayer)
        dispatch(nextPlayer())
        dispatch(addMessage(`Skip Turn for player ${currentPlayer.color}`))
    }
    let message = ""
    let shownMoves:Position[] = []
    // separate winning player object from color of winning player, while keeping behaviour consistent
    let winnerColor:boolean|string = false
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

    const performMove = (x:number, y:number) => {
        const loc = {x, y}
        let capturedCounters = []
        const prevPlayerIndex = activePlayerIndex !== Constants.aiPlayerIndex ? Constants.aiPlayerIndex : 0
        const prevPlayer = players[prevPlayerIndex]
        dispatch(updateBoard({x, y, item: currentPlayer}))
        dispatch(addMessage(`Player ${currentPlayer.color} placed counter at ${x}, ${y}`))
        setNewCounter({x, y, item: currentPlayer})
        // TODO fix captures
        for (const c of updateCaptures(board, currentPlayer, loc)) {
            console.log(`Captured: ${c.x}, ${c.y}`)
            dispatch(updateBoard({x:c.x, y:c.y, item: currentPlayer}))
            capturedCounters.push({x:c.x, y:c.y, item: prevPlayer})
        }
        setCaptures(capturedCounters)
        dispatch(addMessage(`Player ${currentPlayer.color} captured ${capturedCounters.length} ${capturedCounters.length === 1 ? 'counter' : 'counters'}`))
        dispatch(nextPlayer())
    }

    const reset = () => {
        dispatch(resetPlayers())
        dispatch(resetBoard())
        dispatch(resetGame())
    }

    const changeAiOpponent = (e:any) => {
        if (e.target != null) {
            const opponentType = e.target.value
            dispatch(changeOpponent({opponentType}))
        }
    }
    
    const beginGame = () => {
        dispatch(startGame())
        setNewCounter(null)
        dispatch(clearMessages())
    }

    const getSrc = (c:string) => {
        return `./Assets/counter-${c}-grain.jpg`
    }

    if (winnerColor) {
        if (winnerColor === "draw") {
            message = "Game is a Draw!"
        } else {

            message = `Player ${winnerColor} Is the Winner!`
        }
    } else if (currentPlayer.type === Constants.humanPlayer) {
        shownMoves = moves
        message = `Current Turn: ${currentPlayer.color}`
    }

    // prevents conflicts with state updates and renders during gameplay. delays AI move until after (re)rendering
    useEffect(() => {
        dispatch(addMessage(message))
        if (gameStarted) {
            const boardElement:any = document.querySelector('div.board')

            boardElement!.style.maxWidth = '800px'

            const statusElement = document.querySelector('.message')
            const statusCounters:any = statusElement!.querySelectorAll('.counter')
            // console.log(statusCounters)
            for (const c of statusCounters) {
                c.style.maxWidth = '1.5em'
                c.style.maxHeight = '1.5em'
            }

            const winner = validateGameEnd(board)
            let counterElement:any
            // use newCounter, captures to change respective counter styles
            // if there is a new counter, there must be captures
            if (newCounter != null) {
                const newCounterSpaceId = `#board-space-${newCounter.x}-${newCounter.y}`
                const ele = document.querySelector(newCounterSpaceId)
                if (ele != null) {
                    counterElement = ele.children[0]
                    counterElement.classList.add("counter-new")
                }
                

                for (const {x, y} of captures) {
                    const capturedCounterspaceId = `#board-space-${x}-${y}`
                    const ele = document.querySelector(capturedCounterspaceId)
                    if (ele != null) {
                        counterElement = ele.children[0]
                        counterElement.classList.add("counter-new")
                    }
                }
            }

            if (!winner) {
                if (currentPlayer.type !== Constants.humanPlayer) {
                    let opponentAI:AIObject
                    switch (currentPlayer.type) {
                        case Constants.aiPlayerMostCaptures:
                            opponentAI = MostCapturesAI
                            break
                        default:
                            opponentAI = RandomMoveAI
                    }

                    const {x, y} = opponentAI?.chooseMove(moves, board)
                    setTimeout(() => performMove(x, y), 250)
                }
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
            <div className='container'>
                <div className="board-container">
                    <SquareBoard CounterComponent={OthelloCounter} counterShape={counterShape} validMoves={shownMoves} spaceCallback={performMove} counterGetSrcFunc={getSrc}/>
                </div>
                <div className="message-container">
                    <MultiMessagePanel />
                </div>
            </div>
            <button className="reset" onClick={reset}>Reset</button>
        </>
        
    )

    return (gameStarted ? boardLayout : startingLayout)

    // return (startingLayout)
}