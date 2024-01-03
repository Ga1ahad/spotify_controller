import Button from "@mui/material/Button"
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import {useFormik} from 'formik';
import axios from "axios";
import {useNavigate} from "react-router-dom";
axios.defaults.withCredentials = true;

export default function CreateRoom(props) {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate('/');
    };
    const formik = useFormik({
        initialValues: {
            votesToSkip: props.votesToSkip || 1,
            guestCanPause: props.guestCanPause || false
        },
        onSubmit: async (values) => {
            try {
                if(props.update){
                    const roomValues = {
                        'code': props.roomCode,
                        'votes_to_skip': values.votesToSkip,
                        'guest_can_pause': values.guestCanPause,
                    }
                    const response = await axios.patch('http://127.0.0.1:8000/api/room/update',
                        roomValues);
                } else {
                    const response = await axios.post('http://127.0.0.1:8000/api/room/create',
                        values);
                    navigate('/room/' + response.data.code);
                }
                // Use Axios to make a POST request

            } catch (error) {
                alert('Error creating room. Please try again.');
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                        {props.update ? 'Update Room' : 'Create Room'}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText>
                            Guest Control of Playback State
                        </FormHelperText>
                        <RadioGroup row name="guestCanPause" value={formik.values.guestCanPause}  onChange={formik.handleChange}>
                            <FormControlLabel
                                value="true"
                                control={<Radio type="radio" name="guestCanPause"/>}
                                label="Play/Pause"
                                labelPlacement="bottom"
                            />
                            <FormControlLabel
                                value="false"
                                control={<Radio type="radio" name="guestCanPause"/>}
                                label="No control"
                                labelPlacement="bottom"
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField
                            id="votesToSkip"
                            name="votesToSkip"
                            required={true}
                            type="number"
                            inputProps={{min: 1}}
                            label="Votes Required To Skip Song"
                            value={formik.values.votesToSkip}
                            onChange={formik.handleChange}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button
                        color="primary"
                        variant="contained"
                        type="submit"
                    >
                        {props.update ? 'Update Room' : 'Create Room'}
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    {!props.update && (
                        <Button
                            color="secondary"
                            variant="contained"
                            onClick={handleBack}
                        >
                            Back
                        </Button>
                    )}
                </Grid>
            </Grid>
        </form>
    );
}
