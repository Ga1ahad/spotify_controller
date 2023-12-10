import { useState } from 'react';
import Button from "@mui/material/Button"
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl  from '@mui/material/FormControl';
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function CreateRoom() {
    const [ guestCanPause, setGuestCanPause ] = useState( true);
    const [votesRequired, setVotesRequired] = useState(1);
    const handleVotesChange = (value) => {
        setVotesRequired(Math.max(1, value)); // Ensure minimum value is 1
    };

    const handleCreateRoom = () => {
        console.log("Creating a room...");
    };

    const handleBack = () => {
        console.log("Going back...");
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    Create A Room
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText>
                        Guest Control of Playback State
                    </FormHelperText>
                    <RadioGroup
                        row
                        value={guestCanPause}
                        onChange={(e) => setGuestCanPause(e.target.value === "true")}
                    >
                         <FormControlLabel
                             value="true"
                             control={<Radio color="primary" />}
                             label="Play/Pause"
                             labelPlacement="bottom"
                         >
                         </FormControlLabel>
                         <FormControlLabel
                             value="false"
                             control={<Radio color="secondary" />}
                             label="No control"
                             labelPlacement="bottom"
                         >
                         </FormControlLabel>
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField
                        required={true}
                        type="number"
                        inputProps={{min: 1}}
                        label="Votes Required To Skip Song"
                        value={votesRequired}
                        onChange={(e) => handleVotesChange(e.target.value)}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleCreateRoom}
                >
                    Create A Room
                </Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button
                    color="secondary"
                    variant="contained"
                    onClick={handleBack}
                >
                    Back
                </Button>
            </Grid>
        </Grid >
    );
}
