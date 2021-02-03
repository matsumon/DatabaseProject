import { Table, Button, Typography, Input, Select, message, Card, InputNumber } from 'antd';
import {useState} from 'react';
import {
  useHistory,
  useParams
} from "react-router-dom";
import _ from "lodash";
import 'antd/dist/antd.css';
function Role() {

  const { Column } = Table;
  const {Option} = Select
  console.log("RENDER");
  const { Title } = Typography;
  const history = useHistory();
  const [roleTitle,setRoleTitle]=useState("");
  const [roleUserID,setRoleUserID]=useState("");
  // State variable to trigger a re-render of component
  const [render,setRender]=useState(false);
const urlUserID= useParams("userId").userId;

  /**
   * This data is held in a state variable so that it wont reset every time the component
   * is re-rendered. This data represents the current state of data in sql
   */
  const [rawData,setRawData]= useState([
    {id: 1, roleTitle:"Pilot"},
    {id: 2, roleTitle:"Capitain"},
    {id: 3, roleTitle:"Officer"}
  ]);
  const userOptions=_.map([1,2,3,4,5,6,7,8,9,10],(element,index)=>{return <Option key={index} value={element} label={element}/>})
  function handleSelectUserChange(value){
    console.log(value)
    setRoleUserID(value)
    
  }
  /**
     * This function creates the data packet for antd's table. Because
     * the table is having issues we have to set deleted rows to null.
     */
    function createDataSource(){
      return _.map(rawData,(object,index)=>{
        return {
          key : index,
          id: object.id,
          roleTitle:  object.roleTitle,
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
              onClick={()=>{history.push(`/Actions/${urlUserID}`)}}
            >
              Available Actions
            </Button>
            <Button 
              onClick={()=>{history.push(`/Credentials/${urlUserID}`)}}
            >
              Credentials
            </Button>
            </div>
        }
      });
    }
    /** 
     * This function adds users to the table.
     * Because react only does shallow checks on object, we have to manually
     * retrigger a render using the render state variable. This isn't
     * the best programming practice, but oh well.
     */
    function addRoleToTable (){ 
      if(roleTitle === null || roleTitle.length === 0){
        message.error("Role was not filled out");
        return;
    }
      let tempRawData = rawData
      tempRawData.push({id: "",roleTitle:roleTitle, newUser:roleUserID});
      setRoleTitle("")
      setRoleUserID("")
      setRawData(tempRawData);
      setRender(!render);
    }
    let dataToBeUsed= []
    dataToBeUsed=createDataSource()
  return (
      <div style={{ width: "100%", height: "100%" }}>
        <Card style={{margin:"auto", width:"100%"}} 
        title={
        <Title style={{margin:"auto", width:"fit-content"}}>Roles</Title>
        } 
        >
          <p>
            The below roles belong to the user id {`${urlUserID}`}
          </p>
          <p>
            Users can make new roles for any user with a new role name.
            If a User ID is added a relationship between that user id and that new role will be created. The buttons on 
            that row will take the user to the new User specified.
          </p>
          <p>
          Users can navigate to the user id: {`${urlUserID}`} sessions, user id: {`${urlUserID}`} actions, 
          and  user id: {`${urlUserID}`} credentials
            Alternatively the user can navigate back to the main user table.
          </p>
       </Card>
        <Table style={{width:"auto"}} dataSource={dataToBeUsed}>
            <Column title="ID" dataIndex="id" key="id" />
            <Column title="Roles" dataIndex="roleTitle" key="roleTitle" />
            <Column title="Action" dataIndex="edit" key="edit" />
        </Table>
        <Card bordered style={{ width: 300 }}>
        <div style={{marginBottom:"16px"}}>
        <Button size="large" onClick={addRoleToTable}>
          Add Role
        </Button>
        </div>
        <Button style={{ width: "35%" }} disabled>
          Role
          </Button> 
        <Input 
        style={{ width: "55%" }}
          placeholder ="add role"
          value={roleTitle}
           onChange={(newValue)=>{setRoleTitle(newValue.currentTarget.value);}} 
        />    
        <Button style={{ width: "55%" }} disabled>
          User ID's to Add
          </Button> 
          <Select
          style={{ width: '35%' }}
          placeholder="User Id"
          // value={roleUserID}
          onChange={(value)=>{handleSelectUserChange(value)}}
          optionLabelProp="label"
        > {userOptions}</Select>
        {/* <InputNumber 
        min={1}
        style={{ width: "35%" }}
          placeholder ="User ID"
          value={roleUserID}
           onChange={(newValue)=>{setRoleUserID(newValue);}} 
        />     */}
        </Card>
      </div>
    );
}

export default Role;
