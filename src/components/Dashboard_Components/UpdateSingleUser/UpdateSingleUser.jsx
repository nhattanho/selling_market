import React, {useState, useEffect} from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import { UPDATED_SUCCESS, LOADING, UPDATED_DB_FAIL } from '../../../utils/globalVariable';
import { extractErrorMessage } from '../../../utils/extract_function';
import { db, auth, storage } from '../../../firebase';
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import SnackBarModify from '../../SnackBar/SnackBar';
import { doc, updateDoc } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { updateSingleUser } from '../../../Redux/actions/user_action';
import avatar from "../../../utils/assets/random_avatar_images.png";
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
            const updateRef = doc(db, "employees", data.id);
            changedProps.forEach((prop, index)=>{
                updatedObject[prop] = data[prop];
            });
            try {
                /*Update Authentication password*/

                //console.log(updatedObject);
                await updateDoc(updateRef, {
                ...updatedObject,});
                 /*Update global state*/
                updatedObject = {
                    ...updatedObject,
                    id: data.id,
                }
                dispatch(updateSingleUser(updatedObject));
                //console.log("passed dispatch");
                /*Navigate to Single user*/
                setStatus({error: false, message: UPDATED_SUCCESS});
            }catch(err){
                setStatus({error: true, message: UPDATED_DB_FAIL});
            }  
        }
        navigate(`/users/${data.id}`, {state: {SingledataUser: data}});
    };

    useEffect(() => {
        const uploadFile = () => {
        const name = new Date().getTime() + file.name;
        console.log(name);
        const storageRef = ref(storage, `avatar/employees/${file.name}`);
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

                            {inputs.map((input) => (
                                <div className="formInput" key={input.id}>
                                <label>{input.label}</label>
                                {input.type!=="password"?(
                                    <input 
                                        value={data[input.name]} 
                                        name={input.name} 
                                        type={input.type} 
                                        onInput={handleChange} 
                                        disabled={input.type==="mail"?true:false}
                                    />
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