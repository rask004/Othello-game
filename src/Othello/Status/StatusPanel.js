import React from 'react'
import { useSelector } from 'react-redux'

import './StatusPanel.css'

/**
 * Shows a status message
 */
export default function StatusPanel(props) { 

    const {message} = props

    return (
        <div className="message">
            {message}
        </div>
    )
}


/**
 * Shows multiple status messages
 */
export function MultiMessagePanel() { 

    let messages = useSelector((state) => state.statusMessages.value)

    const messageElements = messages.map((m, i) => {
        return <div key={i}>{m}</div>
    })

    return (
        <div className="message">
            {messageElements}
        </div>
    )
}