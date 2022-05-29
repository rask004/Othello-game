import React from 'react';
import './Counter.css';

function Counter (props) {
        const {color, shape} = props;
        const elementClass = `counter counter-${shape} counter-${color}`;
        const label = `game counter ${shape} ${color}`;
        return (
            <div aria-label={label} className={elementClass} />
        );
}

export default Counter;