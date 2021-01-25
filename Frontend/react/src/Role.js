import { Table, Button, Typography } from 'antd';
import {useState} from 'react';
import {
  useHistory
} from "react-router-dom";
import { unmountComponentAtNode } from 'react-dom';

import logo from './logo.svg';

// import './App.css';
import 'antd/dist/antd.css';

const { Column, ColumnGroup } = Table;
function Role() {
    const { Title } = Typography;
    const history = useHistory();
    const dataSource = [
        {
            key: '1',
            username: 'Mike',
            email: "blah@oregonstate.edu",
            edit: 
            <div>
              <Button 
                onClick={()=>{history.push("/Sessions/:1")}}
              >
                Sessions
              </Button>
              <Button 
                onClick={()=>{history.push("/Roles/:1")}}
              >
                Roles
              </Button>
              <Button 
                onClick={()=>{history.push("/Actions/:1")}}
              >
                Available Actions
              </Button>
              <Button 
                onClick={()=>{history.push("/Credentials/:1")}}
              >
                Credentials
              </Button>
              </div>
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
        <Title style={{margin:"auto", width:"fit-content"}}>Roles</Title>
        <Table style={{width:"auto"}} dataSource={dataSource}>
            <Column title="Username" dataIndex="username" key="username" />
            <Column title="Email" dataIndex="email" key="email" />
            <Column title="Action" dataIndex="edit" key="edit" />
        </Table>;
      </div>
    );
}

export default Role;
