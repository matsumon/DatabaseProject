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
import "antd/dist/antd.css";

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
    { id: 1, username: "Mike", created: "1/2/21", email: "blahblah@gmail.com" },
    { id: 2, username: "Lucy", created: "21/2/31", email: "dsfadsa@gmail.com" },
    { id: 3, username: "Will", created: "1/123/21", email: "asdfdf@gmail.com" },
  ]);
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
    tempRawData.push({
      id: "",
      username: username,
      created: created,
      email: email,
    });
    setUsername("");
    setEmail("");
    setRawData(tempRawData);
    setRender(!render);
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
