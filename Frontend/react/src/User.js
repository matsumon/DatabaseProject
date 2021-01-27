import { Table, Button, Typography, Input, Popconfirm, message } from 'antd';
import {useState} from 'react';
import {
  useHistory
} from "react-router-dom";
import _ from "lodash";
import 'antd/dist/antd.css';

const { Column } = Table;
function User() {
  console.log("RENDER");
    const { Title } = Typography;
    const history = useHistory();
    const [edit,setEdit]=useState(-1);
    const [username,setUsername]=useState("");
    const [created,setCreated]=useState("");
    const [email,setEmail]=useState("");
    const [render,setRender]=useState(false);
    const [deleteEdit,setDeleteEdit]=useState(-1);
    const [rawData,setRawData]= useState([
      {username: "Mike",created:"1/2/21", email:"blahblah@gmail.com"},
      {username: "Lucy",created:"21/2/31", email:"dsfadsa@gmail.com"},
      {username: "Will",created:"1/123/21", email:"asdfdf@gmail.com"}
    ]);
    const [deleted,setDeleted]=useState([]);
  // console.log(rawData);
  function deleteConfirm(e){
    // let temporaryRawData= rawData;
    // console.log(temporaryRawData)
    // temporaryRawData.splice(e,1);
    // console.log(temporaryRawData)
    // setRawData(temporaryRawData);
    // // setRawData(temporaryRawData);
    // setDeleteEdit(-1);
    // let temporaryData=_.map(rawData,(object,index)=>{
    //   // console.log(object)
    //   if(index!==e){
    //     return object
    //   }
    //   return null;
    // })
    // console.log(_.compact(temporaryData))
    setDeleteEdit(-1);
    let copy = deleted
    copy.push(e)
    setDeleted(copy)
    // setRawData(_.compact(temporaryData))
    setRender(!render)
  }
  function deleteCancel(e){
    setDeleteEdit(-1);
  }
    function confirm(e) {
      message.success('Click on Yes');
      let tempRawData = rawData;
      tempRawData[e].username= username;
      tempRawData[e].created= created;
      tempRawData[e].email= email;
      setRawData(tempRawData);
      setUsername("");
      setCreated("");
      setEmail("");
      setEdit(-1);
    }
    function cancel(e) {
      message.success('Click on Cancel');
      setUsername("");
      setCreated("");
      setEmail("");
      setEdit(-1);
    }
    function createDataSource(){
      console.log("RUNNING")
      return _.map(rawData,(object,index)=>{
        let skip=false
        _.map(deleted,(value)=>{
          if(value===index){
            skip=true
          } 
        })
        if(!skip){
        return {
          key : index,
          username: <Input 
                      onChange={(newValue)=>{setUsername(newValue.currentTarget.value);}} 
                      disabled={index !== edit} 
                      defaultValue={object.username}
                    />,
          created: <Input 
                      onChange={(newValue)=>{setCreated(newValue.currentTarget.value); }} 
                      disabled={index !==edit} 
                      defaultValue={object.created}
                    />,
          email: <Input 
                    onChange={(newValue)=>{setEmail(newValue.currentTarget.value);}} 
                    disabled={index !==edit} 
                    defaultValue={object.email}
                  />,
          edit: 
          <div>
            <Button 
              onClick={()=>{history.push(`/Sessions/:${index}`)}}
            >
              Sessions
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
                    // console.log("INDEx",index)
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
    // dataSource=createDataSource(rawData);
    // console.log(dataSource)
    function addUserToTable (){ 
      let index =rawData.length;
      let tempRawData = rawData
      tempRawData.push({username: "",created:"", email:""});
      setRawData(tempRawData);
      setRender(!render);
    }
    let dataToBeUsed= []
    dataToBeUsed=createDataSource()
    console.log("delete",deleted)
    _.forEach(deleted,(index,iterator)=>{
      if(index===iterator){
        dataToBeUsed[index]= null;
      } 
    })
    console.log(dataToBeUsed,deleted)
    // dataToBeUsed=_.compact(dataToBeUsed)
    // console.log(dataToBeUsed[0].username.props.defaultValue)
    // console.log(dataToBeUsed[dataToBeUsed.length-1].username.props.defaultValue)

  return (
      <div style={{ width: "100%", height: "100%" }}>
        <Title style={{margin:"auto", width:"fit-content"}}>Users</Title>
        <Table style={{width:"auto"}} dataSource={dataToBeUsed}>
            <Column title="Username" dataIndex="username" key="username" />
            <Column title="Created" dataIndex="created" key="created" />
            <Column title="Email" dataIndex="email" key="email" />
            <Column title="Action" dataIndex="edit" key="edit" />
        </Table>;
        <Button onClick={addUserToTable}>
          Add User
        </Button>
      </div>
    );
}

export default User;
