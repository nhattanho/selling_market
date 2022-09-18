import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import TableList from '../Table/Table';
import Chart from '../Chart/Chart';
import './SingleUser.scss';
import avatar from '../../../utils/assets/random_avatar_images.png';

const SingleUser = () => {
  const location = useLocation();
  const data = location.state.SingledataUser;
  //console.log("data in single user",data);
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton">
              {/*If we put users/update, this will concat the link, ex:users/:id/users/update*/}
              <Link to="/users/update" state={{SingledataUser: data}}>Edit</Link>
            </div>
            <h1 className="title">Information</h1>
            <div className="item">
              <img
                src={(data.avatarurl.trim().length === 0 || data.avatarurl === "")?avatar:data.avatarurl}
                alt="avatar"
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">{data.fullname.length !== 0 ? data.fullname : data.username}</h1>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{data.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Title:</span>
                  <span className="itemValue">{data.title}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">{data.phonenumber}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Address:</span>
                  <span className="itemValue">
                    {data.address}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Country:</span>
                  <span className="itemValue">{data.country}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Status:</span>
                  <span className="itemValue">{data.status}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Joined at:</span>
                  {/* {console.log(data.timeStamp)} */}
                  <span className="itemValue">{data.timeStamp.hasOwnProperty('seconds')?((new Date(data.timeStamp.seconds*1000)).toString()):data.timeStamp.toString()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
          </div>
        </div>
        <div className="bottom">
        <h1 className="title">Last Transactions</h1>
          <TableList/>
        </div>
      </div>
    </div>
  );
}

export default SingleUser;