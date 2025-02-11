import React, { createContext } from 'react';
import useWebSocket from '../../hooks/useWebSocket';

export const WebSocketContext = createContext();

export function WebSocketContextProvider({children, wsURL}) {
    const { socket, sendMessage } = useWebSocket(wsURL);
    
    return (
        <WebSocketContext.Provider value={{socket, sendMessage}}>{children}</WebSocketContext.Provider>
    )
}