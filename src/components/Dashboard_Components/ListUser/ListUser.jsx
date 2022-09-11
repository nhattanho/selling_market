import "./ListUser.scss"
import Sidebar from "../Sidebar/Sidebar";
import Navbar from '../Navbar/Navbar.jsx';
import Datatable from "../DataTable/DataTable.jsx";

const ListUser = () => {
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <Datatable/>
      </div>
    </div>
  )
}

export default ListUser;