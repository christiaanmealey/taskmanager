import { useState, useEffect } from "react";

function useFetch(url, options) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(url, options);

                if(!response.ok) throw new Error('response was not ok');
                
                const data = await response.json();
                setData(data);
            } catch (error) {   
                setError(error);
            } finally {
                setLoading(false); 
            }
        };
        fetchData();
    }, [url]);

    return { data, loading, error };
}

export default useFetch;