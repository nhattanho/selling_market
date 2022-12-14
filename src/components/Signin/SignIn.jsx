import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useSelector, useDispatch } from "react-redux";
import {loginAction, logoutAction} from '../../Redux/actions/auth_action';

import {auth, provider, db} from '../../firebase.js';
import {
  signInWithEmailAndPassword, 
  getRedirectResult, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithRedirect, 
  fetchSignInMethodsForEmail } 
from "firebase/auth";

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
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { 
  connectFirestoreEmulator, 
  serverTimestamp, 
  doc, 
  setDoc } 
from 'firebase/firestore';
import { collection, query, where, getDocs } from "firebase/firestore";

import {extractErrorMessage} from '../../utils/extract_function';
import {GoogleIcon} from '../../utils/build_svg_icons';
import {Crossline} from '../../utils/crossline';
import { 
  BUYER, 
  CUSTOMERS, 
  EMAIL, 
  LOADING, 
  LOGIN_SUCCESS, 
  NEED_AN_ACCOUNT, 
  QUERY_DOC_FROM_DB_FAIL, 
  SAVED_DB_FAIL } from '../../utils/globalVariable';

import './Signin.css';

/*pattern for password: pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/ */
/*https://www.freecodecamp.org/news/add-form-validation-in-react-app-with-react-hook-form/*/

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright ?? '}
      <Link color="inherit" to='/'>
        Back to Home
      </Link>{' '}
      <Link color="inherit" to='/signinasemployee'>
        Employee Login
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const SignIn = () => {
  const theme = createTheme();
  const navitage = useNavigate();
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  //console.log("state is ", state);
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
    //console.log("login clicked",values.clicked);
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

  const handleLoginWithGoogle = async () => {
    setSuccessGoogleLogin({status: false, message: LOADING});
    setError({...error, status: false, message: ""});
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      //console.log("user",user);
      const user = result.user;
      const email = user.email;
      const username = email.split('@')[0];
      const uid = user.uid;
      const q = query(collection(db, CUSTOMERS), where(EMAIL, "==", email));
      //console.log("uid", uid);
      getDocs(q)
      .then((querySnapshot) => {
        var id = ""; 
        var data = {};
        querySnapshot.forEach((doc) => {
          id = doc.id; 
          data = doc.data();
        });
        if(id === "") {
          //console.log("empty");
          const userData = {
            email: email,
            username: username,
            password:"",
            title: BUYER,
            timeStamp: serverTimestamp(),
            accessToken: accessToken,
            id: uid,
          };
          setDoc(doc(db, CUSTOMERS, user.uid), userData).then(() => {
            //console.log("Login done! Going home page...");
            //console.log("write new email into DB");
            /* Dispatch user data here */
            //console.log("userData", userData);
            dispatch(loginAction(userData));
            //setError({...error, status: false, message: ""});
            setSuccessGoogleLogin(
              {...successGoogleLogin, 
                status: true, 
                message: LOGIN_SUCCESS,
            });
            navitage("/");
          })
          .catch((error) => {
              console.log(error);
              setSuccessGoogleLogin({
                  ...successGoogleLogin, 
                  status: false, 
                  message: SAVED_DB_FAIL,
              });
          });
        }
        else {
          /* Email has already existed so no need to write DB again */
          //console.log("Dont write new email into DB");
          const userData = {
            ...data,
          };
          dispatch(loginAction(userData));
          //console.log("userData by Google login", userData);
          //setError({...error, status: false, message: ""});
          setSuccessGoogleLogin({...successGoogleLogin, status: true, message: LOGIN_SUCCESS});
          navitage("/");
          /* Dispatch userData here */
          /* Testing for rewrite again for existed document ==> automatically 
          overwrite or removed the existed fields and update for the new fields
          following our actions*/
          /*
            const userData1 = {
              email: email,
              username: username,
              password:"",
              title: "buyer",
              timeStamp: serverTimestamp(),
              accessToken: accessToken,
              id: uid,
              test: "testing123",
              test1: "test second time"
            };
            setDoc(doc(db, "customers", user.uid), userData1).then(() => {
              //console.log("Login done! Going home page...");
              console.log("write new email into DB");
            })
            .catch((error) => {
                console.log(error);
                setError({...error, status: true, message: "Couldn't not save data in DB!"});
            });
            */
          /**************************************************/
        }
      }).catch((error) => {
          setSuccessGoogleLogin({
            ...successGoogleLogin, 
            status: false, 
            message: QUERY_DOC_FROM_DB_FAIL,
          });
        //setError({...error, status: false, message: ""});
      });
      
    }).catch((error) => {
      // Handle Errors example here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      const messageError = extractErrorMessage(error);
      setSuccessGoogleLogin({
        ...successGoogleLogin, 
        status: false, 
        message: messageError,
      });
      //setError({...error, status: false, message: ""});
    });
  }

  const handleLogin = (data) =>{
    //console.log("signin normal");
    setValues({ ...values, clicked: true});
    setError({...error, status: false, message: LOADING});
    var id = "";
    var userData = {};
    signInWithEmailAndPassword(auth, data.email, data.password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      //console.log('user', user);
      const accessToken = user.accessToken;
      /*Need to query customer DB to make sure this email existed and dispatch*/
      const q = query(collection(db, CUSTOMERS), where(EMAIL, "==", data.email));
      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          id = doc.id;
          userData = doc.data();
        });
        if(id === "") {
          //console.log("You need to create an account first!");
          setError({...error, status: true, message: NEED_AN_ACCOUNT});
        }
        else {
          //console.log('user data', userData);
          /* Dispatch user information here */
          dispatch(loginAction(userData));
          setError({...error, status: false, message: ""});
          navitage("/");
        }
      } catch (err){
        const messageError = extractErrorMessage(err);
        setError({...error, status: true, message: messageError});
      };
    })
    .catch((err) => {
      //console.log("error code", err);
      const messageError = extractErrorMessage(err);
      setError({...error, status: true, message: messageError});
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
            Sign in
          </Typography>
          {!successGoogleLogin.status && 
            successGoogleLogin.message === LOADING && 
            <p style={{color:'green',border:'1px solid green' }}>
              {successGoogleLogin.message}</p>}
          
          {!successGoogleLogin.status && 
            successGoogleLogin.message !== LOADING && 
            <p style={{color:'red',border:'1px solid green' }}>
            {successGoogleLogin.message}</p>}
          
          {!error.status && 
              error.message === LOADING && 
              <p style={{color:'green',border:'1px solid red' }}>{error.message}</p>}
              
          {values.clicked && 
            error.status && 
            loginObject.email.length !== 0 && 
            loginObject.password.length !== 0 && 
            <p style={{color:'red',border:'1px solid red' }}>{error.message}</p>}

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
              onInput={handleChange}
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
            </div>
            <Grid container>
              <Grid item xs>
                <Link to='/forgotPassword' variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to='/register' variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>

          <div style={{marginTop: '15px', display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%'}}>
            <Crossline color='gray' width='100%' marginLeft='0' marginRight='auto'/>
            <span>Or</span>
            <Crossline color='gray' width='100%' marginRight='0' marginLeft='auto'/>
          </div>
          
          <Button
                type="submit"
                variant="outlined"
                sx={{ mt: 2, mb: 2 }}
                onClick={handleLoginWithGoogle}
                size="small"
              >
                <div style={{alignItems: 'center', display: 'flex'}}><GoogleIcon /></div>
          </Button>
        </Box>
        <Copyright sx={{ mt: 4, mb: 4 }} />
      </Container>
    </ThemeProvider>
  )
}

export default SignIn;
