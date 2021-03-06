import {
  Table,
  Button,
  Typography,
  Input,
  Card,
  DatePicker,
  message,
} from "antd";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import moment from "moment";
import "antd/dist/antd.css";
import {url} from "./url.js"
const axios = require('axios');

function User() {
  const { Column } = Table;
  console.log("RENDER");
  const { Title } = Typography;
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [created, setCreated] = useState("");
  const [email, setEmail] = useState("");
  // State variable to trigger a re-render of component
  const [render, setRender] = useState(false);

  /**
   * This data is held in a state variable so that it wont reset every time the component
   * is re-rendered. This data represents the current state of data in sql
   */

  const [rawData, setRawData] = useState([
  ]);
let allUsersQuery = {
  "username":"test_user00",
  "token":"d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
  "operation_name":"GET_USRS"
}
 
if(rawData && rawData.length === 0){
  axios(
  {
  method: 'post',
  url: url,
  data: JSON.stringify(allUsersQuery)
})
.then(function (response) {
  console.log("AXIOS RESPONSE",response.data.Results);
  setRawData(response.data.Results);
})
.catch(function (error) {
  console.log("AXIOS RESPONSE",error);
});
}

  /**
   * This function creates the data packet for antd's table. Because
   * the table is having issues we have to set deleted rows to null.
   */
  function createDataSource() {
    return _.map(rawData, (object, index) => {
      return {
        key: index,
        id: object.id,
        username: object.username,
        created: object.created,
        email: object.email,
      };
    });
  }
  /**
   * This function adds users to the table.
   * Because react only does shallow checks on object, we have to manually
   * retrigger a render using the render state variable. This isn't
   * the best programming practice, but oh well.
   */
  function addUserToTable() {
    if (username === null || username.length === 0 || created.length === 0) {
      message.error("Username or Date was not filled out");
      return;
    }
    let tempRawData = rawData;
    let addUsersQuery = {
      "username":"test_user00",
      "token":"d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
      "operation_name":"ADD_USR",
      "task_data":{
        "username":username,
        "created":moment(created).format("YYYY-MM-DD HH:mm:ss"),
        "email":email ? email : null
      }
    }
    // Relationship - Implementing ADD users relationship
      axios(
      {
      method: 'post',
      url: url,
      data: JSON.stringify(addUsersQuery)
    })
    .then(function (response) {
      console.log("AXIOS RESPONSE",response.data);
     tempRawData.push({
      id: response.data.insertId,
      username: username,
      created: created,
      email: email,
    });
    console.log("tmepRawData",tempRawData)
    setRawData(tempRawData);
    setUsername("");
    setEmail("");
    setRender(!render);
    })
    .catch(function (error) {
      console.log("AXIOS RESPONSE",error);
      message.error(
        "User Already Exists"
      );
    });
  }
  let dataToBeUsed = [];
  dataToBeUsed = createDataSource();
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Card
        style={{ margin: "auto", width: "100%" }}
        title={
          <Title style={{ margin: "auto", width: "fit-content" }}>Users</Title>
        }
      >
        <p>
          Users can add users with a mandatory username, mandatory created date,
          and optional email
        </p>
        <p>
          Users can navigate to the session, role, action, and credential table.
        </p>
      </Card>
      <Button
        onClick={() => {
          history.push(`/Sessions`);
        }}
      >
        Sessions
      </Button>
      <Button
        onClick={() => {
          history.push(`/Roles`);
        }}
      >
        Roles
      </Button>
      <Button
        onClick={() => {
          history.push(`/Actions`);
        }}
      >
        Available Actions
      </Button>
      <Button
        onClick={() => {
          history.push(`/Credentials`);
        }}
      >
        Credentials
      </Button>
      <Table style={{ width: "auto" }} dataSource={dataToBeUsed}>
        <Column title="ID" dataIndex="id" key="id" />
        <Column title="Username" dataIndex="username" key="username" />
        <Column title="Created" dataIndex="created" key="created" />
        <Column title="Email" dataIndex="email" key="email" />
      </Table>
      <Card bordered style={{ width: 300 }}>
        <div style={{ marginBottom: "16px" }}>
          <Button size="large" onClick={addUserToTable}>
            Add User
          </Button>
        </div>
        <Button style={{ width: "35%" }} disabled>
          Username
        </Button>
        <Input
          style={{ width: "55%" }}
          placeholder="Username"
          value={username}
          onChange={(newValue) => {
            setUsername(newValue.currentTarget.value);
          }}
        />
        <Button style={{ width: "45%" }} disabled>
          Created Date
        </Button>
        <DatePicker
          style={{ width: "55%" }}
          placeholder="Created Date"
          onChange={(date, dateString) => {
            setCreated(dateString);
          }}
        />
        <Button style={{ width: "35%" }} disabled>
          Email
        </Button>
        <Input
          style={{ width: "65%" }}
          placeholder="Email"
          value={email}
          onChange={(newValue) => {
            setEmail(newValue.currentTarget.value);
          }}
        />
      </Card>
    </div>
  );
}

export default User;
