import React from 'react'
import { useSelector } from 'react-redux'

import './StatusPanel.css'

type StatusProps = {
    message: String
}

/**
 * Shows a status message
 */
export default function StatusPanel(props: StatusProps) { 

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

    let messages = useSelector((state: any) => state.statusMessages.value)

    const messageElements = messages.map((m: String, i: number) => {
        return <div key={i}>{m}</div>
    })

    return (
        <div className="message">
            {messageElements}
        </div>
    )
}