import { useContext } from "react";
import { WebSocketContext } from "./WebSocketContextProvider";

export default function useWebSocketContext() {
    const context = useContext(WebSocketContext);
    if(!context) {
        throw new Error('useWebsocket must be used within a WebSocketContextProvider');
    }

    return context;
}