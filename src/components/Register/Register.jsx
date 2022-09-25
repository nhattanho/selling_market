import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import {  useDispatch } from "react-redux";
import { loginAction } from "../../Redux/actions/auth_action";

import { doc, serverTimestamp, setDoc } from "firebase/firestore"; 
import {db, auth} from '../../firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import PeopleAltIcon from '@mui/icons-material/People';
import { 
    Avatar, 
    Button, 
    TextField, 
    Grid, 
    Box, 
    Container } 
from '@mui/material';
import { 
    FormControl, 
    InputLabel, 
    Input, 
    Snackbar, 
    SnackbarContent } 
from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import {extractErrorMessage} from '../../utils/extract_function';
import { BUYER, CUSTOMERS, LOADING, REGISTER_SUCCESS, SAVED_DB_FAIL } from "../../utils/globalVariable";

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
    const navitage = useNavigate();
    const dispatch = useDispatch();
    const [state, setState] = useState({
        email: "",
        password: "",
        passwordConfirm: "",
        showPassword: false,
        error: null,
        success: null,
        errorOpen: false,
        checkSaved: false,
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
    const checkPassword = () => {
        if (!passwordMatch()) {
            setState({
            ...state,
            errorOpen: true,
            error: "Passwords don't match"
          });
          return false;
        }
        return true;
    }
    const errorClose = e => {
        setState({
            ...state,
            errorOpen: false,
            checkSaved: false,
        });
    };
    
    const successClose = e => {
        if(state.success === REGISTER_SUCCESS){
            setState({
                ...state,
                error: null,
                checkSaved: false,
            });
            navitage("/signin")
        }
    }
    /****************END********************/

    const submitRegistration = async (data) => {
        // console.log("state", state);
        // console.log("errors", errors);
        if (checkPassword()){
            setState({...state, error: null, checkSaved: true, 
                success: LOADING});
            try {
                /*Could not create a new user with email used already in Authentication store*/
                const res = await createUserWithEmailAndPassword(auth, state.email, state.password);
                //console.log("res", res);
                const username = state.email.split('@')[0];
                const userData = {
                    email: state.email,
                    username: username,
                    password: state.password,
                    title: BUYER,
                    timeStamp: serverTimestamp(),
                    accessToken: res.user.accessToken,
                    id: res.user.uid,
                    level:"beginner",
                    scores: 0,
                    avatarurl: "",
                    address: "",
                }
                setDoc(doc(db, CUSTOMERS, res.user.uid), userData).then(() => {
                    //console.log("saving done!");
                    dispatch(loginAction(userData));
                    setState({...state, error: null, checkSaved: true, 
                    success: REGISTER_SUCCESS});
                })
                .catch((error) => {
                    console.log(error);
                    setState({
                        ...state,
                        errorOpen: true,
                        checkSaved: false,
                        error: SAVED_DB_FAIL,
                        });
                });
            } catch(error){
                /* messageError = error.substring(error.indexOf(' ') + 1); */
                var messageError = extractErrorMessage(error);
                setState({
                    ...state,
                    errorOpen: true,
                    checkSaved: false,
                    error: messageError,
                });
            }
        }
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
                            autoHideDuration={4000}
                        >
                            <SnackbarContent
                                message={
                                    <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
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
                    {state.checkSaved ? (
                        <Snackbar
                            variant="error"
                            key={state.success}
                            anchorOrigin={{ vertical: "top", horizontal: "center" }}
                            open={state.checkSaved}
                            onClose={successClose}
                            autoHideDuration={3000}
                        >
                            <SnackbarContent
                                message={
                                    <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                                        <span style={{ marginRight: "8px" }}>
                                            <CheckCircleOutlineIcon fontSize="large" color="success" />
                                        </span>
                                        <span> {state.success} </span>
                                    </div>
                                }
                                action={[
                                    <IconButton
                                        key="close"
                                        aria-label="close"
                                        onClick={successClose}
                                    >
                                        <CloseIcon color="secondary" />
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