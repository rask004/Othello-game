class Constants {
    static emptySpace = Symbol("empty space")

    static counterRound = "counter-round"
    static counterSquare = "counter-square"

    static colorBlack = "black"
    static colorWhite = "white"

    static winningSequenceLength = 5

    static minLengthCheckingValidMoves = 3

    static boardSize = 8

    static userPlayerIndex = 0
    static aiPlayerIndex = 1

    static humanPlayer = "Human"
    static aiPlayerRandom = "AIPlayerRandom"
    static aiPlayerMostCaptures = "AIPlayerMostCaptures"

    static defaultPlayers = [{type: this.humanPlayer, color: this.colorBlack}, {type: this.humanPlayer, color: this.colorWhite}]
}

export default Constants;