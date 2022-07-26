import React from 'react'
import { useSelector } from 'react-redux'
import './SquareBoard.css'
import SquareBoardSpace from './SquareBoardSpace'
import InteractiveSquareBoardSpace from './InteractiveSquareBoardSpace'
import Constants, { Position, Player } from '../Constants'

type Props = {
    spaceCallback : Function 
    CounterComponent : React.ElementType, 
    counterShape : String, 
    validMoves : Array<Position>, 
    counterGetSrcFunc : Function,
}

/**
 * Draws a game board with square spaces.
 */
 export default function SquareBoard(props : Props) {
    let c = 0;
    const {spaceCallback, CounterComponent, counterShape, validMoves, counterGetSrcFunc} = props;
    const label = 'game board'
    const boardState = useSelector((state:any) => state.board.value)

    const board = boardState.map( function(row:Array<any>, y:number) {
        return row.map( function(owner:Player, x:number) {
                c++;
                const tid = {x, y}
                const isValidMove = validMoves.filter((i:Position) => {return i.x===x && i.y===y}).length > 0
                // console.log(isValidMove, x, y)
                if (owner.type !== Constants.emptyPlayer.type) {
                    const {color} = owner;
                    const counter = (<CounterComponent color={color} shape={counterShape} getSrc={counterGetSrcFunc} />)
                    return (
                        <SquareBoardSpace tid={tid} key={`space-${c}`} counter={counter} />
                    );
                } else if (isValidMove) {
                    const onclick = () => {spaceCallback(x, y)};
                    return <InteractiveSquareBoardSpace tid={tid} key={`space-${c}`} callback={onclick} />;
                } else {
                    return <SquareBoardSpace tid={tid} key={`space-${c}`} />;
                }
            }
        )
    });

    return (
    <div aria-label={label} className="board">
        {board}
    </div>
    );
}
