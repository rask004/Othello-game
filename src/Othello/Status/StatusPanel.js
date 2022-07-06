import React, { useEffect } from 'react'

import './StatusPanel.css'

export default function StatusPanel(props) { 

    const {message} = props

    return (
        <div className="message">
            {message}
        </div>
    )
}