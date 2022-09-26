import React, { useState, useEffect } from 'react'
import {Link} from 'react-router-dom';

import { useSelector, useDispatch } from "react-redux";
import { loginAction } from '../../Redux/actions/auth_action';

import { db, storage } from '../../firebase';
import { getAuth, updatePassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

import Navbar from '../Dashboard_Components/Navbar/Navbar';
import Sidebar from '../Dashboard_Components/Sidebar/Sidebar';

import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { 
  UPDATED_SUCCESS,
  LOADING,
  UPDATED_DB_FAIL,
  UPDATE_PASSWORD_FAIL,
  NOTHING_CHANGED,
  EMPLOYEE,
  TITLE,
  STATUS,
  PROFESSIONAL,
  REQUIRE_RECENT_LOGIN,
  LOGIN_AGAIN,
  MANAGER,
  ADMIN,
  MAIL,
  USERNAME,
  PASSWORD_AT_LEAST_SIX_CHARACTERS,
  PASSWORD,
  EMPLOYEES,
} from '../../utils/globalVariable';
import avatar from '../../utils/assets/random_avatar_images.png';
import { extractErrorMessage } from '../../utils/extract_function';
import SnackBarModify from '../SnackBar/SnackBar';
import { DropdownButtonForUpdateUser } from '../DropdownButton/DropdownButton';

import './Account.scss';

const Account = ({inputs, title}) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const dispatch = useDispatch();
  const state = useSelector((state) => state.AuthReducer);
  const preData = state.hasOwnProperty('userLoginData') ? state.userLoginData : {};
  const [data, setUserData] = useState(preData);
  //console.log("data in account",data);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({error: false, message: ""});
  const [per, setPerc] = useState(null);
  const [file, setFile] = useState("");

  const handleChange = (e) => {
    setUserData({
      ...data,
      [e.target.name]: e.target.value,
    })
  };

  const handleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const uploadFile = () => {
    const name = new Date().getTime() + file.name;
    //console.log(name);
    const storageRef = ref(storage, `avatar/employees/${data.id}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
          setStatus({error: true, message: messageError});
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUserData((prev) => ({ ...prev, avatarurl: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(data.password.length < 6) setStatus({error: true, message: PASSWORD_AT_LEAST_SIX_CHARACTERS});
    else {
      setStatus({error: false, message: LOADING});
      /*Update firestore DB*/
      const changedProps = [];
      var updatedObject = {};
      var passwordChanged = false;
      Object.keys(preData).forEach((prop)=> {
          if(data.hasOwnProperty(prop)){
              if(data[prop] !== preData[prop]){
                  console.log("prop", prop);
                  if(prop.toString() === PASSWORD) passwordChanged = true;
                  changedProps.push(prop);
              }      
          }
      });
      if(changedProps.length !== 0){
        changedProps.forEach((prop, index)=>{
          updatedObject[prop] = data[prop];
        });
        const updateRef = doc(db, EMPLOYEES, data.id);
        if(passwordChanged){
          /*Update Authentication password*/
          updatePassword(user, data.password).then(async () => {
            try {
              /*Actual Updated firestore DB*/
              console.log("update firestore DB");
              await updateDoc(updateRef, {...updatedObject,});
              updatedObject = {
                ...data,
              };
              /*Update global state*/
              dispatch(loginAction(updatedObject));
              setStatus({error: false, message: UPDATED_SUCCESS});
            }catch(err) {
              setStatus({error: true, message: UPDATED_DB_FAIL});
            }
          }).catch(err=> {
            console.log("err", err);
            if(err.toString().includes(REQUIRE_RECENT_LOGIN)){
              setStatus({error: true, message: LOGIN_AGAIN});
            } else setStatus({error: true, message: UPDATE_PASSWORD_FAIL});
          });
        }else{
          try {
            /*Actual Updated firestore DB*/
            //console.log("update firestore DB");
            await updateDoc(updateRef, {...updatedObject,});
            updatedObject = {
              ...data,
            };
            /*Update global state*/
            dispatch(loginAction(updatedObject));
            setStatus({error: false, message: UPDATED_SUCCESS});
          }catch(err) {
            setStatus({error: true, message: UPDATED_DB_FAIL});
          }
        }
      }else {
        //console.log("Nothing changed!");
        setStatus({error: false, message: NOTHING_CHANGED});
      }
    }
  }

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
                  : data.avatarurl ? data.avatarurl :
                  avatar
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
                    {input.type!=="password"?(
                      (data.title.toLowerCase() === MANAGER 
                      || data.title.toLowerCase() === ADMIN)?
                      (
                        (input.options.length !== 0 ? (
                          <DropdownButtonForUpdateUser 
                            value={data[input.name]} 
                            name={input.name} 
                            options={input.options} 
                            onChange={handleChange}
                          />
                        ):(
                          <input 
                            value={data[input.name]} 
                            name={input.name} 
                            type={input.type} 
                            onInput={handleChange} 
                          />
                        ))
                      ):
                      (
                        <input 
                          value={data[input.name]} 
                          name={input.name} 
                          type={input.type} 
                          onInput={handleChange} 
                          disabled={(
                            (data.title === EMPLOYEE &&
                            (input.name === TITLE ||
                            input.name === STATUS ||
                            input.name === PROFESSIONAL)) ||
                            input.type=== MAIL || 
                            input.name=== USERNAME)
                            ?true:false}
                        />
                      )
                    ):
                    (
                      <div className='showpassword'>
                          <input value={data[input.name]} name={input.name} type={showPassword ? "text" : "password"} onInput={handleChange}/>
                          <button onClick={(e) => {handleShowPassword(e)}}>
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                          </button>
                      </div>
                    )}
                  </div>
                ))}
                <button disabled={per !== null && per < 100} type="submit">
                    Update
                </button>
            </form>
          </div>
          </div>
          {status.error ? (
              <SnackBarModify getbackdatafromSnackBar={(status) => setStatus(status)} status={status}/>
          ) : null}
          {!status.error&& (
            status.message === UPDATED_SUCCESS 
            || status.message === NOTHING_CHANGED) ? (
              <SnackBarModify getbackdatafromSnackBar={(status) => setStatus(status)} status={status}/>
          ) : null}
          {!status.error && status.message === LOADING ? (
              <SnackBarModify getbackdatafromSnackBar={(status) => setStatus(status)} status={status}/>
          ) : null}
        </div>
      </div>
  )
}

export default Account;
