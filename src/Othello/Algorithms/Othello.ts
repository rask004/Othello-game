import Constants, {Position, Player, SequenceItem} from '../Constants'

interface PlayerSequence {
    sequence: SequenceItem[],
    playerLocation: Position,
}

/**
 * convert all rows, columns and diagonals into a sequence of sequences.
 * 
 * @param { Array<Array<Player>>} board the 2D board to work from
 * @public
*/
export const decomposeToSequences = function *(board: Array<Array<Player>>) : Generator<SequenceItem[], void, unknown> {
    const h:number = board.length
    const w:number = board[0].length
    // rows
    for (let n in board) {
        const y = parseInt(n)
        yield board[y].map( (item:Player, x:number) => {
            // guarantee x and y are numbers - because sometimes strings are being created
            return {x, y, item}
        })
    }
    // columns
    for (let m in board[0]) {
        const x = parseInt(m)
        const col = board.map((row) => {
            return row[x]
        })
        yield col.map( (item, y) => {
            return {x, y, item}
        })
    }
    // backward diagonals (\)
    for (let c = w - 1; c >= 0; c--) {
        let diag = []
        let y = 0
        for (let x = c; x < w; x++) {
            diag.push({x, y, item:board[y][x]})
            y++
        }
        yield diag
    }
    for (let c = 1; c < h; c++) {
        let diag = []
        let x = 0
        for (let y = c; y < h; y++) {
            diag.push({x, y, item:board[y][x]})
            x++
        }
        yield diag
    }
    // forward diagonals (/)
    for(let c = 0; c < w; c++) {
        let diag = []
        let y = 0
        for (let x = c; x >= 0; x--) {
            diag.push({x, y, item:board[y][x]})
            y++
        }
        yield diag
    }
    for(let c = 1; c < h; c++) {
        let diag = []
        let x = w - 1
        for (let y = c; y < h; y++) {
            diag.push({x, y, item:board[y][x]})
            x--
        }
        yield diag
    }
}

/**
 * yield only sequences containing a given position
 * 
 * @param {Array<Array<Player>>} board the 2D board to work from
 * @param {Position} loc the given position
 * @public
*/
export const getSequencesByLocation = function *(board: Array<Array<Player>>, loc: Position): Generator<SequenceItem[], void, unknown> {
    const {x, y} = loc
    for (const s of decomposeToSequences(board)) {
        for (const sequenceItem of s) {
            if(x === sequenceItem.x && y === sequenceItem.y) {
                yield s
            }
        }
    }
}

/**
 * yield only sequences containing counters of a given player
 * 
 * @param {Array<Array<Player>>} board the 2D board to work from
 * @param {Player} player the given player
 * @public
*/
export const getSequencesByPlayer = function *(board: Array<Array<Player>>, player: Player): Generator<PlayerSequence, void, unknown> {
    const {color} = player
    for (const sequence of decomposeToSequences(board)) {
        for (const sequenceItem of sequence) {
            // console.log("checking for sequences by player: ", position)
            if(sequenceItem.item.type !== Constants.emptyPlayer.type && sequenceItem.item.color === color) {
                const {x, y} = sequenceItem
                const playerSequence = {sequence, playerLocation: {x, y}}
                yield playerSequence
            }
        }
    }
}

/**
 * filter to yield only sequences containing empty spaces
 * 
 * @param {Generator<any, void, unknown>} sequences the sequences to filter
 * @public
*/
export const filterSequencesWithEmptySpaces = function *(sequences: Generator<any, void, unknown>): Generator<any, void, unknown> {
    for(const s of sequences) {
        let seq:SequenceItem[];
        if ( s.hasOwnProperty('sequence')) {
            seq = s.sequence
        } else {
            seq = s
        }
        for (const position of seq) {
            if (position.item.type === Constants.emptyPlayer.type) {
                yield s
                break
            }
        }
    }
}

/**
 * filter to yield only sequences of a minimum length
 * 
 * @param {Generator<any, void, unknown>} sequences the sequences to filter
 * @param {number} minLength the minimum length for a sequence
 * @public
*/
export const filterSequencesOfMinLength = function * (sequences: Generator<any, void, unknown>, minLength: number = 1): Generator<any, void, unknown> {
    for(const s of sequences) {
        let seq:SequenceItem[];
        if ( s.hasOwnProperty('sequence')) {
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
 * @param {Array<Array<Player>>} board the 2D board
 * @param {Player} player the active player 
 * @return {Array<Position>} array of validMoves by x,y
 * @public
*/
export const getValidMoves = (board: Array<Array<Player>>, player: Player): Array<Position> => {
    // console.log("Othello :: getValidMoves")
    let validMoves = []
    const playerSequences = getSequencesByPlayer(board, player)
    const minLengthSequences = filterSequencesOfMinLength(playerSequences, Constants.minLengthCheckingValidMoves)
    for (const s of filterSequencesWithEmptySpaces(minLengthSequences)) {
        
        const {playerLocation, sequence} = s
        const locX = playerLocation.x
        const locY = playerLocation.y
        // console.log("Othello :: getValidMoves >>> filteredSequence=", sequence, "; location=", playerLocation)
        for (let pos in sequence) {
            // because sometimes pos is a string, unsure why ?
            const n = parseInt(pos)
            const {x, y} = sequence[n]
            if (x === locX && y === locY) {
                // console.log(`DEBUG >> found source counter at x=${x},y=${y} for sequence=`, sequence)
                const prev = n - 1
                if (prev >= 0 && sequence[prev].item.type !== Constants.emptyPlayer.type && sequence[prev].item.color !== player.color) {
                    // console.log("Candidate sequence: ", sequence)
                    // console.log("Candidate valid move, prev: ", prev, sequence[prev])
                    for (let i = prev - 1; i >= 0; i--) {
                        if (sequence[i].item.type === Constants.emptyPlayer.type) {
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
                if (next < sequence.length && sequence[next].item.type !== Constants.emptyPlayer.type && sequence[next].item.color !== player.color) {
                    // console.log("Candidate sequence: ", sequence)
                    // console.log("Candidate valid move, next: ", next, sequence[next])
                    for (let i = next + 1; i < sequence.length; i++) {
                        if (sequence[i].item.type === Constants.emptyPlayer.type) {
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

    // console.log(`DEBUG >>     found valid moves=`, validMoves)
    return validMoves
}

/**
 * check for empty 
 * 
 * @param {Array<Array<Player>>} board the 2D board
 * @return {boolean} true if there are empty spaces, otherwise false
 * @public
*/
export const hasEmptySpaces = (board: Array<Array<Player>>): boolean => {
    for (const row of board) {
        const spaces = row.filter(item => item.type === Constants.emptyPlayer.type)
        if (spaces.length > 0) {
            return true
        }
    }
    return false
}

/**
 * check for empty 
 * 
 * @param {Array<Array<Player>>} board the 2D board
 * @return {{[s: string]:number}} counts of counters for respective player colors
 * @public
*/
export const countPlayerCounters = (board: Array<Array<Player>>): { [key: string]: number } => {
    let counts: { [key: string]: number } = {}
    for (const row of board) {
        for (const item of row) {
            if(item.type !== Constants.emptyPlayer.type) {
                if(!(item.color in counts)) {
                    counts[item.color] = 0
                }
                counts[item.color]++
            }
        }
    }
    return counts
}

/**
 * check if the game has ended
 * 
 * @param {Array<Array<Player>>} board the 2D board
 * @return {Player|false} the winning player, or false
 * @public
*/
export const validateGameEnd = (board: Array<Array<Player>>): Player | false => {
    // console.log("Othello :: validateGameEnd")
    const sequences = decomposeToSequences(board)
    for (const s of filterSequencesOfMinLength(sequences, Constants.winningSequenceLength)) {
        // any sequence with 4 or less counters in total, anywhere, cannot have a winning sequence
        const emptyCount = s.filter((x: { item: { type: string } }) => x.item.type === Constants.emptyPlayer.type).length
        if (s.length - emptyCount < Constants.winningSequenceLength) {
            continue
        }
        for (let i = 0; i < s.length; i++) {
            if (s.length - i < Constants.winningSequenceLength) {
                break
            }
            if (s[i].item.type === Constants.emptyPlayer.type) {
                continue
            } 
            const color = s[i].item.color
            if (s[i+1].item.color === color && s[i+2].item.color === color && s[i+3].item.color === color && s[i+4].item.color === color) {
                return s[i].item
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
 * @public
*/
export const updateCaptures = function *(board: Array<Array<Player>>, player: Player, loc: Position) {
    // console.log("Othello :: updateCaptures")
    const {x, y} = loc
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
        if ((i-1 >= 0 && s[i-1].item.type !== Constants.emptyPlayer.type && s[i-1].item.color !== player.color) ||
            (i+1 < s.length && s[i+1].item.type !== Constants.emptyPlayer.type && s[i+1].item.color !== player.color)
        ) {

            sequencesToCheck.push({s, i})
        }
    }
    // console.log("Debugging >> updateCaptures, data=", loc, player.color, sequencesToCheck)
    for (const {s, i} of sequencesToCheck) {
        let tmpStack = []
        // console.log("Debugging >>   updateCaptures, at", x, y, "; process sequence=", s)
        for (let p = i - 1; p >= 0; p--) {
            // console.log("Debugging >>     ", p, s[p], s[p].item)
            const prev = s[p]
            /* capture groups should have counters of capturing player at either end */
            if (prev.item.type === Constants.emptyPlayer.type) {
                // console.log("Debugging >>     space at ", p, "no capture")
                break
            }
            if (prev.item.color === player.color) {
                for (const c of tmpStack) {
                    // console.log("Debugging >>     capture!!!  ", tmpStack)
                    const capture = {x:c.x, y:c.y}
                    yield capture
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
            /* capture groups should have counters of capturing player at either end */
            if (next.item.type === Constants.emptyPlayer.type) {
                // console.log("Debugging >>     space at ", n, "no capture")
                break
            }
            if (next.item.color === player.color) {
                for (const c of tmpStack) {
                    // console.log("Debugging >>     capture!!!  ", tmpStack)
                    const capture = {x:c.x, y:c.y}
                    yield capture
                }
                break
            } else {
                // console.log("Debugging >>     candidate for capture ", next.x, next.y)
                tmpStack.push(next)
            }
        }
    }
}
