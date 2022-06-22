import React from 'react';
import PropTypes from 'prop-types'
import './Counter.css';

/**
 * Draws a simple game Counter, with a basic shape and color
 */
 export default function Counter (props) {
        const {color, shape} = props;
        
        const elementClass = `counter ${shape} counter-${color}`;
        const label = `game counter ${shape} ${color}`;
        return (
            <span aria-label={label} className={elementClass} />
        );
}
Counter.propTypes = {
    /** color of the counter. All valid CSS color names are allowed here */
    color: PropTypes.string,
    /** shape of the counter. Values can be - Round, Square */ 
    shape: PropTypes.string
}