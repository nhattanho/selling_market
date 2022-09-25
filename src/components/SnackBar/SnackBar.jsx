import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { 
    FormControl, 
    InputLabel, 
    Input, 
    Snackbar, 
    SnackbarContent 
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { LOADING, LOGIN_AGAIN } from '../../utils/globalVariable';
/*They way to get value from the Child back to Parent Component*/
/*https://stackoverflow.com/questions/38394015/how-to-pass-data-from-child-component-to-its-parent-in-reactjs*/
const SnackBarModify = (props) => {
    const navigate = useNavigate();
    const {error, message} = props.status;

    const [status, setStatusChild] = useState({error: error, message: message});
    
    const errorClose = () => {
        if(status.message === LOGIN_AGAIN) 
            navigate('/signin')
        setStatusChild({error: false, message: ""});
        props.getbackdatafromSnackBar({error: false, message: ""});
    };

    const successClose = () =>{
        console.log("success close");
        setStatusChild({error: !status.error, message: ""});
        props.getbackdatafromSnackBar({error: false, message: ""});
    }

    const handleLoading = () =>{
        console.log("success loading");
        setStatusChild({error: !status.error, message: ""});
        props.getbackdatafromSnackBar({error: false, message: ""});
    };

    return (
        <div>
        {status.error ? (
            <Snackbar
            variant= "error"
            key={status.message}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={status.error}
            onClose={errorClose}
            autoHideDuration={4000}
            >
                <SnackbarContent
                    message={
                        <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                            <span style={{ marginRight: "8px" }}>
                                <ErrorIcon fontSize="large" color="error" />
                            </span>
                            <span> {status.message} </span>
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
        ):(
            <Snackbar
              variant="success"
              key={status.message}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={!status.error}
              onClose={status.message===LOADING? handleLoading : successClose}
              autoHideDuration={4000}
            >
            <SnackbarContent
                message={
                    <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                        <span style={{ marginRight: "8px" }}>
                            <CheckCircleOutlineIcon fontSize="large" color="success" />
                        </span>
                        <span> {status.message} </span>
                    </div>
                }
                action={[
                    <IconButton
                        key="close"
                        aria-label="close"
                        onClick={status.message===LOADING? handleLoading : successClose}
                    >
                        <CloseIcon color="secondary" />
                    </IconButton>
                ]}
            />
          </Snackbar>
        )} 
        </div> 
    )
};

export default SnackBarModify;


