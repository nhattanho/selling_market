import React, {useState, useEffect} from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import { addNewUser } from '../../../Redux/actions/user_action';
import { useSelector, useDispatch } from "react-redux";

import IconButton from '@mui/material/IconButton';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { FormControl, InputLabel, Input, Snackbar, SnackbarContent } from '@mui/material';
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


import {addDoc,collection,doc,serverTimestamp,setDoc,} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, db, storage} from '../../../firebase.js';

import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import {DropdownButton} from '../../DropdownButton/DropdownButton';
import { extractErrorMessage } from '../../../utils/extract_function';
import {getAuth} from "firebase/auth"; 
import { ADDED_SUCCESS, LOADING } from '../../../utils/globalVariable';
import './NewUser.scss';

const NewUser = ({ inputs, title }) => {
  //console.log("go to new user component");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [per, setPerc] = useState(null);
  const [file, setFile] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({
    status: false,
    message: "",
  });
  const [newUserData, setNewUserData] = useState({
    email: "",
    fullname: "",
    username:"",
    password:"",
    avatarurl:"",
    address:"",
    status:"",
    phonenumber:"",
    country:"",
    title: "",
    professional: "",
    /*accessToken, timeStamp, id*/
  });
/*Funtions for Snackbars*/
const errorClose = () => {
  setError({status: false, message:""});
};

const successClose = () => {
  if(error.message === ADDED_SUCCESS){
    setError({status: false, message: ""});
    navigate(`/users/${newUserData.id}`, {state: {SingledataUser: newUserData}});
  }
};
/**************************************/

  const handleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    //console.log("goto handle change");
    setNewUserData({
      ...newUserData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    //console.log(newUserData);
    e.preventDefault();
    setError({status: false, message: LOADING});
    //console.log("new user data", newUserData);
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        newUserData.email,
        newUserData.password
      );
      let myDate = new Date();
      let myDateTemp = new Date(myDate);
      //console.log(myDate);

      var updateData = {
        ...newUserData,
        timeStamp: myDateTemp,
        id: res.user.uid,
        accessToken: res.user.accessToken,
      };

      if(file){
        const name = new Date().getTime() + file.name;
        //console.log(name);
        const storageRef = ref(storage, `avatar/employees/${res.user.uid}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        var progress = 0;
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            //console.log("Upload is " + progress + "% done");
            setPerc(progress);
            switch (snapshot.state) {
              case "paused":
                //console.log("Upload is paused");
                break;
              case "running":
                //console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            //console.log(error);
            const messageError = extractErrorMessage(error);
            setError({status: true, message: messageError});
          },
          async () => {
            //console.log("percentage", progress);
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            updateData.avatarurl = downloadURL;
            // getDownloadURL(uploadTask.snapshot.ref)
            // .then(async (downloadURL) => {
            //   setNewUserData((prev) => ({ ...prev, avatarurl: downloadURL }));
            // });
            //console.log("updateNewUser", updateNewUserData);
            await setDoc(doc(db, "employees", res.user.uid), updateData);
            //console.log("dispatch here");
            updateData.timeStamp = myDateTemp.toString();
            dispatch(addNewUser(updateData));
            setNewUserData(updateData);
            setError({status: false, message: ADDED_SUCCESS});
            //navigate(`/users/${updateNewUserData.id}`, {state: {SingledataUser: updateNewUserData}});
          }
        );
      }else{
        //console.log("updateNewUser", updateNewUserData);
        await setDoc(doc(db, "employees", res.user.uid), updateData);
        //console.log("dispatch here");
        updateData.timeStamp = myDateTemp.toString();
        dispatch(addNewUser(updateData));
        setNewUserData(updateData);
        setError({status: false, message: ADDED_SUCCESS});
        //navigate(`/users/${updateNewUserData.id}`, {state: {SingledataUser: updateNewUserData}});
      }
    } catch (err) {
      //console.log(err);
      const messageError = extractErrorMessage(err);
      setError({status: true, message: messageError});
    }
  };

  // useEffect(() => {
    // const uploadFile = () => {
    //   const name = new Date().getTime() + file.name;
    //   console.log(name);
    //   const storageRef = ref(storage, `avatar/employees/${file.name}`);
    //   const uploadTask = uploadBytesResumable(storageRef, file);

    //   uploadTask.on(
    //     "state_changed",
    //     (snapshot) => {
    //       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //       console.log("Upload is " + progress + "% done");
    //       setPerc(progress);
    //       switch (snapshot.state) {
    //         case "paused":
    //           console.log("Upload is paused");
    //           break;
    //         case "running":
    //           console.log("Upload is running");
    //           break;
    //         default:
    //           break;
    //       }
    //     },
    //     (error) => {
    //       //console.log(error);
    //       const messageError = extractErrorMessage(error);
    //       setError({status: true, message: messageError});
    //     },
    //     () => {
    //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //         setNewUserData((prev) => ({ ...prev, avatarurl: downloadURL }));
    //       });
    //     }
    //   );
    // };
  //   file && uploadFile();
  // }, [file]);

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form onSubmit={handleSubmit}>

              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  {(input.type!=="password" && input.options.length === 0)?(
                    <input 
                      name={input.name} 
                      type={input.type} 
                      onInput={handleChange} 
                      placeholder={input.placeholder} 
                    />  
                  ):(
                    (input.type!=="password" && input.options.length !== 0)?(
                      <DropdownButton 
                        value={input.placeholder} 
                        name={input.name} 
                        options={input.options} 
                        onChange={handleChange}
                      />
                    ):(
                      <div className='showpassword'>
                        <input 
                          name={input.name} 
                          type={showPassword ? "text" : "password"} 
                          onInput={handleChange} 
                          placeholder={input.placeholder} 
                        />
                        <button onClick={(e) => {handleShowPassword(e)}}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </button>
                      </div>
                  ))}
                </div>
              ))}
              <button type="submit">
                Add
              </button>
            </form>
          </div>
        </div>
        {error.status ? (
          <Snackbar
              variant="error"
              key={error.message}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={error.status}
              onClose={errorClose}
              autoHideDuration={4000}
          >
            <SnackbarContent
                message={
                    <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                        <span style={{ marginRight: "8px" }}>
                            <ErrorIcon fontSize="large" color="error" />
                        </span>
                        <span> {error.message} </span>
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
        {!error.status && (error.message===LOADING) ? (
          <Snackbar
              variant="success"
              key={error.message}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={!error.status}
              onClose={successClose}
              autoHideDuration={5000}
          >
            <SnackbarContent
                message={
                    <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                        <span style={{ marginRight: "8px" }}>
                            <CheckCircleOutlineIcon fontSize="large" color="success" />
                        </span>
                        <span> {error.message} </span>
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
        {!error.status && (error.message === ADDED_SUCCESS) ? (
          <Snackbar
              variant="success"
              key={error.message}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={!error.status}
              onClose={successClose}
              autoHideDuration={5000}
          >
            <SnackbarContent
                message={
                    <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                        <span style={{ marginRight: "8px" }}>
                            <CheckCircleOutlineIcon fontSize="large" color="success" />
                        </span>
                        <span> {error.message} </span>
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
        ):(null)
        }
      </div>
    </div>
  );
};

export default NewUser;