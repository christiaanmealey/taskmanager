import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export default function useWebSocket(url) {
    const [messages, setMessages] = useState([]);
    const socket = useRef(null);
    const [manualTrigger, setManualTrigger] = useState(null);

    useEffect(() => {
        if(!socket.current) {
            socket.current = io(url);
        }
        socket.current.on('connect', () => {
            console.log('socket connected');
        });
        // socketRef.current.on('message', (message) => {
        //     setMessages((prev) => [...prev, message]);
        // });

        socket.current.on('disconnect', () => console.log('socket closed'));

        return () => {
            socket.current.disconnect();
        }
    }, [url]);

    const sendMessage = (event, data) => {
        
        if(socket.current && socket.current.connected) {
            socket.current.emit(event, data);
            setMessages((prev) => [...prev, data]);
        } else {
            console.warn('socket not connected');
        }
    }

    return { socket, sendMessage, messages }
};