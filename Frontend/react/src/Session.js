import {
  Table,
  Button,
  Typography,
  Input,
  Select,
  message,
  DatePicker,
  Card,
} from "antd";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import moment from "moment";
import "antd/dist/antd.css";
import {url} from "./url.js"

const axios = require('axios');

function Session() {
  const { Column } = Table;
  const { Option } = Select;
  console.log("RENDER");
  const { Title } = Typography;
  const history = useHistory();
  const [userID, setUserID] = useState("");
  const [token, setToken] = useState("");
  const [expired, setExpired] = useState("");
  const [requested, setRequested] = useState("");
  const [created, setCreated] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  // State variable to trigger a re-render of component
  const [render, setRender] = useState(false);
  function handleSelectUserChange(value) {
    console.log(value);
    setUserID(value);
  }
  /**
   * This data is held in a state variable so that it wont reset every time the component
   * is re-rendered. This data represents the current state of data in sql
   */
  if(userOptions && userOptions.length == 0){
    let allUserIdsQuery = {
      "username":"test_user00",
      "token":"d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
      "operation_name":"GET_USRIDS",
    }
     let axiosResponse = null;
      axios(
      {
      method: 'post',
      url: url,
      data: JSON.stringify(allUserIdsQuery)
    })
    .then(function (response) {
      axiosResponse=response.data.Results;
       let tempUserIds = _.map(
        axiosResponse,
        (element, index) => {
          return <Option key={index} value={element.id} label={element.id} />
        }
      );
      setUserOptions(tempUserIds);
    })
    .catch(function (error) {
      console.log("AXIOS RESPONSE",error);
    });
  }
  const [rawData, setRawData] = useState([
  ]);
  let allSessionsQuery = {
    "username":"test_user00",
    "token":"d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
    "operation_name":"GET_SESSIONS",
  }
   
  if(rawData && rawData.length === 0){
    axios(
    {
    method: 'post',
    url: url,
    data: JSON.stringify(allSessionsQuery)
  })
  .then(function (response) {
    console.log("AXIOS RESPONSE",response);
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
        userID: object.userID,
        created: object.created,
        requested: object.requested,
        token: object.token,
        expired: object.expired,
      };
    });
  }
  /**
   * This function adds users to the table.
   * Because react only does shallow checks on object, we have to manually
   * retrigger a render using the render state variable. This isn't
   * the best programming practice, but oh well.
   */
  function addSessionToTable() {
    if (
      userID === null ||
      token === null ||
      userID.length === 0 ||
      created.length === 0 ||
      requested.length === 0 ||
      expired.length === 0 ||
      token.length === 0
    ) {
      message.error("Some fields were not filled out");
      return;
    }
    let tempRawData = rawData;
    let addSessionQuery = {
      "username":"test_user00",
      "token":"d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
      "operation_name":"ADD_SESSION",
      "task_data":{
        "id": userID,
        "token": token,
        "exp_date": moment(expired).format("YYYY-MM-DD HH:mm:ss"),
        "user_req_date": moment(requested).format("YYYY-MM-DD HH:mm:ss"),
        "created_at": moment(created).format("YYYY-MM-DD HH:mm:ss")
      }
    }
    // Relationship - Implementing ADD session relationship
    axios(
      {
      method: 'post',
      url: url,
      data: JSON.stringify(addSessionQuery)
    })
    .then(function (response) {
      console.log("AXIOS RESPONSE",response.data);
    tempRawData.push({
      id: response.data.id,
      userID: userID,
      token: token,
      expired: expired,
      requested: requested,
      created: created,
    });
    setUserID("");
    setToken("");
    setRawData(tempRawData);
    setRender(!render);
    })
    .catch(function (error) {
      console.log("AXIOS RESPONSE",error);
      message.error("Role already exists");
    });
  }
  let dataToBeUsed = [];
  dataToBeUsed = createDataSource();
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Card
        style={{ margin: "auto", width: "100%" }}
        title={
          <Title style={{ margin: "auto", width: "fit-content" }}>
            Sessions
          </Title>
        }
      >
        <p>
          You can add new Session tokens as long as user ID, token, created
          date, requested date, and expiration date are not null.
        </p>
      </Card>
      <div>
        <Button
          onClick={() => {
            history.push(`/Users`);
          }}
        >
          Users
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
      </div>
      <Table style={{ width: "auto" }} dataSource={dataToBeUsed}>
        <Column title="ID" dataIndex="id" key="id" />
        <Column title="User ID" dataIndex="userID" key="userID" />
        <Column title="Token" dataIndex="token" key="token" />
        <Column title="Created" dataIndex="created" key="created" />
        <Column title="Requested" dataIndex="requested" key="requested" />
        <Column title="Expired" dataIndex="expired" key="expired" />
      </Table>
      <Card bordered style={{ width: 300 }}>
        <div style={{ marginBottom: "16px" }}>
          <Button size="large" onClick={addSessionToTable}>
            Add Session
          </Button>
        </div>
        <Button style={{ width: "35%" }} disabled>
          User ID
        </Button>
        <Select
          style={{ width: "65%" }}
          placeholder="User Id"
          value={userID}
          onChange={(value) => {
            handleSelectUserChange(value);
          }}
          optionLabelProp="label"
        >
          {" "}
          {userOptions}
        </Select>
        <Button style={{ width: "35%" }} disabled>
          Token
        </Button>
        <Input
          style={{ width: "65%" }}
          placeholder="Token"
          value={token}
          onChange={(newValue) => {
            setToken(newValue.currentTarget.value);
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
        <Button style={{ width: "50%" }} disabled>
          Requested Date
        </Button>
        <DatePicker
          style={{ width: "50%" }}
          placeholder="Requested Date"
          onChange={(date, dateString) => {
            setRequested(dateString);
          }}
        />
        <Button style={{ width: "45%" }} disabled>
          Expiration Date
        </Button>
        <DatePicker
          style={{ width: "55%" }}
          placeholder="Expiration Date"
          onChange={(date, dateString) => {
            setExpired(dateString);
          }}
        />
      </Card>
    </div>
  );
}

export default Session;
