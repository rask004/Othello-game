import React, { MouseEventHandler } from 'react'
import { Position } from '../Constants'

const boardSpaceClass = 'board-space'

type Props = {
    counter? : JSX.Element,
    tid : Position,
    callback : MouseEventHandler
}

/**
 * Draws a single square space. Space can be clicked, for interaction.
 */
 export default function InteractiveSquareBoardSpace(props : Props) {
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