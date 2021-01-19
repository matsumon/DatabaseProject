import { Table, Button } from 'antd';
import {useState} from 'react';
import {
  useHistory
} from "react-router-dom";
import { unmountComponentAtNode } from 'react-dom';

import logo from './logo.svg';

// import './App.css';
import 'antd/dist/antd.css';

const { Column, ColumnGroup } = Table;
function User() {
    const history = useHistory();
    const dataSource = [
        {
          key: '1',
          username: 'Mike',
          email: "blah@oregonstate.edu",
          edit: <div><Button>Edit</Button> <Button onClick={()=>{history.push("/editUser:User")}}>View History</Button></div>
        },
        {
          key: '2',
          username: 'John',
          email: "blah@gmail.com",
          edit: <div><Button>Edit</Button> <Button>View History</Button></div>
        },
      ];
      
  const [username, setUsername] = useState("");
  return (
      <div style={{ width: "100%", height: "100%" }}>
        <Table style={{width:"auto"}} dataSource={dataSource}>
            <Column title="Username" dataIndex="username" key="username" />
            <Column title="Email" dataIndex="email" key="email" />
            <Column title="Action" dataIndex="edit" key="edit" />
        </Table>;
      </div>
    );
}

export default User;
