import React from 'react';
import './SquareBoard.css';
import Counter from "./Counter";
import Constants from './Constants';

function SquareBoard(props) {
    let c = 0;
    const {spaceCallback, counterType, validMoves} = props;
    const label = 'game board'

    let counterShape = "square";
    if (counterType === Constants.counterRound) {
        counterShape = "round";
    }

    const board = props.board.map( function(row, y) {
        return (
        <div data-testid={`board-row-${y + 1}`} className="board-row" key={`row-${y + 1}`}>
            { row.map( function(owner, x) {
                c++;
                const tid = {x, y}
                const isValidMove = validMoves.filter((i) => {return i.x===x && i.y===y}).length > 0
                // console.log(isValidMove, x, y)
                if (owner !== Constants.emptySpace) {
                    const {color} = owner;
                    const counter = {color, shape:counterShape}
                    return (
                        <SquareBoardSpace tid={tid} key={`space-${c}`} counter={counter} />
                    );
                } else if (isValidMove) {
                    const onclick = () => {spaceCallback(x, y)};
                    return <InteractiveSquareBoardSpace tid={tid} key={`space-${c}`} callback={onclick} />;
                } else {
                    return <SquareBoardSpace tid={tid} key={`space-${c}`} />;
                }
            })}
        </div>
        )
    });

    return (
    <div aria-label={label} className="board">
        {board}
    </div>
    );
}

function SquareBoardSpace(props) {
    const {counter, tid} = props;

    const label = 'square space'

    if (counter) {
        return (
            <div data-testid={`board-space-${tid.x}-${tid.y}`}  aria-label={label} className='board-space'>
                <Counter color={counter.color} shape={counter.shape} />
            </div>
        );
    } else {
        return (
            <div data-testid={`board-space-${tid.x}-${tid.y}`}  aria-label={label} className='board-space'></div>
        );
    }
}

function InteractiveSquareBoardSpace(props) {
    const {counter, callback, tid} = props;
    const label = 'square space interactive'
    if (counter) {
        return (
            <button data-testid={`board-space-${tid.x}-${tid.y}`} aria-label={label} className='board-space' onClick={callback}>
                <Counter color={counter.color} shape={counter.shape} />
            </button>
        );
    } else {
        return (
            <button data-testid={`board-space-${tid.x}-${tid.y}`} aria-label={label} className='board-space' onClick={callback}></button>
        );
    }
}

export default SquareBoard;
export {SquareBoardSpace, InteractiveSquareBoardSpace};
