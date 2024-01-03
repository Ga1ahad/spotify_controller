import {useState, useEffect} from 'react';
import {useParams} from 'react-router';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {Grid, Button, Typography} from "@mui/material";
import CreateRoom from './CreateRoom.jsx'


axios.defaults.withCredentials = true;

export default function ViewRoom() {
    const [data, setData] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = useParams();
    const navigate = useNavigate();

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
    const handleLeaveButton = async () => {
        try {
            // Use Axios to make a POST request
            await axios.post('http://127.0.0.1:8000/api/room/leave');
            navigate('/');
        } catch (error) {
            alert('Error leaving room. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (showSettings) {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoom
                        update={true}
                        votesToSkip={data.votes_to_skip}
                        guestCanPause={data.guest_can_pause}
                        roomCode={data.code}
                    />
                    <Grid item xs={12} align="center">
                        <Button
                            variant="contained"
                            color="secondary"
                             onClick={() => setShowSettings(false)}
                        >
                            Close Settings
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Code: {data.code}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Votes: {data.votes_to_skip}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Guest Can Pause: {data.guest_can_pause ? 'True' : 'False'}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Host: {data.is_host ? 'True' : 'False'}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                {data.is_host && (
                    <Button
                        variant="contained"
                        color="primary"
                         onClick={() => setShowSettings(true)}
                    >
                        Settings
                    </Button>
                )}
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleLeaveButton}
                >
                    Leave Room
                </Button>
            </Grid>
        </Grid>
    )
}
