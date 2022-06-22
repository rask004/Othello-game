import Constants from '../Constants'

/**
 * convert all rows, columns and diagonals into a sequence of sequences.
 * 
 * @param {object[][]} board the 2D board to work from
 * @public
*/
export const decomposeToSequences = function *(board) {
    const h = board.length
    const w = board[0].length
    // rows
    for (let y in board) {
        yield board[y].map( (item, x) => {
            // guarantee x and y are numbers - because sometimes strings are being created
            return {x:parseInt(x), y:parseInt(y), item}
        })
    }
    // columns
    for (let x in board[0]) {
        const col = board.map((row) => {
            return row[x]
        })
        yield col.map( (item, y) => {
            return {x:parseInt(x), y:parseInt(y), item}
        })
    }
    // backward diagonals (\)
    for (let c = w - 1; c >= 0; c--) {
        let diag = []
        let y = 0
        for (let x = c; x < w; x++) {
            diag.push({x:parseInt(x), y:parseInt(y), item:board[y][x]})
            y++
        }
        yield diag
    }
    for (let c = 1; c < h; c++) {
        let diag = []
        let x = 0
        for (let y = c; y < h; y++) {
            diag.push({x:parseInt(x), y:parseInt(y), item:board[y][x]})
            x++
        }
        yield diag
    }
    // forward diagonals (/)
    for(let c = 0; c < w; c++) {
        let diag = []
        let y = 0
        for (let x = c; x >= 0; x--) {
            diag.push({x:parseInt(x), y:parseInt(y), item:board[y][x]})
            y++
        }
        yield diag
    }
    for(let c = 1; c < h; c++) {
        let diag = []
        let x = w - 1
        for (let y = c; y < h; y++) {
            diag.push({x:parseInt(x), y:parseInt(y), item:board[y][x]})
            x--
        }
        yield diag
    }
}

/**
 * yield only sequences containing a given position
 * 
 * @param {object[][]} board the 2D board to work from
 * @param {{x:number, y:number}} loc the given position
 * @public
*/
export const getSequencesByLocation = function *(board, loc) {
    const {x, y} = loc
    for (const s of decomposeToSequences(board)) {
        for (const position of s) {
            if(x === position.x && y === position.y) {
                yield s
            }
        }
    }
}

/**
 * yield only sequences containing counters of a given player
 * 
 * @param {object[][]} board the 2D board to work from
 * @param {object} player the given player
 * @public
*/
export const getSequencesByPlayer = function *(board, player) {
    const {color} = player
    for (const s of decomposeToSequences(board)) {
        for (const position of s) {
            // console.log("checking for sequences by player: ", position)
            if(position.item !== Constants.emptySpace && position.item.color === color) {
                const {x, y} = position
                yield {locX:x, locY:y, sequence:s}
            }
        }
    }
}

/**
 * filter to yield only sequences containing empty spaces
 * 
 * @param {[{x:number, y:number, item: object}]} sequences the sequences to filter
 * @public
*/
export const filterSequencesWithEmptySpaces = function *(sequences) {
    for(const s of sequences) {
        let seq;
        // check for {x,y,s} object
        if (s.hasOwnProperty('sequence')) {
            seq = s.sequence
        } else {
            seq = s
        }
        for (const position of seq) {
            if (position.item === Constants.emptySpace) {
                yield s
                break
            }
        }
    }
}

/**
 * filter to yield only sequences of a minimum length
 * 
 * @param {[{x:number, y:number, item: object}]} sequences the sequences to filter
 * @param {number} minLength the minimum length for a sequence
 * @public
*/
export const filterSequencesOfMinLength = function * (sequences, minLength = 1) {
    for(const s of sequences) {
        let seq;
        // check for {x,y,s} object
        if (s.hasOwnProperty('sequence')) {
            seq = s.sequence
        } else {
            seq = s
        }
        if (seq.length >= minLength) {
            yield s
        }
    }
}

/**
 * obtain all valid moves on the board for the given player 
 * 
 * @param {object[][]} board the 2D board
 * @param {object} player the active player 
 * @return {[{x:number,y:number}]} array of validMoves by x,y
 * @public
*/
export const getValidMoves = (board, player) => {
    // console.log("Othello :: getValidMoves")
    let validMoves = []
    const playerSequences = getSequencesByPlayer(board, player)
    const minLengthSequences = filterSequencesOfMinLength(playerSequences, Constants.minLengthCheckingValidMoves)
    for (const s of filterSequencesWithEmptySpaces(minLengthSequences)) {
        const {locX, locY, sequence} = s
        for (let pos in sequence) {
            // because sometimes pos is a string, unsure why ?
            const n = parseInt(pos)
            const {x, y} = sequence[n]
            if (x === locX && y === locY) {
                // console.log(`DEBUG >> found source counter at x=${x},y=${y} for sequence=`, sequence)
                const prev = n - 1
                if (prev >= 0 && sequence[prev].item !== Constants.emptySpace && sequence[prev].item.color !== player.color) {
                    // console.log("Candidate sequence: ", sequence)
                    // console.log("Candidate valid move, prev: ", prev, sequence[prev])
                    for (let i = prev - 1; i >= 0; i--) {
                        if (sequence[i].item === Constants.emptySpace) {
                            const {x, y} = sequence[i]
                            validMoves.push({x, y})
                            // console.log(`DEBUG >>     found valid move at x=${x},y=${y} for sequence=`, sequence)
                            break
                        } else if (sequence[i].item.color === player.color) {
                            break
                        }
                    }
                }
                const next = n + 1
                if (next < sequence.length && sequence[next].item !== Constants.emptySpace && sequence[next].item.color !== player.color) {
                    // console.log("Candidate sequence: ", sequence)
                    // console.log("Candidate valid move, next: ", next, sequence[next])
                    for (let i = next + 1; i < sequence.length; i++) {
                        if (sequence[i].item === Constants.emptySpace) {
                            const {x, y} = sequence[i]
                            validMoves.push({x, y})
                            // console.log(`DEBUG >>     found valid move at x=${x},y=${y} for sequence=`, sequence)
                            break
                        } else if (sequence[i].item.color === player.color) {
                            break
                        }
                    }
                }
            }
        }
    }

    return validMoves
}

/**
 * check for empty 
 * 
 * @param {object[][]} board the 2D board
 * @param {object} player the active player 
 * @return {boolean} true if there are empty spaces, otherwise false
 * @public
*/
export const hasEmptySpaces = (board) => {
    for (const row of board) {
        const spaces = row.filter(item => item===Constants.emptySpace)
        if (spaces.length > 0) {
            return true
        }
    }
    return false
}

/**
 * check for empty 
 * 
 * @param {object[][]} board the 2D board
 * @return {object} counts of counters for respective player colors
 * @public
*/
export const countPlayerCounters = (board) => {
    let white = 0
    let black = 0
    for (const row of board) {
        for (const item of row) {
            if(item !== Constants.emptySpace) {
                item.color === "white" ? white++ : black++
            }
        }
    }
    return {white, black}
}

/**
 * check if the game has ended
 * 
 * @param {object[][]} board the 2D board
 * @return {any} the color of the winning player, or false
 * @public
*/
export const validateGameEnd = (board) => {
    // console.log("Othello :: validateGameEnd")
    const sequences = decomposeToSequences(board)
    for (const s of filterSequencesOfMinLength(sequences, Constants.winningSequenceLength)) {
        // any sequence with 4 or less counters in total, anywhere, cannot have a winning sequence
        const emptyCount = s.filter(x => x.item===Constants.emptySpace).length
        if (s.length - emptyCount < Constants.winningSequenceLength) {
            continue
        }
        for (let i = 0; i < s.length; i++) {
            if (s.length - i < Constants.winningSequenceLength) {
                break
            }
            if (s[i].item === Constants.emptySpace) {
                continue
            } 
            const color = s[i].item.color
            if (s[i+1].item.color === color && s[i+2].item.color === color && s[i+3].item.color === color && s[i+4].item.color === color) {
                return color
            }
        }
    }
    return false
}

/**
 * update the board by capturing counters based on the latest move
 * 
 * @param {object[][]} board the 2D board
 * @param {{x:number, y:number}} loc the location of the last move
 * @return {object[][]} the updated 2D board
 * @public
*/
export const updateCaptures = (board, loc) => {
    // console.log("Othello :: updateCaptures")
    const {x, y} = loc
    const player = board[y][x]
    const sequencesToCheck = []
    for (const s of getSequencesByLocation(board, loc)) {
        // console.log("Debugging >> updateCaptures, examining sequence=", s)
        let i = 0
        while (i < s.length) {
            // console.log("Debugging >>   updateCaptures, comparing position=", i, s[i])
            if (s[i].x === x && s[i].y === y) {
                break
            }
            i++
        }
        if ((i-1 >= 0 && s[i-1].item !== Constants.emptySpace && s[i-1].item.color !== player.color) ||
            (i+1 < s.length && s[i+1].item !== Constants.emptySpace && s[i+1].item.color !== player.color)
        ) {
            sequencesToCheck.push(s)
        }
    }
    // console.log("Debugging >> updateCaptures, data=", loc, player.color, sequencesToCheck)
    for (const s of sequencesToCheck) {
        let i = 0
        while (i < s.length) {
            if (s[i].x === x && s[i].y === y) {
                break
            }
            i++
        }
        let tmpStack = []
        // console.log("Debugging >>   updateCaptures, at", x, y, "; process sequence=", s)
        for (let p = i - 1; p >= 0; p--) {
            // console.log("Debugging >>     ", p, s[p], s[p].item)
            const prev = s[p]
            // capture groups should have counters of capturing player at either end
            if (prev.item === Constants.emptySpace) {
                // console.log("Debugging >>     space at ", p, "no capture")
                break
            }
            if (prev.item.color === player.color) {
                for (const c of tmpStack) {
                    // console.log("Debugging >>     capture!!!  ", tmpStack)
                    const {x, y} = c
                    board[y][x] = player
                }
                break
            } else {
                // console.log("Debugging >>     candidate for capture ", prev.x, prev.y)
                tmpStack.push(prev)
            }
        }
        tmpStack = []
        for (let n = i + 1; n < s.length; n++) {
            // console.log("Debugging >>     ", n, s[n], s[n].item)
            const next = s[n]
            // capture groups should have counters of capturing player at either end
            if (next.item === Constants.emptySpace) {
                // console.log("Debugging >>     space at ", n, "no capture")
                break
            }
            if (next.item.color === player.color) {
                for (const c of tmpStack) {
                    // console.log("Debugging >>     capture!!!  ", tmpStack)
                    const {x, y} = c
                    board[y][x] = player
                }
                break
            } else {
                // console.log("Debugging >>     candidate for capture ", next.x, next.y)
                tmpStack.push(next)
            }
        }
    }
    return board
}
