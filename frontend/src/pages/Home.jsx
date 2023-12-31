import {useEffect, useState} from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link, useNavigate, Navigate
} from "react-router-dom";
import CreateRoom from './CreateRoom.jsx'
import JoinRoom from './JoinRoom.jsx'
import ViewRoom from './ViewRoom.jsx'
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";
import axios from "axios";
import {useParams} from "react-router";
axios.defaults.withCredentials = true;


function renderHomePage() {
    return(
    <Grid container spacing={3}>
        <Grid item xs={12} align="center">
            <Typography variant="h3" compact="h3">
                House Party
            </Typography>
        </Grid>
        <Grid item xs={12} align="center">
            <ButtonGroup disableElevation variant="contained" color="primary">
                <Button color="primary" to="/join" component={Link}>
                    Join a Room
                </Button>
                <Button color="secondary" to="/create" component={Link}>
                    Create a Room
                </Button>
            </ButtonGroup>
        </Grid>
    </Grid>
    )
}

export default function Home() {
    const [roomCode, setRoomCode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = useParams();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/user-in-room');
                setRoomCode(response.data.code);
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
    const roomPath = '/room/' + roomCode
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={roomCode ? <Navigate to={roomPath}  /> : renderHomePage()}/>
                <Route path="/create" element={<CreateRoom/>}/>
                <Route path="/join" element={<JoinRoom/>}/>
                <Route path="/room/:roomCode" element={<ViewRoom/>}/>
            </Routes>
        </Router>
    )
}
