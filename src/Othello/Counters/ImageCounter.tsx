import React from 'react';
import './ImageCounter.css';

type Props = {
    color: String,
    shape: String,
    getSrc: Function,
}

/**
 * Draws a simple game Counter, with a basic shape and color
 */
 export default function ImgCounter (props : Props) {
        const {color, shape, getSrc} = props;
        const elementClass = `counter ${shape}`;
        const label = `game counter ${shape} ${color}`;
        return (
            <img aria-label={label} className={elementClass} src={getSrc(color)} alt={label} />
        );
}