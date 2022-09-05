import React from 'react';
import { useState } from 'react';
import {auth} from '../../firebase.js';
import {signInWithEmailAndPassword} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import './Signin.css';
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
import InputLabel from '@mui/material/InputLabel';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import OutlinedInput from '@mui/material/OutlinedInput';

import { connectFirestoreEmulator } from 'firebase/firestore';
/*pattern for password: pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/ */
/*https://www.freecodecamp.org/news/add-form-validation-in-react-app-with-react-hook-form/*/

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" to='/'>
        Back to Home
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const SignIn = () => {
  const theme = createTheme();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState(false);
  const [loginObject, setLoginObject] = useState({
    email: '',
    password: '',
  });
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const navitage = useNavigate()

  const handleChange = (e) => {
    setLoginObject(loginObject => ({
      ...loginObject,
      [e.target.name]: e.target.value,
    }))
  };

  const handleLogin = (data) =>{
    console.log(loginObject);
    signInWithEmailAndPassword(auth, data.email, data.password)
    .then((userCredential) => {
    const user = userCredential.user;
    navitage("/")
    // console.log(user);
    })
    .catch((error) => {
      setError(true);
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <div className='bg'>
      </div>
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
              onChange={handleChange}
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
              {error && loginObject.email.length !== 0 && loginObject.password.length !== 0 && <p style={{color:'red',border:'1px solid red' }}>Wrong email or password</p>}
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
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  )
}

export default SignIn;
