import "./DataTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "./datatablesource.js";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { db } from "../../../firebase";
import { getDocs, collection, query, where, orderBy, limit } from "firebase/firestore";
import { getusersAction } from "../../../Redux/actions/user_action";

const Datatable = () => {
  const dispatch = useDispatch();
  /*Whenever there has something change or some action related to state
  even it doesn't change the value, it will make the useEffect run again
  if the dependent array including state variable like [state]);*/
  const state = useSelector((state) => state.UserReducer);
  console.log("Data table", state);
  const arrayusers = state.arrayusers;
  const getuserfromdb = state.getuserfromdb;
  console.log(getuserfromdb);
  //   const handleDelete = (id) => {
  //     setData(data.filter((item) => item.id !== id));
  //   };

  useEffect(() => {
    /*Prevent requesting data many times for admin user,
    any action relating to  user like delete, add, update,...
    we are not only update the DB but also for the state of
    the global store - Login for a long time, admin shoud
    logout and login again to get the lastest employee information*/
    //console.log("into userEffect", getuserfromdb);
    if(!getuserfromdb){
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

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to="/users/test" style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
        
      <div className="datatableTitle">
        Add New User
        <Link to="/users/new" className="link">
          Add New
        </Link>
      </div>

      <DataGrid
        className="datagrid"
        rows={arrayusers}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default Datatable;