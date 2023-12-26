import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';

export default function ViewRoom() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/room?code=${params.roomCode}`);
                setData(response.data);
            } catch (error) {
                setError(error.message || 'An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [params.roomCode]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    return (
        <div>
            {data && (
                <>
                    <h3>{data.code}</h3>
                    <p>Votes: {data.votes_to_skip}</p>
                    <p>Guest Can Pause: {data.guest_can_pause ? 'True' : 'False'}</p>
                    <p>Host: {data.is_host ? 'True' : 'False'}</p>
                </>
            )}
        </div>
        );
}
