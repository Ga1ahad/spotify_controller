import { TextField, Button, Grid, Typography } from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
axios.defaults.withCredentials = true;

export default function JoinRoom() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            code: ""
        },
        onSubmit: async (values, { setFieldError }) => {
            try {
                // Use Axios to make a POST request
                await axios.post('http://127.0.0.1:8000/api/room/join', values);
                navigate('/room/' + formik.values.code);
            } catch (error) {
                // Handle the error appropriately
                setFieldError('code', error.response.data.message);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                        Join a Room
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <TextField
                        id="roomCode"
                        name="code"
                        label="Code"
                        type="string"
                        placeholder="Enter a Room Code"
                        value={formik.values.code}
                        onChange={formik.handleChange}
                        error={formik.touched.code && Boolean(formik.errors.code)}
                        helperText={formik.touched.code && formik.errors.code}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        Enter Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                            // Handle the "Back" button click, e.g., go to another page
                            navigate('/other-page');
                        }}
                    >
                        Back
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}
