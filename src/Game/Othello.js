import Constants from './Constants'

/* 
    convert all rows, columns and diagonals into a sequence of sequences.
*/
const _decomposeToSequences = function *(board) {
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

const _getSequencesByLocation = function *(board, loc) {
    const {x, y} = loc
    for (const s of _decomposeToSequences(board)) {
        for (const position of s) {
            if(x === position.x && y === position.y) {
                yield s
            }
        }
    }
}

const _getSequencesByPlayer = function *(board, player) {
    const {name} = player
    for (const s of _decomposeToSequences(board)) {
        for (const position of s) {
            if(position.item !== Constants.emptySpace && position.item.name === name) {
                const {x, y} = position
                yield {locX:x, locY:y, sequence:s}
            }
        }
    }
}

const _filterSequencesWithEmptySpaces = function *(sequences) {
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

const _filterSequencesOfMinLength = function * (sequences, minLength = 1) {
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

const getValidMoves = (board, player) => {
    // console.log("Othello :: getValidMoves")
    let validMoves = []
    const playerSequences = _getSequencesByPlayer(board, player)
    const minLengthSequences = _filterSequencesOfMinLength(playerSequences, Constants.minLengthCheckingValidMoves)
    for (const s of _filterSequencesWithEmptySpaces(minLengthSequences)) {
        const {locX, locY, sequence} = s
        for (let pos in sequence) {
            // because sometimes pos is a string, unsure why ?
            const n = parseInt(pos)
            const {x, y} = sequence[n]
            if (x === locX && y === locY) {
                // console.log(`DEBUG >> found source counter at x=${x},y=${y} for sequence=`, sequence)
                const prev = n - 1
                if (prev >= 0 && sequence[prev].item !== Constants.emptySpace && sequence[prev].item.name !== player.name) {
                    // console.log("Candidate sequence: ", sequence)
                    // console.log("Candidate valid move, prev: ", prev, sequence[prev])
                    for (let i = prev - 1; i >= 0; i--) {
                        if (sequence[i].item === Constants.emptySpace) {
                            const {x, y} = sequence[i]
                            validMoves.push({x, y})
                            // console.log(`DEBUG >>     found valid move at x=${x},y=${y} for sequence=`, sequence)
                            break
                        } else if (sequence[i].item.name === player.name) {
                            break
                        }
                    }
                }
                const next = n + 1
                if (next < sequence.length && sequence[next].item !== Constants.emptySpace && sequence[next].item.name !== player.name) {
                    // console.log("Candidate sequence: ", sequence)
                    // console.log("Candidate valid move, next: ", next, sequence[next])
                    for (let i = next + 1; i < sequence.length; i++) {
                        if (sequence[i].item === Constants.emptySpace) {
                            const {x, y} = sequence[i]
                            validMoves.push({x, y})
                            // console.log(`DEBUG >>     found valid move at x=${x},y=${y} for sequence=`, sequence)
                            break
                        } else if (sequence[i].item.name === player.name) {
                            break
                        }
                    }
                }
            }
        }
    }

    return validMoves
}

const validateGameEnd = (board) => {
    // console.log("Othello :: validateGameEnd")
    const sequences = _decomposeToSequences(board)
    for (const s of _filterSequencesOfMinLength(sequences, Constants.winningSequenceLength)) {
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
            const name = s[i].item.name
            if (s[i+1].item.name === name && s[i+2].item.name === name && s[i+3].item.name === name && s[i+4].item.name === name) {
                return name
            }
        }
    }
    return false
}

const updateCaptures = (board, loc) => {
    // console.log("Othello :: updateCaptures")
    const {x, y} = loc
    const player = board[y][x]
    const sequencesToCheck = []
    for (const s of _getSequencesByLocation(board, loc)) {
        // console.log("Debugging >> updateCaptures, examining sequence=", s)
        let i = 0
        while (i < s.length) {
            // console.log("Debugging >>   updateCaptures, comparing position=", i, s[i])
            if (s[i].x === x && s[i].y === y) {
                break
            }
            i++
        }
        if ((i-1 >= 0 && s[i-1].item !== Constants.emptySpace && s[i-1].item.name !== player.name) ||
            (i+1 < s.length && s[i+1].item !== Constants.emptySpace && s[i+1].item.name !== player.name)
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
            if (prev.item.name === player.name) {
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
            if (next.item.name === player.name) {
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

export {getValidMoves, validateGameEnd, updateCaptures, _decomposeToSequences}