import { Table, Button, Typography, Input, Popconfirm, message, DatePicker, Card, InputNumber,Select } from 'antd';
import {useState} from 'react';
import {
  useHistory,
    useParams
} from "react-router-dom";
import _ from "lodash";
import 'antd/dist/antd.css';
const { Option } = Select;
function Credential() {
  const { Column } = Table;
  console.log("RENDER");
  const { Title } = Typography;
  const history = useHistory();
  // The edit variable tells which component is allowed to edit its contents
  const [edit,setEdit]=useState(-1);
  const [userID,setUserID]=useState("");
  const [hash,setHash]=useState("");
  const [expired,setExpired]=useState("");
  const [enabled,setEnabled]=useState("");
  const [created,setCreated]=useState("");
  // State variable to trigger a re-render of component
  const [render,setRender]=useState(false);
  const urlUserID= useParams("userId").userId;
  /**
   * This data is held in a state variable so that it wont reset every time the component
   * is re-rendered. This data represents the current state of data in sql
   */
  const [rawData,setRawData]= useState([
    {id: 1, userID: 3,hash:"112312312dsf", expired:"1/2/21", enabled:"true",created: "2/2/12"},
    {id: 2, userID: 2,hash:"asdfdas312dsf", expired:"3/4/21", enabled:"false",created: "9/2/12"},
    {id: 3, userID: 6,hash:"asdfsdaf32", expired:"1/29/21", enabled:"true",created: "21/2/12"}
  ]);
  /**
   * This state has to exist because antd's table is having issues when the
   * data being fed to it has a deletion. This variable holds the indexes of
   * the raw data that has been deleted.
   */
  /**
   * This function saves the updated row to the raw state variables 
   * and resets the username,created,email, and edit varibles.
   */
    function confirm(e) {
      let tempRawData = rawData;
      tempRawData[e].userID= "null";
      setRawData(tempRawData);
      setEdit(-1);
    }
  //Resets state variable on cancelation of edit
    function cancel(e) {
      setEdit(-1);
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
          userID: <Input 
                      onChange={(newValue)=>{setUserID(newValue.currentTarget.value);}} 
                      disabled={index !== edit} 
                      defaultValue={object.userID}
                    />,
          created: object.created,
          enabled: object.enabled,
          hash: object.hash,
          expired: object.expired,
          edit: 
          <div>
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
              onClick={()=>{history.push(`/Actions/${urlUserID}`)}}
            >
              Available Actions
            </Button>
            <Button 
              onClick={()=>{history.push(`/Sessions/${urlUserID}`)}}
            >
              Sessions
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
                type="primary"
                  disabled={index === edit || edit !== -1}
                  onClick={()=>{
                    setEdit(index)
                  }}
                >
                  Set User ID
                </Button>
              </Popconfirm>
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
    function addCredentialToTable (){ 
      if(enabled.length === 0 || created.length === 0 || expired.length === 0){
        message.error("Enable Credential, Created Date or Expiration Date were not filled out");
        return;
    }
      let tempRawData = rawData
      tempRawData.push({id: "", userID: userID,hash:hash, expired:expired,enabled:enabled,created: created});
      setUserID("")
      setHash("")
      setRawData(tempRawData);
      setRender(!render);
    }
    let dataToBeUsed= []
    dataToBeUsed=createDataSource()
  return (
      <div style={{ width: "100%", height: "100%" }}>
        <Card style={{margin:"auto", width:"100%"}} 
        title={
        <Title style={{margin:"auto", width:"fit-content"}}>Credentials</Title>
        } 
        >
          <p>
            The below Credentials belong to the user id {`${urlUserID}`}
          </p>
          <p>
            Users can make new credentials for any user with a user id, hash, created date,
            expiration date, and whether to enable credential. User ID and the hash are both optional with
            user id being nullable
          </p>
          <p>
          Users can navigate to the user id: {`${urlUserID}`} sessions,  user id: {`${urlUserID}`} roles, and  user id: {`${urlUserID}`} actions.
            Alternatively the user can navigate back to the main user table.
          </p>
          <p>
            Users can edit the user id, a foreign key to be anything including null
          </p>
       </Card>
        <Table style={{width:"auto"}} dataSource={dataToBeUsed}>
            <Column title="ID" dataIndex="id" key="id" />
            <Column title="User ID" dataIndex="userID" key="userID" />
            <Column title="Hash" dataIndex="hash" key="hash" />
            <Column title="Created Date" dataIndex="created" key="created" />
            <Column title="Enabled" dataIndex="enabled" key="enabled" />
            <Column title="Expiration Date" dataIndex="expired" key="expired" />
            <Column title="Action" dataIndex="edit" key="edit" />
        </Table>
        <Card bordered style={{ width: 300 }}>
        <div style={{marginBottom:"16px"}}>
        <Button size="large" onClick={addCredentialToTable}>
          Add Credential
        </Button>
        </div>
        <Button style={{ width: "35%" }} disabled>
          User ID
          </Button>
          <InputNumber 
          placeholder ="User"
          min={1}
          value={userID}
           onChange={(value)=>{setUserID(value);}} 
        />
        <Button style={{ width: "35%" }} disabled>
          Hash
          </Button>
        <Input 
        style={{ width: "65%" }}
          placeholder ="Hash"
          value={hash}
           onChange={(newValue)=>{setHash(newValue.currentTarget.value);}} 
        /> 
        <Button style={{ width: "45%" }} disabled>
          Created Date
          </Button>
        <DatePicker
        style={{ width: "55%" }}
        placeholder="Created Date"
          onChange={(date,dateString)=>{setCreated(dateString); }}  
        />
         <Button style={{ width: "50%" }} disabled>
          Enable Credential
          </Button>
          <Select placeholder="Enable Credential" style={{ width: "50%" }} onChange={(value)=>setEnabled(value)}>
      <Option value="true">True</Option>
      <Option value="false">False</Option>
      </Select>
         <Button style={{ width: "50%" }} disabled>
          Expiration Date
          </Button>
        <DatePicker
        style={{ width: "50%" }}
        placeholder="Expiration Date"
          onChange={(date,dateString)=>{setExpired(dateString); }}  
        />

        </Card>
      </div>
    );
}

export default Credential;
