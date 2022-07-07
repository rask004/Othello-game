import React from 'react';
import PropTypes from 'prop-types'
import './ImageCounter.css';

/**
 * Draws a simple game Counter, with a basic shape and color
 */
 export default function ImgCounter (props) {
        const {color, shape, getSrc} = props;
        const elementClass = `counter ${shape}`;
        const label = `game counter ${shape} ${color}`;
        return (
            <img aria-label={label} className={elementClass} src={getSrc(color)} alt={label} />
        );
}
ImgCounter.propTypes = {
    /** color of the counter. All valid CSS color names are allowed here */
    color: PropTypes.string,
    /** shape of the counter. Values can be - Round, Square */ 
    shape: PropTypes.string,
    getSrc: PropTypes.func,
}