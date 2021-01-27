import { Table, Button, Typography, Input, Popconfirm } from 'antd';
import {useState} from 'react';
import {
  useHistory
} from "react-router-dom";
import _ from "lodash";
import 'antd/dist/antd.css';

function Session() {
  const { Column } = Table;
  console.log("RENDER");
  const { Title } = Typography;
  const history = useHistory();
  // The edit variable tells which component is allowed to edit its contents
  const [edit,setEdit]=useState(-1);
  const [userID,setUserID]=useState("");
  const [token,setToken]=useState("");
  const [expired,setExpired]=useState("");
  const [requested,setRequested]=useState("");
  const [created,setCreated]=useState("");
  // State variable to trigger a re-render of component
  const [render,setRender]=useState(false);
  // The delete variable tells which component is allowed to delete its contents
  const [deleteEdit,setDeleteEdit]=useState(-1);
  /**
   * This data is held in a state variable so that it wont reset every time the component
   * is re-rendered. This data represents the current state of data in sql
   */
  const [rawData,setRawData]= useState([
    {id: 1, userID: 3,token:"112312312dsf", expired:"1/2/21",requested:"1/1/22",created: "2/2/12"},
    {id: 2, userID: 2,token:"asdfdas312dsf", expired:"3/4/21",requested:"1/2/22",created: "9/2/12"},
    {id: 3, userID: 6,token:"asdfsdaf32", expired:"1/29/21",requested:"1/12/22",created: "21/2/12"}
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
      let tempRawData = rawData;
      tempRawData[e].userID= userID;
      tempRawData[e].created= created;
      tempRawData[e].expired= expired;
      tempRawData[e].requested= requested;
      tempRawData[e].token= token;
      setRawData(tempRawData);
      setUserID("");
      setCreated("");
      setRequested("");
      setExpired("");
      setToken("");
      setEdit(-1);
    }
  //Resets state variable on cancelation of edit
    function cancel(e) {
      setUserID("");
      setCreated("");
      setRequested("");
      setExpired("");
      setToken("");
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
          userID: <Input 
                      onChange={(newValue)=>{setUserID(newValue.currentTarget.value);}} 
                      disabled={index !== edit} 
                      defaultValue={object.userID}
                    />,
          created: <Input 
                      onChange={(newValue)=>{setCreated(newValue.currentTarget.value); }} 
                      disabled={index !==edit} 
                      defaultValue={object.created}
                    />,
          requested: <Input 
                    onChange={(newValue)=>{setRequested(newValue.currentTarget.value);}} 
                    disabled={index !==edit} 
                    defaultValue={object.requested}
                  />,
          token: <Input 
                    onChange={(newValue)=>{setToken(newValue.currentTarget.value);}} 
                    disabled={index !==edit} 
                    defaultValue={object.token}
                  />,
          expired: <Input 
                    onChange={(newValue)=>{setExpired(newValue.currentTarget.value);}} 
                    disabled={index !==edit} 
                    defaultValue={object.expired}
                  />,
          edit: 
          <div>
            <Button 
              onClick={()=>{history.push(`/Users`)}}
            >
              Users
            </Button>
            <Button 
              onClick={()=>{history.push(`/Roles/:${index}`)}}
            >
              Roles
            </Button>
            <Button 
              onClick={()=>{history.push(`/Actions/:${index}`)}}
            >
              Available Actions
            </Button>
            <Button 
              onClick={()=>{history.push(`/Credentials/:${index}`)}}
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
    function addSessionToTable (){ 
      let tempRawData = rawData
      tempRawData.push({id: "", userID: "",token:"", expired:"",requested:"",created: ""});
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
        <Title style={{margin:"auto", width:"fit-content"}}>Sessions</Title>
        <Table style={{width:"auto"}} dataSource={dataToBeUsed}>
            <Column title="ID" dataIndex="id" key="id" />
            <Column title="User ID" dataIndex="userID" key="userID" />
            <Column title="Token" dataIndex="token" key="token" />
            <Column title="Created" dataIndex="created" key="created" />
            <Column title="Requested" dataIndex="requested" key="requested" />
            <Column title="Expired" dataIndex="expired" key="expired" />
            <Column title="Action" dataIndex="edit" key="edit" />
        </Table>
        <Button onClick={addSessionToTable}>
          Add Session
        </Button>
      </div>
    );
}

export default Session;
