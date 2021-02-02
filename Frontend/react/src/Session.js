import { Table, Button, Typography, Input,InputNumber, message, DatePicker, Card } from 'antd';
import {useState} from 'react';
import {
  useHistory,
  useParams
} from "react-router-dom";
import _ from "lodash";
import 'antd/dist/antd.css';

function Session() {
  const { Column } = Table;
  console.log("RENDER");
  const { Title } = Typography;
  const history = useHistory();
  const [userID,setUserID]=useState("");
  const [token,setToken]=useState("");
  const [expired,setExpired]=useState("");
  const [requested,setRequested]=useState("");
  const [created,setCreated]=useState("");
  // State variable to trigger a re-render of component
  const [render,setRender]=useState(false);
  const urlUserID= useParams("userId").userId;
  console.log("urlUserID",urlUserID)
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
     * This function creates the data packet for antd's table. Because
     * the table is having issues we have to set deleted rows to null.
     */
    function createDataSource(){
      return _.map(rawData,(object,index)=>{
        return {
          key : index,
          id: object.id,
          userID:
                     object.userID,
                    
          created:
                     object.created,
                    
          requested:  
                   object.requested,
                  
          token: 
                   object.token,
                  
          expired:
                   object.expired,
                  
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
    function addSessionToTable (){ 
      console.log(userID)
      if(
        userID === null 
        || token === null 
        || userID.length === 0
        || created.length === 0 
        || requested.length === 0 
        || expired.length === 0 
        || token.length === 0
        ){
        message.error("Some fields were not filled out");
        return;
    }
      let tempRawData = rawData
      tempRawData.push({id: "", userID:userID,token:token, expired:expired,requested:requested,created: created});
      setUserID("");
      setToken("");
      setRawData(tempRawData);
      setRender(!render);
    }
    let dataToBeUsed= []
    dataToBeUsed=createDataSource()
  return (
      <div style={{ width: "100%", height: "100%" }}>
        <Card style={{margin:"auto", width:"100%"}} 
        title={
        <Title style={{margin:"auto", width:"fit-content"}}>Sessions</Title>
        } 
        >
          <p>
            The below sessions belong to the user id {`${urlUserID}`}
          </p>
          <p>
            Users can make new sessions for any user with a user id, token, created date,
            requested date, and expiration date.
          </p>
          <p>
          Users can navigate to the user id: {`${urlUserID}`} credentials,  user id: {`${urlUserID}`} roles, and  user id: {`${urlUserID}`} actions.
            Alternatively the user can navigate back to the main user table.
          </p>
       </Card>
        <Table style={{width:"auto"}} dataSource={dataToBeUsed}>
            <Column title="ID" dataIndex="id" key="id" />
            <Column title="User ID" dataIndex="userID" key="userID" />
            <Column title="Token" dataIndex="token" key="token" />
            <Column title="Created" dataIndex="created" key="created" />
            <Column title="Requested" dataIndex="requested" key="requested" />
            <Column title="Expired" dataIndex="expired" key="expired" />
            <Column title="Action" dataIndex="edit" key="edit" />
        </Table>
        <Card bordered style={{ width: 300 }}>
        <div style={{marginBottom:"16px"}}>
          <Button size="large" onClick={addSessionToTable}>
            Add Session
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
          Token
          </Button>
        <Input 
        style={{ width: "65%" }}
          placeholder ="Token"
          value={token}
           onChange={(newValue)=>{setToken(newValue.currentTarget.value);}} 
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
          Requested Date
          </Button>
        <DatePicker
        style={{ width: "50%" }}
        placeholder="Requested Date"
          onChange={(date,dateString)=>{setRequested(dateString); }}  
        />
         <Button style={{ width: "45%" }} disabled>
          Expiration Date
          </Button>
        <DatePicker
        style={{ width: "55%" }}
        placeholder="Expiration Date"
          onChange={(date,dateString)=>{setExpired(dateString); }}  
        />
        </Card>
      </div>
    );
}

export default Session;
