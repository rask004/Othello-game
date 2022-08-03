import React from 'react'
import { Position } from '../Constants'

const boardSpaceClass = 'board-space'

type Props = {
    counter? : JSX.Element,
    tid : Position,
}

/**
 * Draws a single square space.
 */
 export default function SquareBoardSpace(props : Props) {
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