import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import './SquareBoard.css'
import Constants from '../Constants'

const boardSpaceClass = 'board-space'

/**
 * Draws a game board with square spaces.
 */
function SquareBoard(props) {
    let c = 0;
    const {spaceCallback, CounterComponent, counterShape, validMoves} = props;
    const label = 'game board'
    const boardState = useSelector((state) => state.board.value)

    const board = boardState.map( function(row, y) {
        return (
        <div data-testid={`board-row-${y + 1}`} className="board-row" key={`row-${y + 1}`}>
            { row.map( function(owner, x) {
                c++;
                const tid = {x, y}
                const isValidMove = validMoves.filter((i) => {return i.x===x && i.y===y}).length > 0
                // console.log(isValidMove, x, y)
                if (owner !== Constants.emptySpace) {
                    const {color} = owner;
                    const counter = (<CounterComponent color={color} shape={counterShape} />)
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

SquareBoard.propTypes = {
    /** callback function, for board interaction (such as clicking on board spaces) */
    spaceCallback: PropTypes.func, 
    /** Stateless component for the board counters */
    CounterComponent: PropTypes.func, 
    /** shape prop to pass to the Counter component */
    counterShape: PropTypes.string,
    /** array of objects representing available moves at this time */
    validMoves: PropTypes.array
}

/**
 * Draws a single square space.
 */
function SquareBoardSpace(props) {
    const {counter, tid} = props;

    const label = 'square space'

    if (counter) {
        return (
            <div 
                data-testid={`${boardSpaceClass}-${tid.x}-${tid.y}`}
                id={`${boardSpaceClass}-${tid.x}-${tid.y}`}
                aria-label={label}
                className={boardSpaceClass}>
                    {counter}
            </div>
        );
    } else {
        return (
            <div 
                data-testid={`${boardSpaceClass}-${tid.x}-${tid.y}`}
                id={`${boardSpaceClass}-${tid.x}-${tid.y}`}
                aria-label={label}
                className={boardSpaceClass}>
            </div>
        );
    }
}

SquareBoardSpace.propTypes = { 
    /** prerendered counter component */
    counter: PropTypes.object,
    /** {x:int,y:int} object, used in producing a test id */
    tid: PropTypes.object
}

/**
 * Draws a single square space. Space can be clicked, for interaction.
 */
 function InteractiveSquareBoardSpace(props) {
    const {counter, callback, tid} = props;
    const label = 'square space interactive'
    if (counter) {
        return (
            <button data-testid={`${boardSpaceClass}-${tid.x}-${tid.y}`} 
                id={`${boardSpaceClass}-${tid.x}-${tid.y}`}
                aria-label={label}
                className={boardSpaceClass}
                onClick={callback}>
                    {counter}
            </button>
        );
    } else {
        return (
            <button data-testid={`${boardSpaceClass}-${tid.x}-${tid.y}`}
                id={`${boardSpaceClass}-${tid.x}-${tid.y}`}
                aria-label={label}
                className={boardSpaceClass}
                onClick={callback}>
            </button>
        );
    }
}

InteractiveSquareBoardSpace.propTypes = { 
    /** prerendered counter component */
    counter: PropTypes.object,
    /** {x:int,y:int} object, used in producing a test id */
    tid: PropTypes.object,
    /** callback function, triggered upon interacting with the space */
    callback: PropTypes.func
}

export default SquareBoard;
export {SquareBoardSpace, InteractiveSquareBoardSpace};
