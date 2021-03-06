import { Table, Button, Typography, Input, Select, message, Card } from "antd";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import "antd/dist/antd.css";
import {url} from "./url.js"

const axios = require('axios');

function Role() {
  const { Column } = Table;
  const { Option } = Select;
  console.log("RENDER");
  const { Title } = Typography;
  const history = useHistory();
  const [roleTitle, setRoleTitle] = useState("");
  const [roleUserID, setRoleUserID] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  // State variable to trigger a re-render of component
  const [render, setRender] = useState(false);

  /**
   * This data is held in a state variable so that it wont reset every time the component
   * is re-rendered. This data represents the current state of data in sql
   */
  const [rawData, setRawData] = useState([
  ]);

  let allRolesQuery = {
    "username":"test_user00",
    "token":"d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
    "operation_name":"GET_ROLES"
  }
   
  if(rawData && rawData.length === 0){
    axios(
    {
    method: 'post',
    url: url,
    data: JSON.stringify(allRolesQuery)
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
      url: url,
      data: JSON.stringify(allUserIdsQuery)
    })
    .then(function (response) {
      console.log("AXIOS RESPONSE",response);
      axiosResponse=response.data.Results;
       let tempUserIds = _.map(
        axiosResponse,
        (element, index) => {
          return <Option key={index} value={element.id} label={element.id} />
        }
      );
      tempUserIds.push(<Option key={tempUserIds.length} value={"None"} label={"None"} />)

      setUserOptions(tempUserIds);
    })
    .catch(function (error) {
      console.log("AXIOS RESPONSE",error);
    });
  }
  function handleSelectUserChange(value) {
    console.log(value);
    setRoleUserID(value);
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
        roleTitle: object.roleTitle,
        userID: object?.userID ? object?.userID: null
      };
    });
  }
  /**
   * This function adds users to the table.
   * Because react only does shallow checks on object, we have to manually
   * retrigger a render using the render state variable. This isn't
   * the best programming practice, but oh well.
   */
  function addRoleToTable() {
    if (roleTitle === null || roleTitle.length === 0) {
      message.error("Role was not filled out");
      return;
    }
    let tempRawData = rawData;
    let newUserIDRelation = null;
    let addRoleQuery = {
      "username":"test_user00",
      "token":"d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
      "operation_name":"ADD_ROLE",
      "task_data":{
        "role_title": roleTitle,
      }
    }
    // Relationship - Implementing ADD role and user_to_role relationship
    axios(
      {
      method: 'post',
      url: url,
      data: JSON.stringify(addRoleQuery)
    })
    .then(function (response) {
      console.log("AXIOS RESPONSE",response.data.id);
      let addRelationQuery = {
        "username":"test_user00",
        "token":"d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
        "operation_name":"CREATE_USR2ROLE",
        "task_data":{
          "roleID": response.data.id,
          "userID": (roleUserID ==="" || roleUserID ==="None") ? null : roleUserID
        }
      }
      console.log("HERE")
      axios(
        {
        method: 'post',
        url: url,
        data: JSON.stringify(addRelationQuery)
      })
      .then(function (response) {
        console.log("AXIOS RESPONSE",response.data);
        setRoleUserID(response.data.id)
      })
      .catch(function (error) { 
        console.log("AXIOS RESPONSE",error);
        message.error("Role Relation to User already exists");
      });
    tempRawData.push({ id: response.data.id, roleTitle: roleTitle, userID: roleUserID });
    setRoleTitle("");
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
          <Title style={{ margin: "auto", width: "fit-content" }}>Roles</Title>
        }
      >
        <p>
          Users can make new roles as long as the role is not blank and is
          unique. Additionally, users can be tied to roles.
        </p>
      </Card>
      <div>
        <Button
          onClick={() => {
            history.push(`/Sessions`);
          }}
        >
          Sessions
        </Button>
        <Button
          onClick={() => {
            history.push(`/Users`);
          }}
        >
          Users
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
        <Column title="Roles" dataIndex="roleTitle" key="roleTitle" />
        <Column title="User ID's" dataIndex="userID" key="userID" />
      </Table>
      <Card bordered style={{ width: 300 }}>
        <div style={{ marginBottom: "16px" }}>
          <Button size="large" onClick={addRoleToTable}>
            Add Role
          </Button>
        </div>
        <Button style={{ width: "35%" }} disabled>
          Role
        </Button>
        <Input
          style={{ width: "55%" }}
          placeholder="add role"
          value={roleTitle}
          onChange={(newValue) => {
            setRoleTitle(newValue.currentTarget.value);
          }}
        />
        <Button style={{ width: "55%" }} disabled>
          User ID's to Add
        </Button>
        <Select
          style={{ width: "35%" }}
          placeholder="User Id"
          onChange={(value) => {
            handleSelectUserChange(value);
          }}
          optionLabelProp="label"
        >
          {userOptions}
        </Select>
      </Card>
    </div>
  );
}

export default Role;
