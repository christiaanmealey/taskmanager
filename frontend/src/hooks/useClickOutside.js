import { useEffect } from "react";

function useClickOutside(ref, handler) {
    useEffect(() => {

        if(!ref.current) return;
        function handleClickOutside(event) {
            console.log(ref.current);
            if (ref.current && !ref.current.contains(event.target)) {
                handler();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, handler]);
}

export default useClickOutside;