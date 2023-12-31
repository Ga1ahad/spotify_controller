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
axios.defaults.withCredentials = true;

export default function CreateRoom() {

    const handleBack = () => {
        console.log("Going back...");
    };
    const formik = useFormik({
        initialValues: {
            votesToSkip: 1,
            guestCanPause: ''
        },
        onSubmit: async (values) => {
            try {
                // Use Axios to make a POST request
                await axios.post('http://127.0.0.1:8000/api/room/create',
                    values);
                alert('Room created successfully!');
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
                        Create A Room
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText>
                            Guest Control of Playback State
                        </FormHelperText>
                        <RadioGroup row>
                            <FormControlLabel
                                name="guestCanPause"
                                value="true"
                                control={<Radio type="radio" name="guestCanPause"/>}
                                label="Play/Pause"
                                labelPlacement="bottom"
                                onChange={formik.handleChange}
                            />
                            <FormControlLabel
                                name="guestCanPause"
                                value="false"
                                control={<Radio type="radio" name="guestCanPause"/>}
                                label="No control"
                                labelPlacement="bottom"
                                onChange={formik.handleChange}
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
            </Grid>
        </form>
    );
}
