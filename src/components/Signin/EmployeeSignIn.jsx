import React from 'react';
import { useState } from 'react';
import {auth, provider, db} from '../../firebase.js';
import {signInWithEmailAndPassword, getRedirectResult, signInWithPopup, GoogleAuthProvider, signInWithRedirect, fetchSignInMethodsForEmail } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm } from "react-hook-form";
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { connectFirestoreEmulator, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { collection, query, where, getDocs } from "firebase/firestore";
import {extractErrorMessage} from '../../utils/extract_function';
import {GoogleIcon} from '../../utils/build_svg_icons';
import {Crossline} from '../../utils/crossline';
import './Signin.css';
/*pattern for password: pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/ */
/*https://www.freecodecamp.org/news/add-form-validation-in-react-app-with-react-hook-form/*/

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" to='/'>
        Back to Home
      </Link>{' '}
      <Link color="inherit" to='/signin'>
        Customer Login
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const EmployeeSignIn = () => {
  const theme = createTheme();
  const navitage = useNavigate();
  /* Used for display wrong email or password message*/
  const [error, setError] = useState({status: false, message: ""});
  const [successGoogleLogin, setSuccessGoogleLogin] = useState({status: false, message: ""});

  const [loginObject, setLoginObject] = useState({
    email: '',
    password: '',
  });
  const handleChange = (e) => {
    setValues({ ...values, clicked: false});
    setLoginObject(loginObject => ({
      ...loginObject,
      [e.target.name]: e.target.value,
    }));
    console.log("login clicked",values.clicked);
  };
  /*********************END****************************/

  /* React Hook for Hidden Password feature*/
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
    clicked: false,
  });
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  /****************END********************/

  /* Used for validating form of SignIn and clicked actions*/
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleLogin = (data) =>{
    console.log("signin normal");
    setValues({ ...values, clicked: true});
    signInWithEmailAndPassword(auth, data.email, data.password)
    .then( (userCredential) => {
      const user = userCredential.user;
      console.log('user from Authentication DB', user);
      const accessToken = user.accessToken;
      /*Need to query employee DB to make sure this email existed*/
      const q = query(collection(db, "employees"), where("email", "==", data.email));
      /********************************************************************************************/
      /* If we want to use await function like below, need to have asyn function for parent function as:
      .then( async (userCredential) => { */
      /*
      try {
        const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        })} catch (e ){
          console.log("Error getting cached document:", e);
      };
      */
      /********************************************************************************************/
      getDocs(q)
      .then((querySnapshot) => {
        //console.log("querySnapshot", querySnapshot);
        var id = ""; var data = {};
        querySnapshot.forEach((doc) => {
          id = doc.id; data = doc.data();
          //console.log("doc", doc);
        });
        //console.log("id", id);
        if(id === "") {
          console.log("You are not an employee.");
          setError({...error, status: true, message: "You are not an employee!"});
        }
        else {
          //console.log("your data infor", data);
          const userData = {
            ...data,
            accessToken: accessToken,
            id: id,
          };
          console.log("employee Data", userData);
          /*Dispatch employee data here then navigate*/
          navitage("/");
        }
      }).catch((error) => {
        setError({...error, status: true, message: "Coundn't get document from customer's DB!"});
      });
    })
    .catch((err) => {
      const messageError = extractErrorMessage(err);
      setError({...error, status: true, message: messageError});
      //console.log("error", error);
    });
  }
  /******************END*******************/

  return (
    <ThemeProvider theme={theme}>
      <div className='bg_signin'/>
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Employee Sign in
          </Typography>
          {successGoogleLogin.status && <p style={{color:'green',border:'1px solid green' }}>{successGoogleLogin.message}</p> && <p>{ navitage("/")} </p>}
          <Box component="form" onSubmit={handleSubmit(handleLogin)} sx={{ mt: 1 }}>
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
              onChange={handleChange}
            />
            {errors.email && <p style={{color:'red'}}>Please check the Email</p>}
            <TextField 
              margin="normal"
              label="Password"
              defaultValue={loginObject.password}
              required
              fullWidth
              name="password"
              variant="outlined"
              type={values.showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              {...register("password", { 
                required: true,  
              })}
              onInput={handleChange /*Used onInput to get rid out of autofilling problem that tricks the web still consider the input as a empty field*/}
              InputProps={{
                endAdornment:
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }}
            />
            {errors.password && <p style={{color:'red'}}>Please check the Password</p>}
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}> 
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              {values.clicked && error.status && loginObject.email.length !== 0 && loginObject.password.length !== 0 && <p style={{color:'red',border:'1px solid red' }}>{error.message}</p>}
            </div>
            <Grid container>
              <Grid item xs>
                <Link to='/forgotPassword' variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item xs style={{color: 'purple'}}>
                <span>Ask Admin for an account.</span>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 4, mb: 4 }} />
      </Container>
    </ThemeProvider>
  )
}

export default EmployeeSignIn;
