import { Table, Button, Typography, Input, Popconfirm } from 'antd';
import {useState} from 'react';
import {
  useHistory
} from "react-router-dom";
import _ from "lodash";
import 'antd/dist/antd.css';

function Role() {
  const { Column } = Table;
  console.log("RENDER");
  const { Title } = Typography;
  const history = useHistory();
  // The edit variable tells which component is allowed to edit its contents
  const [edit,setEdit]=useState(-1);
  const [roleTitle,setRoleTitle]=useState("");
  // State variable to trigger a re-render of component
  const [render,setRender]=useState(false);
  // The delete variable tells which component is allowed to delete its contents
  const [deleteEdit,setDeleteEdit]=useState(-1);
  /**
   * This data is held in a state variable so that it wont reset every time the component
   * is re-rendered. This data represents the current state of data in sql
   */
  const [rawData,setRawData]= useState([
    {id: 1, roleTitle:"Pilot"},
    {id: 2, roleTitle:"Capitain"},
    {id: 3, roleTitle:"Officer"}
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
      tempRawData[e].username= roleTitle;
      setRawData(tempRawData);
      setRoleTitle("");
      setEdit(-1);
    }
  //Resets state variable on cancelation of edit
    function cancel(e) {
      setRoleTitle("");
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
          roleTitle: <Input 
                      onChange={(newValue)=>{setRoleTitle(newValue.currentTarget.value);}} 
                      disabled={index !== edit} 
                      defaultValue={object.roleTitle}
                    />,
          edit: 
          <div>
            <Button 
              onClick={()=>{history.push(`/Sessions/:${index}`)}}
            >
              Sessions
            </Button>
            <Button 
              onClick={()=>{history.push(`/Users`)}}
            >
              Users
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
    function addRoleToTable (){ 
      let tempRawData = rawData
      tempRawData.push({id: "",roleTitle:""});
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
        <Title style={{margin:"auto", width:"fit-content"}}>Roles</Title>
        <Table style={{width:"auto"}} dataSource={dataToBeUsed}>
            <Column title="ID" dataIndex="id" key="id" />
            <Column title="Roles" dataIndex="roleTitle" key="roleTitle" />
            <Column title="Action" dataIndex="edit" key="edit" />
        </Table>
        <Button onClick={addRoleToTable}>
          Add Role
        </Button>
      </div>
    );
}

export default Role;
