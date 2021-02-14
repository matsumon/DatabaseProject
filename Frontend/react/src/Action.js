import {
  Table,
  Button,
  Typography,
  Input,
  Popconfirm,
  message,
  Select,
  Card,
  Modal,
} from "antd";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import "antd/dist/antd.css";
import {url} from "./url.js"
const axios = require('axios');

function Action() {
  const { Option } = Select;
  const { Column } = Table;
  console.log("RENDER");
  const { Title } = Typography;
  const history = useHistory();
  // The edit variable tells which component is allowed to edit its contents
  const [edit, setEdit] = useState(-1);
  const [action, setAction] = useState("");
  const [addAction, setAddAction] = useState([]);
  const [roleID, setRoleID] = useState([]);
  const [actionSearch, setActionSearch] = useState("");
  const [idSearch, setIdSearch] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [actionOptions, setActionOptions] = useState([]);
  const [results, setResults] = useState(false);
  // State variable to trigger a re-render of component
  const [render, setRender] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  // The delete variable tells which component is allowed to delete its contents
  const [deleteEdit, setDeleteEdit] = useState(-1);
  /**
   * This data is held in a state variable so that it wont reset every time the component
   * is re-rendered. This data represents the current state of data in sql
   */
  const [searchResultsComponent, setSearchResultsComponent] = useState([]);
  const [rawData, setRawData] = useState([
    // { id: 3, action: "Fly", mmRoleID: [1, 2, 3] },
    // { id: 5, action: "Open", mmRoleID: [4, 5, 6] },
    // { id: 4, action: "Create", mmRoleID: [7, 8] },
  ]);
  let allActionsQuery = {
    "username":"test_user00",
    "token":"d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
    "operation_name":"GET_ACTIONS"
    // "task_data":{
    //   "role_title":"ddddds13123sadasd1dd4534534dsfsdd23dfsd"
    // }
  }
   
  // if(rawData && rawData.length === 0){
  if(firstTime){
    console.log("FirstTime")
    setFirstTime(false);
    axios(
    {
    method: 'post',
    url: url,
    data: JSON.stringify(allActionsQuery)
  })
  .then(function (response) {
    console.log("AXIOS HEREREREERERERER");
    console.log("AXIOS RESPONSE",response.data.Results);
    setRawData(response.data.Results);
  })
  .catch(function (error) {
    console.log("AXIOS RESPONSE",error);
  });
  }
  // let allActionsQuery = {
  //   "username":"test_user00",
  //   "token":"d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
  //   "operation_name":"GET_SESSIONS",
  // }
   
  // if(rawData && rawData.length === 0){
  //   axios(
  //   {
  //   method: 'post',
  //   url: 'http://flip3.engr.oregonstate.edu:53200/API',
  //   data: JSON.stringify(allActionsQuery)
  // })
  // .then(function (response) {
  //   console.log("AXIOS RESPONSE",response);
  //   setRawData(response.data.Results);
  // })
  // .catch(function (error) {
  //   console.log("AXIOS RESPONSE",error);
  // });
  // }
  function handleSelectChange(value, id) {
    console.log(value, id);
    let roleToActionQuery = {
      "username":"test_user00",
      "token":"d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
      "operation_name":"UPDATE_ROLE_ASCC",
      "task_data":{
        "ActionID": id,
        "New_Roles": value
      }
    }
     
      axios(
      {
      method: 'post',
      url: url,
      data: JSON.stringify(roleToActionQuery)
    })
    .then(function (response) {
      console.log("AXIOS RESPONSE",response);
    })
    .catch(function (error) {
      console.log("AXIOS RESPONSE",error);
      message.error("Could not remove M:M relationship ");
    });
  }
  function handleSelectRoleChange(value) {
    console.log(value);
    setRoleID(value);
  }
  function handleSearchActionChange(value) {
    console.log(value);
    setIdSearch(value);
  }
  // let roleOptions = _.map([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (element, index) => {
  //   return <Option key = {index} value={element} tag={element} />;
  // });
  if(roleOptions && roleOptions.length == 0){
    let allRoleIdsQuery = {
      "username":"test_user00",
      "token":"d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
      "operation_name":"GET_ROLEIDS",
    }
     let axiosResponse = null;
      axios(
      {
      method: 'post',
      url: url,
      data: JSON.stringify(allRoleIdsQuery)
    })
    .then(function (response) {
      console.log("AXIOS RESPONSE",response);
      axiosResponse=response.data.Results;
       let tempRoleIds = _.map(
        axiosResponse,
        (element, index) => {
          return <Option key={index} value={element.id} label={element.id} />
        }
      );
      tempRoleIds.push( <Option key={tempRoleIds.length} value={"None"} label={"None"}/>)
      setRoleOptions(tempRoleIds);
    })
    .catch(function (error) {
      console.log("AXIOS RESPONSE",error);
    });
  }
  if(actionOptions && actionOptions.length == 0){
    let allActionIdsQuery = {
      "username":"test_user00",
      "token":"d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
      "operation_name":"GET_ACTIONIDS",
    }
     let axiosResponse = null;
      axios(
      {
      method: 'post',
      url: url,
      data: JSON.stringify(allActionIdsQuery)
    })
    .then(function (response) {
      console.log("AXIOS RESPONSE",response);
      axiosResponse=response.data.Results;
       let tempActionIds = _.map(
        axiosResponse,
        (element, index) => {
          return <Option key={index} value={element.id} label={element.id} />
        }
      );
      setActionOptions(tempActionIds);
    })
    .catch(function (error) {
      console.log("AXIOS RESPONSE",error);
    });
  }
  /**
   * This state has to exist because antd's table is having issues when the
   * data being fed to it has a deletion. This variable holds the indexes of
   * the raw data that has been deleted.
   */
  const [deleted, setDeleted] = useState([]);
  /**
   * This function resets the delete edit variable and adds the
   * deleted index to the deleted state variable
   **/
  function deleteConfirm(e) {
    setDeleteEdit(-1);
    let copy = deleted;
    let deleteQuery = {
      "username":"test_user00",
      "token":"d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
      "operation_name":"DEL_ACTION",
      "task_data":{
        "id": e
      }
    }
      axios(
      {
      method: 'post',
      url: url,
      data: JSON.stringify(deleteQuery)
    })
    .then(function (response) {
      console.log("AXIOS RESPONSE",response.data);
      let tempRawData = rawData;
      e= _.findIndex(tempRawData,(element)=>{return element.id === e})
      copy.push(e);
    setDeleted(copy);
    setRender(!render);
    })
    .catch(function (error) {
      console.log("AXIOS RESPONSE",error);
    });
    // copy.push(e);
    // setDeleted(copy);
    // setRender(!render);
  }
  //Resets state variable on cancelation of delete
  function deleteCancel(e) {
    setDeleteEdit(-1);
  }
  /**
   * This function saves the updated row to the raw state variables
   * and resets the username,created,email, and edit varibles.
   */
  function confirm(e) {
    if (!action || action === null || action.length === 0) {
      message.error("Action cannot be empty ");
      return;
    }
    let tempRawData = rawData;
    let updateQuery = {
      "username":"test_user00",
      "token":"d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
      "operation_name":"UPDATE_ACTION",
      "task_data":{
        "id" : e,
        "task_name": action
      }
    }
      axios(
      {
      method: 'post',
      url: url,
      data: JSON.stringify(updateQuery)
    })
    .then(function (response) {
      console.log("AXIOS RESPONSE",response.data);
      tempRawData[e].action = action;
      setRawData(tempRawData);
      setAction("");
      setEdit(-1);
    })
    .catch(function (error) {
      console.log("AXIOS RESPONSE",error);
    });
    // tempRawData[e].action = action;
    // setRawData(tempRawData);
    // setAction("");
    // setEdit(-1);
  }
  //Resets state variable on cancelation of edit
  function cancel(e) {
    setAction("");
    setEdit(-1);
  }
  /**
   * This function creates the data packet for antd's table. Because
   * the table is having issues we have to set deleted rows to null.
   */
  function createDataSource() {
    return _.map(rawData, (object, index) => {
      let skip = false;
      // if the index is in the deleted state array then null is returned
      _.map(deleted, (value) => {
        if (value === index) {
          skip = true;
        }
      });
      // Otherwise data is used to populate the component.
      if (!skip) {
        let defaultOptions = null;
        if (object.mmRoleID) {
          defaultOptions = _.map(object.mmRoleID, (element) => {
            return element;
          });
        }
        return {
          key: object.id,
          id: object.id,
          action: (
            <Input
              onChange={(newValue) => {
                setAction(newValue.currentTarget.value);
              }}
              disabled={object.id !== edit}
              defaultValue={object.action}
            />
          ),
          mmRoleID: (
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="select Role Id's"
              defaultValue={defaultOptions ? defaultOptions : undefined}
              onChange={(value) => {
                handleSelectChange(value, object.id);
              }}
              optionLabelProp="label"
            >
              {roleOptions}
            </Select>
          ),
          edit: (
            <div>
              <Popconfirm
                okText="Save To Database"
                cancelText="Don't Save To Database"
                visible={object.id === edit}
                onConfirm={() => confirm(object.id)}
                onCancel={() => cancel(object.id)}
                title="Proceed with Caution"
              >
                <Button
                  disabled={object.id === edit || edit !== -1}
                  type="primary"
                  onClick={() => {
                    setEdit(object.id);

                    setAction(rawData[object.id].action);
                  }}
                >
                  Edit Action
                </Button>
              </Popconfirm>
              <Popconfirm
                okText="Confirm"
                cancelText="No"
                visible={object.id === deleteEdit}
                onConfirm={() => deleteConfirm(object.id)}
                onCancel={() => deleteCancel(object.id)}
                title="Proceed with Caution"
              >
                <Button
                  disabled={object.id === deleteEdit || deleteEdit !== -1}
                  danger
                  onClick={() => {
                    setDeleteEdit(object.id);
                  }}
                >
                  Delete
                </Button>
              </Popconfirm>
            </div>
          ),
        };
      }
      return null;
    });
  }
  /**
   * This function adds users to the table.
   * Because react only does shallow checks on object, we have to manually
   * retrigger a render using the render state variable. This isn't
   * the best programming practice, but oh well.
   */
  function addActionToTable() {
    if (addAction === null || addAction.length === 0) {
      message.error("Action was not filled out");
      return;
    }
    let bool =0;
    let objectID=null;
    let tempRawData = rawData;
    let addActionQuery = {
      "username":"test_user00",
      "token":"d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
      "operation_name":"ADD_ACTION",
      "task_data":{
        "action_name": addAction
      }
    }
    console.log("HERE")
    axios(
      {
      method: 'post',
      url: url,
      data: JSON.stringify(addActionQuery)
    })
    .then(function (response) {
      console.log("AXIOS RESPONSE",response.data,roleID);
    //  tempRawData = response.data.Results;
    //
    objectID = response.data.insertId;
    let actionRelationQuery = {
      "username":"test_user00",
      "token":"d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
      "operation_name":"CREATE_ROLE2ACTION",
      "task_data":{
        "actionID" : response.data.insertId,
        "roleID" : roleID
      }
    }
     
    if(response?.data?.insertId && roleID.length>0){
      axios(
      {
      method: 'post',
      url: url,
      data: JSON.stringify(actionRelationQuery)
    })
    .then(function (response) {
      console.log("AXIOS RESPONSE",response);
      bool = 1
      tempRawData.push({ id: response.data.insertId, action: addAction, mmRoleID: roleID ? [roleID]: roleID });
      setRawData(tempRawData);
      setAddAction("");
      setRoleID();
      setRender(!render);
    })
    .catch(function (error) {
      console.log("AXIOS RESPONSE",error);
    });
    }
    //
    // tempRawData.push({ id: response.data.insertId, action: addAction, mmRoleID: roleID });
    // setRawData(tempRawData);
    // setAddAction("");
    // setRoleID();
    // setRender(!render);
    })
    .catch(function (error) {
      console.log("AXIOS RESPONSE",error);
      message.error("Action already exists");
    });
    // if(bool ===0 && objectID){
      console.log("ROLE",roleID)
      tempRawData.push({ id: objectID, action: addAction, mmRoleID: roleID ? [roleID]: roleID });
      setRawData(tempRawData);
      setAddAction("");
      setRoleID();
      setRender(!render);
    // }
    // tempRawData.push({ id: "", action: addAction, mmRoleID: roleID });
    // setRawData(tempRawData);
    // setAddAction("");
    // setRoleID();
    // setRender(!render);
  }
  let dataToBeUsed = [];
  dataToBeUsed = createDataSource();
  _.forEach(deleted, (index, iterator) => {
    if (index === iterator) {
      dataToBeUsed[index] = null;
    }
  });
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Card
        style={{ margin: "auto", width: "100%" }}
        title={
          <Title style={{ margin: "auto", width: "fit-content" }}>
            Actions
          </Title>
        }
      >
        <p>
          Users can create, read, update, and delete actions. Users can add
          actions to roles by specifying role id's.
        </p>
        <p>
          Users can also filter through all actions in the table by using the
          bottom filter.
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
          history.push(`/Credentials`);
        }}
      >
        Credentials
      </Button>
      <Table style={{ width: "auto" }} dataSource={dataToBeUsed}>
        <Column title="ID" dataIndex="id" key="id" />
        <Column title="Actions" dataIndex="action" key="action" />
        <Column title="Role ID's" dataIndex="mmRoleID" key="mmRoleID" />
        <Column title="Action" dataIndex="edit" key="edit" />
      </Table>
      <Card bordered style={{ width: 300 }}>
        <div style={{ marginBottom: "16px" }}>
          <Button size="large" onClick={addActionToTable}>
            Add Action
          </Button>
        </div>
        <Button style={{ width: "35%" }} disabled>
          Action
        </Button>
        <Input
          style={{ width: "65%" }}
          placeholder="add action"
          value={addAction}
          onChange={(newValue) => {
            setAddAction(newValue.currentTarget.value);
          }}
        />
        <Button style={{ width: "65%" }} disabled>
          Role IDs to add action
        </Button>
        <Select
          style={{ width: "35%" }}
          placeholder="Role Id's To Add"
          value={roleID}
          onChange={(value) => {
            handleSelectRoleChange(value);
          }}
          optionLabelProp="label"
        >
          {roleOptions}
        </Select>
      </Card>
      <Card bordered style={{ width: 300 }}>
        <div style={{ marginBottom: "16px" }}>
          <Button
            size="large"
            style={{ width: "200" }}
            onClick={() => {
              setResults(true);
              const returnValue = [
                { id: 3, action: "Fly" },
                { id: 5, action: "Open" },
                { id: 4, action: "Create" },
              ];
              let filterQuery = {
                "username":"test_user00",
                "token":"d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
                "operation_name": "FILTER_ACTIONS",
                "task_data": {
                    "action_name" : actionSearch ? actionSearch : actionSearch,
                    "actionIDs" : idSearch ? idSearch.toString() : null
                    }
              }
               
                axios(
                {
                method: 'post',
                url: url,
                data: JSON.stringify(filterQuery)
              })
              .then(function (response) {
                console.log("AXIOS RESPONSE",response.data.insertId);
                setSearchResultsComponent(
                  _.map(response.data.insertId, (object) => {
                    return (
                      <p>
                        Id: {object.id} Action: {object.action_name}
                      </p>
                    );
                  })
                );
              })
              .catch(function (error) {
                console.log("AXIOS RESPONSE",error);
              });
              // setSearchResultsComponent(
              //   _.map(returnValue, (object) => {
              //     return (
              //       <p>
              //         Id: {object.id} Action: {object.action}
              //       </p>
              //     );
              //   })
              // );
            }}
          >
            Filter All Actions
          </Button>
        </div>
        <Button style={{ width: "35%" }} disabled>
          Action
        </Button>
        <Input
          style={{ width: "65%" }}
          placeholder="Filter All Actions by Action"
          value={actionSearch}
          onChange={(newValue) => {
            setActionSearch(newValue.currentTarget.value);
          }}
        />
        <Button style={{ width: "35%" }} disabled>
          Action ID
        </Button>
        <Select
          mode="multiple"
          value={idSearch}
          style={{ width: "65%" }}
          placeholder="Action Id's To Search"
          onChange={(value) => {
            handleSearchActionChange(value);
          }}
          optionLabelProp="label"
        >
          {actionOptions}
        </Select>
        <Modal
          title="Filter Results"
          visible={results}
          closable={false}
          onOk={() => setResults(false)}
          onCancel={() => setResults(false)}
        >
          {searchResultsComponent}
        </Modal>
      </Card>
    </div>
  );
}

export default Action;
