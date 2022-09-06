import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import PeopleAltIcon from '@mui/icons-material/People';
import { Avatar, Button, TextField, Grid, Box, Container } from '@mui/material';
import { FormControl, InputLabel, Input, Snackbar, SnackbarContent } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm } from "react-hook-form";
import './register.css';

function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
}

const Register = () => {
    const theme = createTheme();
    const [state, setState] = useState({
        email: "",
        password: "",
        passwordConfirm: "",
        showPassword: false,
        error: null,
        errorOpen: false
    });
    const handleChange = name => e => {
        setState({
            ...state,
            [name]: e.target.value
        });
    };

    /* React Hook for Hidden Password feature*/
    const handleClickShowPassword = () => {
        setState({ ...state, showPassword: !state.showPassword });
    };
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    /****************END********************/

    /* Used for validating form of SignIn */
    const { register, handleSubmit, formState: { errors } } = useForm();
    const passwordMatch = () => state.password === state.passwordConfirm;
    const errorClose = e => {
        setState({
            ...state,
            errorOpen: false
        });
    };
    /****************END********************/

    const submitRegistration = (data) => {
        console.log("state", state);
        console.log("errors", errors);

        if (!passwordMatch()) {
            setState({
            ...state,
            errorOpen: true,
            error: "Passwords don't match"
          });
        }
        const newUserCredentials = {
          email: state.email,
          password: state.password,
          passwordConfirm: state.passwordConfirm
        };
        console.log("newUserCredentials", newUserCredentials);
        //dispath to userActions
    };

    return (
        <ThemeProvider theme={theme}>
            <div className='bg_signup'/>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }} >
                        <PeopleAltIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(submitRegistration)} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            {...register("email", 
                                { 
                                required: true,  
                                pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 
                            })}
                            onChange={handleChange("email")}
                        />
                        {errors.email && <p style={{color:'red'}}>Please check the Email</p>}
                        <TextField 
                            margin="normal"
                            label="Password"
                            required
                            fullWidth
                            name="password"
                            variant="outlined"
                            type={state.showPassword ? "text" : "password"}
                            id="password"
                            autoComplete="current-password"
                            {...register("password", { 
                                required: true, 
                            })}
                            onInput={handleChange("password") /*Used onInput to get rid out of autofilling problem that tricks the web still consider the input as a empty field*/}
                            InputProps={{
                                endAdornment:
                                <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {state.showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                                </InputAdornment>
                            }}
                        />
                        {errors.password && <p style={{color:'red'}}>Please check the Password</p>}
                        <TextField 
                            margin="normal"
                            label="Confirm Password"
                            required
                            fullWidth
                            name="passwordConfirm"
                            variant="outlined"
                            type={state.showPassword ? "text" : "password"}
                            id="passwordConfirm"
                            autoComplete="confirm-password"
                            {...register("passwordConfirm", { 
                                required: true, 
                            })}
                            onChange={handleChange("passwordConfirm")}
                            InputProps={{
                                endAdornment:
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {state.showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }}
                        />
                        {errors.passwordConfirm && <p style={{color:'red'}}>Please check the Confirm Password</p>}
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}> 
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Join
                            </Button>
                        </div>
                
                        <Grid container>
                            <Grid item xs>
                                <Link to='/' variant="body2">
                                Back to Home
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to='/signin' variant="body2">
                                {"Already haved an account? Sign In"}
                                </Link>
                            </Grid>
                        </Grid>

                    </Box>
                    {state.error ? (
                        <Snackbar
                            variant="error"
                            key={state.error}
                            anchorOrigin={{ vertical: "top", horizontal: "center" }}
                            open={state.errorOpen}
                            onClose={errorClose}
                            autoHideDuration={5000}
                            className='error'
                        >
                            <SnackbarContent
                                message={
                                    <div>
                                        <span style={{ marginRight: "8px" }}>
                                        <ErrorIcon fontSize="large" color="error" />
                                        </span>
                                        <span> {state.error} </span>
                                    </div>
                                }
                                action={[
                                    <IconButton
                                        key="close"
                                        aria-label="close"
                                        onClick={errorClose}
                                    >
                                        <CloseIcon color="error" />
                                    </IconButton>
                                ]}
                            />
                        </Snackbar>
                    ) : null}
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    )
}

export default Register;