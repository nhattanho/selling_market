import React from 'react';
import Navbar from '../../components/Dashboard_Components/Navbar/Navbar.jsx';
import Sidebar from '../../components/Dashboard_Components/Sidebar/Sidebar.jsx';
import Widget from "../../components/Dashboard_Components/Widget/Widget.jsx";
import Featured from "../../components/Dashboard_Components/Featured/Featured.jsx";
import Chart from "../../components/Dashboard_Components/Chart/Chart.jsx";
import Table from "../../components/Dashboard_Components/Table/Table.jsx";
import "./Dashboard.scss";

const Dashboard = () => {
  return (
    <div className="home_dashboard">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="user" />
          <Widget type="order" />
          <Widget type="earning" />
          <Widget type="balance" />
        </div>
        <div className="charts">
          <Featured />
          <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
        </div>
        <div className="listContainer">
          <div className="listTitle">Latest Transactions</div>
          <Table />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
