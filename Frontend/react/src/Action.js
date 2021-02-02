import { Table, Button, Typography, Input, Popconfirm, message, Card, Modal  } from 'antd';
import {useState} from 'react';
import {
  useHistory,
  useParams
} from "react-router-dom";
import _ from "lodash";
import 'antd/dist/antd.css';

function Action() {
  const { Column } = Table;
  console.log("RENDER");
  const { Title } = Typography;
  const history = useHistory();
  // The edit variable tells which component is allowed to edit its contents
  const [edit,setEdit]=useState(-1);
  const [action,setAction]=useState("");
  const [actionSearch,setActionSearch]=useState("");
  const [results,setResults]=useState(false);
  // State variable to trigger a re-render of component
  const [render,setRender]=useState(false);
  // The delete variable tells which component is allowed to delete its contents
  const [deleteEdit,setDeleteEdit]=useState(-1);
  const urlUserID= useParams("userId").userId;
  const urlRoleID= useParams("actionId").actionId;
  /**
   * This data is held in a state variable so that it wont reset every time the component
   * is re-rendered. This data represents the current state of data in sql
   */
  const [searchResultsComponent,setSearchResultsComponent]= useState([])
  const [rawData,setRawData]= useState([
    {id: 3, action:"Fly"},
    {id: 5, action:"Open"},
    {id: 4, action:"Create"}
  ]);
  /**
   * This state has to exist because antd's table is having issues when the
   * data being fed to it has a deletion. This variable holds the indexes of
   * the raw data that has been deleted.
   */
  const [deleted,setDeleted]=useState([]);
  /**
   * This function resets the delete edit variable and adds the 
   * deleted index to the deleted state variable
   **/
  function deleteConfirm(e){
    setDeleteEdit(-1);
    let copy = deleted
    copy.push(e)
    setDeleted(copy)
    setRender(!render)
  }
  //Resets state variable on cancelation of delete
  function deleteCancel(e){
    setDeleteEdit(-1);
  }
  /**
   * This function saves the updated row to the raw state variables 
   * and resets the username,created,email, and edit varibles.
   */
    function confirm(e) {
      if(action === null || action.length === 0){
        message.error("Action cannot be empty or the same as before");
        return;
      }
      console.log("ACTION",action)
      let tempRawData = rawData;
      tempRawData[e].username= action;
      setRawData(tempRawData);
      setAction("");
      setEdit(-1);
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
    function createDataSource(){
      return _.map(rawData,(object,index)=>{
        let skip=false
        // if the index is in the deleted state array then null is returned
        _.map(deleted,(value)=>{
          if(value===index){
            skip=true
          } 
        })
        // Otherwise data is used to populate the component.
        if(!skip){
        return {
          key : index,
          id: object.id,
          action: <Input 
                      onChange={(newValue)=>{setAction(newValue.currentTarget.value);}} 
                      disabled={index !== edit} 
                      defaultValue={object.action}
                    />,
          edit: 
          <div>
            <Button 
              onClick={()=>{history.push(`/Sessions/${urlUserID}`)}}
            >
              Sessions
            </Button>
            <Button 
              onClick={()=>{history.push(`/Users`)}}
            >
              Users
            </Button>
            <Button 
              onClick={()=>{history.push(`/Roles/${urlUserID}`)}}
            >
              Roles
            </Button>
            <Button 
              onClick={()=>{history.push(`/Credentials/${urlUserID}`)}}
            >
              Credentials
            </Button>
           
              <Popconfirm 
                okText="Save To Database"
                cancelText="Don't Save To Database"
                visible={index===edit} 
                onConfirm={()=>confirm(index)} 
                onCancel={()=>cancel(index)}
                title="Proceed with Caution"
              > 
                <Button 
                  disabled={index === edit || edit !== -1}
                  type="primary"
                  onClick={()=>{
                    setEdit(index)
                  }}
                >
                  Edit
                </Button>
              </Popconfirm>
              <Popconfirm 
                okText="Confirm"
                cancelText="No"
                visible={index===deleteEdit} 
                onConfirm={()=>deleteConfirm(index)} 
                onCancel={()=>deleteCancel(index)}
                title="Proceed with Caution"
              > 
                <Button 
                  disabled={index === deleteEdit || deleteEdit !== -1}
                  danger
                  onClick={()=>{
                    setDeleteEdit(index)
                  }}
                >
                  Delete
                </Button>
              </Popconfirm>
            
            </div>
        }
      }
      return null
      });
    }
    /** 
     * This function adds users to the table.
     * Because react only does shallow checks on object, we have to manually
     * retrigger a render using the render state variable. This isn't
     * the best programming practice, but oh well.
     */
    function addActionToTable (){ 
      if(action === null || action.length === 0){
        message.error("Action was not filled out");
        return;
    }
      let tempRawData = rawData
      tempRawData.push({id: "",action:action});
      setRawData(tempRawData);
      setRender(!render);
    }
    let dataToBeUsed= []
    dataToBeUsed=createDataSource()
    _.forEach(deleted,(index,iterator)=>{
      if(index===iterator){
        dataToBeUsed[index]= null;
      } 
    })
  return (
      <div style={{ width: "100%", height: "100%" }}>
        <Card style={{margin:"auto", width:"100%"}} 
        title={
        <Title style={{margin:"auto", width:"fit-content"}}>Actions</Title>
        } 
        >
          <p>
            {urlRoleID ?`The below actions belong to the role id: ${urlRoleID}`
            : `The below actions belong to the user id: ${urlUserID}`}
          </p>
          <p>
            Users can create, read, update, and delete actions.
          </p>
          <p>
            Users can navigate to the user id: {`${urlUserID}`} sessions,  user id: {`${urlUserID}`} roles, and  user id: {`${urlUserID}`} credentials.
            Alternatively the user can navigate back to the main user table.
          </p>
          <p>
            Users can also filter through all actions in the table by using the bottom filter.
          </p>
       </Card>
        <Table style={{width:"auto"}} dataSource={dataToBeUsed}>
            <Column title="ID" dataIndex="id" key="id" />
            <Column title="Actions" dataIndex="action" key="action" />
            <Column title="Action" dataIndex="edit" key="edit" />
        </Table>
        <Card bordered style={{ width: 300 }}>
        <div style={{marginBottom:"16px"}}>
        <Button size="large" onClick={addActionToTable}>
          Add Action
        </Button>
        </div>
        <Button style={{ width: "35%" }} disabled>
          Action
          </Button> 
        <Input 
        style={{ width: "65%" }}
          placeholder ="add action"
          value={action}
           onChange={(newValue)=>{setAction(newValue.currentTarget.value);}} 
        />    
        </Card>
        <Card bordered style={{ width: 300 }}>
        <div style={{marginBottom:"16px"}}>
        <Button size="large" style={{ width: "200" }}onClick={()=>{
          setResults(true)
          const returnValue =[
            {id: 3, action:"Fly"},
            {id: 5, action:"Open"},
            {id: 4, action:"Create"}
          ]
           setSearchResultsComponent( _.map(returnValue,(object)=>{return <p>Id: {object.id} Action: {object.action}</p>}));
          }}>
          Filter All Actions by Action
          </Button> 
          </div>
          <Button style={{ width: "35%" }} disabled>
          Action
          </Button> 
        <Input 
        style={{ width: "65%" }}
          placeholder ="Filter All Actions by Action"
          value={actionSearch}
           onChange={(newValue)=>{
             setActionSearch(newValue.currentTarget.value);
          }} 
        /> 
        <Modal title="Filter Results" 
          visible={results} 
          closable={false} 
          onOk={()=>setResults(false)} 
          onCancel={()=>setResults(false)}
          >
          {searchResultsComponent}
      </Modal>
      </Card>
      </div>
    );
}

export default Action;
