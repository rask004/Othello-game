export interface Position {
    x: number,
    y: number,
}

export interface Player {
    type: string, 
    color: string,
}

export interface SequenceItem {
    x : number,
    y : number,
    item : Player,
}

export interface PlayerSequences {
    sequence: Array<SequenceItem>,
    playerLocation: Position,
}

interface ChooseMoveFunc {
    (possibleMoves:Position[], board:Array<Array<Player>>) : Position
}

export interface AIObject {
    chooseMove: ChooseMoveFunc,
}

export default class Constants {
    static emptySpace = " "
    static emptyColor = "NoneColor"
    static emptyPlayer = {type:this.emptySpace, color:this.emptyColor} as Player

    static counterRound = "counter-round"
    static counterSquare = "counter-square"

    static colorBlack = "black"
    static colorWhite = "white"

    static winningSequenceLength = 5

    static minLengthCheckingValidMoves = 3

    static boardSize = 8

    static userPlayerIndex = 0
    static aiPlayerIndex = 1

    static maxMessageCount = 13

    static humanPlayer = "Human"
    static aiPlayerRandom = "AIPlayerRandom"
    static aiPlayerMostCaptures = "AIPlayerMostCaptures"

    static defaultPlayers = [{type: this.humanPlayer, color: this.colorBlack}, {type: this.humanPlayer, color: this.colorWhite}] as Array<Player>
}

