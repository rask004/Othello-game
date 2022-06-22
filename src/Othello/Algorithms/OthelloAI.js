import Constants from '../Constants'
import {getSequencesByLocation} from './Othello'

/* 
    All AI objects must have this Interface: 
        AiObject.chooseMove( possibleMoves: {x, y}[], board: object[][] )
            ->  returns:  move: {x, y}
    
        returned {x, y} must come from within {x, y}[]].
*/



const RandomMoveAI = {
    /**
     * An AI Object which randomly chooses moves.
     * @param {{x:number, y:number}[]} possibleMoves collection of moves to choose from
     * @param {object[][]} board the othello board the moves are from
     * @returns {{x:number, y:number}} a move, randomly chosen from parameter possibleMoves
     */
    chooseMove: (possibleMoves, board) => {
        const index = Math.floor(Math.random() * possibleMoves.length)
        const move = possibleMoves[index]
        return move
    }
}

const MostCapturesAI = {
    /**
     * An AI Object which randomly chooses moves.
     * @param {{x:number, y:number}[]} possibleMoves collection of moves to choose from
     * @param {object[][]} board the othello board the moves are from
     * @returns {{x:number, y:number}} a move, randomly chosen from parameter possibleMoves
     */
    chooseMove: (possibleMoves, board) => {
        /** @var {{x:number, y:number, rank:number}[]} bestMoves */
        let rankedMoves = []
        /** the highest ranked move discovered */
        let maxRank = 0
        const captureColor = Constants.colorBlack
        for (const move of possibleMoves) {
            let rank = 0
            for (const sequence of getSequencesByLocation(board, move)) {
                let moveIndex
                for (let i = 0; i < sequence.length; i++) {
                    if (move.x===sequence[i].x && move.y===sequence[i].y) {
                        moveIndex = i
                        break
                    }
                }
                
                let c = 0
                let p = moveIndex - 1
                for (let i = p; i >= 0; i--) {
                    // console.log(">>     ", rank, sequence[i], sequence[i].item === Constants.emptySpace || sequence[i].item.color !== captureColor)
                    if (sequence[i].item === Constants.emptySpace) {
                        break
                    } else if (sequence[i].item.color === captureColor) {
                        c++
                    } else {
                        rank += c
                        break
                    }
                }

                c = 0
                let n = moveIndex + 1
                for (let i = n; i < sequence.length; i++) {
                    // console.log(">>     ", rank, sequence[i], sequence[i].item === Constants.emptySpace || sequence[i].item.color !== captureColor)
                    if (sequence[i].item === Constants.emptySpace) {
                        break
                    } else if (sequence[i].item.color === captureColor) {
                        c++
                    } else {
                        rank += c
                        break
                    }
                }
            }

            rankedMoves.push({move, rank})
            if (rank > maxRank) {
                maxRank = rank
            }
        }

        // console.log(maxRank, rankedMoves)

        const bestMoves = rankedMoves.filter(x => x.rank===maxRank)

        console.log("best moves: ", bestMoves)

        let move
        if (bestMoves.length === 1) {
            move = bestMoves[0].move
        } else {
            /** if multiple best moves, randomly choose one */
            const i = Math.floor(Math.random() * bestMoves.length)
            // console.log(i, bestMoves.length)
            move = bestMoves[i].move
        }

        console.log("chosen move: ", move)
        
        return move
    }
}

export {RandomMoveAI, MostCapturesAI}