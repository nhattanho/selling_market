import "./DataTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "./datatablesource.js";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "../../../firebase";
import { getDocs, collection, query, 
where, orderBy, limit, doc, deleteDoc } 
from "firebase/firestore";
import { getAuth, deleteUser, EmailAuthProvider, reauthenticateWithCredential} from "firebase/auth";
import { getusersAction } from "../../../Redux/actions/user_action";
import { deleteUserForAdmin } from "../../../Redux/actions/user_action";
import { extractErrorMessage } from "../../../utils/extract_function";
import SnackBarModify from '../../SnackBar/SnackBar.jsx';
import { signInWithEmailAndPassword } from "firebase/auth";
import { LOADING, DELETED_SUCCESS, DELETED_FAIL } from "../../../utils/globalVariable";

const Datatable = () => {
  const dispatch = useDispatch();
  /*Whenever there has something change or some action related to state
  even it doesn't change the value, it will make the useEffect run again
  if the dependent array including state variable like [state]);*/
  const state = useSelector((state) => state.UserReducer);
  const dataLogin = useSelector((state) => state.AuthReducer.userLoginData);
  const title = dataLogin.title.toLowerCase();
  const arrayusers = state.arrayusers;

  var AdminManagerlookupuser = [];
  switch(title){
    case "admin":
      AdminManagerlookupuser = 
        arrayusers.filter(user =>{
          return user && user.title.toLowerCase() !== "admin"
        });
      break;
    case "manager":
      AdminManagerlookupuser = 
        arrayusers.filter(user =>{
          return (user && 
                  user.title.toLowerCase() !== "admin" &&
                  user.title.toLowerCase() !== "manager")
        });
      break;
      default:
        AdminManagerlookupuser = arrayusers;
  }

  var exceptAdminUsers = [];
  if(title === "manager"){
    exceptAdminUsers = arrayusers.filter(user =>{
      return user && user.title.toLowerCase() !== "admin"
    });
  }
  //console.log("Data table", state);
  const havegetuserfromdb = state.havegetuserfromdb;
  console.log("havegetuserfromdb", havegetuserfromdb);

  const [status, setStatus] = useState({error: false, message: ""});

  useEffect(() => {
    console.log("in effect data table");
    /*Prevent requesting data many times for admin user,
    any action relating to  user like delete, add, update,...
    we are not only update the DB but also for the state of
    the global store - Login for a long time, admin shoud
    logout and login again to get the lastest employee information*/
    //console.log("into userEffect", getuserfromdb);
    if(!havegetuserfromdb){
      console.log("fetching data");
      const q = query(collection(db, "employees"), orderBy("timeStamp"), limit(100));
      getDocs(q).then((querySnapshot) => {
        var id = ""; 
        var users = [];
        var data = {};
        querySnapshot.forEach((doc) => {
          id = doc.id; 
          data = doc.data();
          if(!data.hasOwnProperty('id')
          || data.id === "") {
            data.id = id;
          };
          users.push(data);
        });
        console.log("users in DataTable component", users);
        /*Dispatch users here*/
        dispatch(getusersAction(users));
      }).catch(err => {
        console.log("err", err);
      });
    }
  },[]);

  const handleDelete = (e, id) => {
    e.preventDefault();
    //console.log("id", id);
    //console.log("new array", newarrayusers);
    setStatus({error: false, message: LOADING});
    try {
      /*Delete account in Auth DB*/
      const getDeleteUser = arrayusers.find(user => {
        return user && user.id === id;
      });
      //console.log("get delete user", getDeleteUser.email);
      
      /* This code just delete for current Auth User, not for the other one
      const authCredential = EmailAuthProvider.credential(getDeleteUser.email, getDeleteUser.password);
      console.log("credential", authCredential);
      const preAuth = auth.currentUser;
      const result = await reauthenticateWithCredential(
        auth.currentUser,
        authCredential
      )
      console.log("result.user", result.user);
      await deleteUser(result.user)
      ****************************************************************/

      /*Reference: https://stackoverflow.com/questions/38800414/delete-a-specific-user-from-firebase*/
      const auth2 = getAuth();
      const authCredential = EmailAuthProvider.credential(getDeleteUser.email, getDeleteUser.password);
      signInWithEmailAndPassword(auth2, getDeleteUser.email, getDeleteUser.password)
      .then(async()=>{
        try {
          const userInFirebaseAuth = auth2.currentUser;
          const result = await reauthenticateWithCredential(
          userInFirebaseAuth,
          authCredential,
          );
          console.log("waiting for deleting Auth DB");
          await deleteUser(result.user);
          console.log("Deleted Auth DB");
          /*Deleted from Firestore DB*/
          await deleteDoc(doc(db, "employees", id));
          const newarrayusers = arrayusers.filter(user => user.id !== id);
          dispatch(deleteUserForAdmin(newarrayusers));
          setStatus({error: false, message: DELETED_SUCCESS});
        } catch(err){
          console.log("err",err);
          var errorMessage = extractErrorMessage(err);
          errorMessage = errorMessage==="" ? DELETED_FAIL : errorMessage;
          setStatus({error:true, message: errorMessage});
        } 
      })
      .catch((err)=>{
        console.log("fail in signin",err);
        var errorMessage = extractErrorMessage(err);
        errorMessage = errorMessage==="" ? "Deleted Fail" : errorMessage;
        console.log("err",err);
        setStatus({error:true, message: errorMessage});
      })
    } catch (err) {
      var errorMessage = extractErrorMessage(err);
      errorMessage = errorMessage==="" ? DELETED_FAIL : errorMessage;
      console.log("err",err);
      setStatus({error:true, message: errorMessage});
    }
  }

  // const handleDatafromChild = () => {
  //   setStatus({error: false, message: ""})
  // };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/users/${params.row.id}`} 
              state={{ SingledataUser: params.row}}
              style={{ textDecoration: "none" }}
            >
                <div className="viewButton">View</div>
            </Link>
            <button 
              style={{ textDecoration: "none" }}
              disabled={status.message===LOADING}
              onClick={e => {handleDelete(e, params.row.id)}}>
            <div
              className="deleteButton"
            >
                Delete   
            </div>
            </button>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
        
      <div className="datatableTitle">
        Add New User
        <Link to="/users/new" 
          className="link">
          Add New
        </Link>
      </div>

      <DataGrid
        className="datagrid"
        rows={AdminManagerlookupuser}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
      {status.error ? <SnackBarModify getbackdatafromSnackBar={(status) => setStatus(status)} status={status}/> : null}
      {(!status.error && status.message=== DELETED_SUCCESS) ? <SnackBarModify getbackdatafromSnackBar={(status) => setStatus(status)} status={status}/> : null}
      {(!status.error && status.message === LOADING) ? <SnackBarModify getbackdatafromSnackBar={(status) => setStatus(status)} status={status}/> : null}
    </div>
  );
};

export default Datatable;