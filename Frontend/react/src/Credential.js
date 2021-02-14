import {
  Table,
  Button,
  Typography,
  Input,
  message,
  DatePicker,
  Card,
  Select,
} from "antd";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import moment from "moment";
import "antd/dist/antd.css";
const axios = require('axios');

function Credential() {
  const { Column } = Table;
  const { Option } = Select;
  console.log("RENDER");
  const { Title } = Typography;
  const history = useHistory();
  const [userID, setUserID] = useState("");
  const [userIDAdd, setUserIDAdd] = useState("");
  const [hash, setHash] = useState("");
  const [expired, setExpired] = useState("");
  const [enabled, setEnabled] = useState("");
  const [created, setCreated] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  // State variable to trigger a re-render of component
  const [render, setRender] = useState(false);
  /**
   * This data is held in a state variable so that it wont reset every time the component
   * is re-rendered. This data represents the current state of data in sql
   */
  const [rawData, setRawData] = useState([
    // {
    //   id: 1,
    //   userID: 3,
    //   hash: "112312312dsf",
    //   expired: "1/2/21",
    //   enabled: "true",
    //   created: "2/2/12",
    // },
    // {
    //   id: 2,
    //   userID: 2,
    //   hash: "asdfdas312dsf",
    //   expired: "3/4/21",
    //   enabled: "false",
    //   created: "9/2/12",
    // },
    // {
    //   id: 3,
    //   userID: 6,
    //   hash: "asdfsdaf32",
    //   expired: "1/29/21",
    //   enabled: "true",
    //   created: "21/2/12",
    // },
  ]);
  let allCredentialsQuery = {
    "username":"test_user00",
    "token":"d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
    "operation_name":"GET_CREDS"
  }
   
  if(rawData && rawData.length === 0){
    axios(
    {
    method: 'post',
    url: 'http://flip3.engr.oregonstate.edu:53200/API',
    data: JSON.stringify(allCredentialsQuery)
  })
  .then(function (response) {
    console.log("AXIOS RESPONSE",response.data.Results);
    setRawData(response.data.Results);
  })
  .catch(function (error) {
    console.log("AXIOS RESPONSE",error);
  });
  }
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
      url: 'http://flip3.engr.oregonstate.edu:53200/API',
      data: JSON.stringify(allUserIdsQuery)
    })
    .then(function (response) {
      console.log("AXIOS RESPONSE",response);
      axiosResponse=response.data.Results;
       let tempUserIds = _.map(
        axiosResponse,
        (element, index) => {
          return <Option key={element.id} value={element.id} label={element.id} />
        }
      );
      tempUserIds.push(<Option key={userOptions.length} value={"None"} label={"None"} />)

      setUserOptions(tempUserIds);
    })
    .catch(function (error) {
      console.log("AXIOS RESPONSE",error);
    });
  }
  function handleSelectUserChange(value) {
    console.log(value);
    setUserIDAdd(value);
  }
  function handleSelectEditUserChange(value, id) {
    console.log(value, id);
    let changeUserId = {
      "username":"test_user00",
      "token":"d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
      "operation_name":"UPDATE_CRED",
      "task_data":{
        "credential_id": id,
        "new_user_id" : (value ==="" || value ==="None" || value == null) ? null : value
      }
    }
    axios(
      {
      method: 'post',
      url: 'http://flip3.engr.oregonstate.edu:53200/API',
      data: JSON.stringify(changeUserId)
    })
    .then(function (response) {
      console.log("AXIOS RESPONSE",response);
      // setRawData(response.data.Results);
    setUserID(value);
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
        key: object.id,
        id: object.id,
        userID: (
          <Select
            style={{ width: "65%" }}
            placeholder="User Id"
            onChange={(value) => {
              handleSelectEditUserChange(value, object.id);
            }}
            defaultValue={object?.userID ? object.userID.toString(): "None"}
            optionLabelProp="label"
          >
            {userOptions}
          </Select>
        ),
        created: object.created,
        enabled: object.enabled,
        hash: object.hash,
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
  function addCredentialToTable() {
    if (enabled.length === 0 || created.length === 0 || expired.length === 0) {
      message.error(
        "Enable Credential, Created Date or Expiration Date were not filled out"
      );
      return;
    }
    let tempRawData = rawData;
    console.log("USERID",userIDAdd)
    let addCredentialQuery = {
      "username":"test_user00",
      "token":"d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
      "operation_name":"ADD_CRED",
      "task_data":{
        "hash": hash,
        "exp_date": moment(expired).format("YYYY-MM-DD"),
        "created_date": moment(created).format("YYYY-MM-DD"),
        "enabled": enabled === 'True'? 1:0,
        "userID": (userIDAdd=="" || userIDAdd=="None")? null : userIDAdd
      }
    }
    console.log("HERE")
    axios(
      {
      method: 'post',
      url: 'http://flip3.engr.oregonstate.edu:53200/API',
      data: JSON.stringify(addCredentialQuery)
    })
    .then(function (response) {
      console.log("AXIOS RESPONSE",response);
    //  tempRawData = response.data.Results;
    tempRawData.push({
      id: response.data.insertId,
      userID: (userIDAdd=="" || userIDAdd=="None")? null : userIDAdd,
      hash: hash,
      expired: expired,
      enabled: enabled,
      created: created,
    });
    // setUserID("");
    // setUserIDAdd("Null")
    setHash("");
    setRawData(tempRawData);
    setRender(!render);
    })
    .catch(function (error) {
      console.log("AXIOS RESPONSE",error);
      message.error("Role already exists");
    });
    // tempRawData.push({
    //   id: "",
    //   userID: userIDAdd,
    //   hash: hash,
    //   expired: expired,
    //   enabled: enabled,
    //   created: created,
    // });
    // setHash("");
    // setRawData(tempRawData);
    // setRender(!render);
  }
  let dataToBeUsed = [];
  dataToBeUsed = createDataSource();
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Card
        style={{ margin: "auto", width: "100%" }}
        title={
          <Title style={{ margin: "auto", width: "fit-content" }}>
            Credentials
          </Title>
        }
      >
        <p>
          Users can make new credentials for any user with a user id, hash,
          created date, expiration date, and whether to enable credential. User
          ID and the hash are both optional with user id being nullable
        </p>
        <p>
          Users can edit the user id, a foreign key to be anything including
          null
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
            history.push(`/Sessions`);
          }}
        >
          Sessions
        </Button>
      </div>
      <Table style={{ width: "auto" }} dataSource={dataToBeUsed}>
        <Column title="ID" dataIndex="id" key="id" />
        <Column title="User ID" dataIndex="userID" key="userID" />
        <Column title="Hash" dataIndex="hash" key="hash" />
        <Column title="Created Date" dataIndex="created" key="created" />
        <Column title="Enabled" dataIndex="enabled" key="enabled" />
        <Column title="Expiration Date" dataIndex="expired" key="expired" />
      </Table>
      <Card bordered style={{ width: 300 }}>
        <div style={{ marginBottom: "16px" }}>
          <Button size="large" onClick={addCredentialToTable}>
            Add Credential
          </Button>
        </div>
        <Button style={{ width: "35%" }} disabled>
          User ID
        </Button>
        <Select
          style={{ width: "65%" }}
          placeholder="User Id"
          value={userIDAdd}
          onChange={(value) => {
            handleSelectUserChange(value);
          }}
          optionLabelProp="label"
        >
          {" "}
          {userOptions}
        </Select>
        <Button style={{ width: "35%" }} disabled>
          Hash
        </Button>
        <Input
          style={{ width: "65%" }}
          placeholder="Hash"
          value={hash}
          onChange={(newValue) => {
            setHash(newValue.currentTarget.value);
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
          Enable Credential
        </Button>
        <Select
          placeholder="Enable Credential"
          style={{ width: "50%" }}
          onChange={(value) => setEnabled(value)}
        >
          <Option value="true">True</Option>
          <Option value="false">False</Option>
        </Select>
        <Button style={{ width: "50%" }} disabled>
          Expiration Date
        </Button>
        <DatePicker
          style={{ width: "50%" }}
          placeholder="Expiration Date"
          onChange={(date, dateString) => {
            setExpired(dateString);
          }}
        />
      </Card>
    </div>
  );
}

export default Credential;
