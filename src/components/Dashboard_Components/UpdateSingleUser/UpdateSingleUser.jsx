import React, {useState, useEffect} from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from "react-redux";
import { updateSingleUser } from '../../../Redux/actions/user_action';

import { db, auth, storage } from '../../../firebase';
import { updatePassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';

import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { 
    UPDATED_SUCCESS, 
    LOADING, 
    UPDATED_DB_FAIL,
    NOTHING_CHANGED, 
} 
from '../../../utils/globalVariable';
import { extractErrorMessage } from '../../../utils/extract_function';
import avatar from "../../../utils/assets/random_avatar_images.png";
import SnackBarModify from '../../SnackBar/SnackBar';

import './UpdateSingleUser.scss';

const UpdateSingleUser = ({inputs, title}) =>{
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [per, setPerc] = useState(null);
    const [file, setFile] = useState("");
    const location = useLocation();
    const preData = location.state.SingledataUser;
    const [data, setUpdateData] = useState(location.state.SingledataUser);
    const [status, setStatus] = useState({error: false, message: ""});

    const handleChange = (e) => {
        setUpdateData({
          ...data,
          [e.target.name]: e.target.value,
        })
      };

    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(data.password.length < 6) setStatus({error: true, message: "Password has at least 6 characters!"});
        else {
            setStatus({error: false, message: LOADING});
            /*Update firestore DB*/
            const changedProps = [];
            var updatedObject = {};
            var passwordChanged = false;
            Object.keys(preData).forEach((prop)=> {
                if(data.hasOwnProperty(prop)){
                    if(data[prop] !== preData[prop]){
                        if(prop === "password") passwordChanged = true;
                        changedProps.push(prop);
                    }      
                }
            });
            if(changedProps.length !== 0){
                changedProps.forEach((prop, index)=>{
                    updatedObject[prop] = data[prop];
                });
                const updateRef = doc(db, "employees", data.id);
                /*Update Authentication password*/
                try {
                    /*Actual Updated firestore DB*/
                    console.log("update firestore DB");
                    await updateDoc(updateRef, {...updatedObject,});
                    updatedObject = {
                    ...updatedObject,
                    id: data.id,
                    };
                    /*Update global state*/
                    dispatch(updateSingleUser(updatedObject));
                    setStatus({error: false, message: UPDATED_SUCCESS});
                    navigate(`/users/${data.id}`, {state: {SingledataUser: data}});
                }catch(err) {
                    setStatus({error: true, message: UPDATED_DB_FAIL});
                }   
            }else {
                console.log("Nothing changed!");
                setStatus({error: false, message: NOTHING_CHANGED});
            }
        }
    };

    useEffect(() => {
        const uploadFile = () => {
        const name = new Date().getTime() + file.name;
        console.log(name);
        const storageRef = ref(storage, `avatar/employees/${data.id}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
    
        uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              setPerc(progress);
              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
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
                setUpdateData((prev) => ({ ...prev, avatarurl: downloadURL }));
              });
            }
          );
        };
        file && uploadFile();
    }, [file]);

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

                            {inputs.map((ip) => (
                                <div className="formInput" key={ip.id}>
                                    <label>{ ip.label}</label>
                                    <input 
                                        value={data[ip.name]} 
                                        name={ip.name} 
                                        type={ip.type} 
                                        onInput={handleChange} 
                                        disabled={(ip.type === "password" || ip.type==="mail" || ip.name==="username")?true:false}
                                    />
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
                {!status.error&& status.message === UPDATED_SUCCESS ? (
                    <SnackBarModify getbackdatafromSnackBar={(status) => setStatus(status)} status={status}/>
                ) : null}
                {!status.error && status.message === LOADING ? (
                    <SnackBarModify getbackdatafromSnackBar={(status) => setStatus(status)} status={status}/>
                ) : null}
            </div>
        </div>
    );
};

export default UpdateSingleUser;