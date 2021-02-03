import { Table, Button, Typography, Input, Popconfirm, message,Select, Card, Modal, InputNumber  } from 'antd';
import {useState} from 'react';
import {
  useHistory,
  useParams
} from "react-router-dom";
import _ from "lodash";
import 'antd/dist/antd.css';

function Action() {
  const { Option } = Select;
  const { Column } = Table;
  console.log("RENDER");
  const { Title } = Typography;
  const history = useHistory();
  // The edit variable tells which component is allowed to edit its contents
  const [edit,setEdit]=useState(-1);
  const [action,setAction]=useState("");
  const [roleID,setRoleID]=useState("");
  const [actionSearch,setActionSearch]=useState("");
  const [idSearch,setIdSearch]=useState([]);
  const [results,setResults]=useState(false);
  // State variable to trigger a re-render of component
  const [render,setRender]=useState(false);
  // The delete variable tells which component is allowed to delete its contents
  const [deleteEdit,setDeleteEdit]=useState(-1);
  const urlUserID= useParams("userId").userId;
  /**
   * This data is held in a state variable so that it wont reset every time the component
   * is re-rendered. This data represents the current state of data in sql
   */
  const [searchResultsComponent,setSearchResultsComponent]= useState([])
  const [rawData,setRawData]= useState([
    {id: 3, action:"Fly",mmRoleID:[1,2,3]},
    {id: 5, action:"Open",mmRoleID:[4,5,6]},
    {id: 4, action:"Create",mmRoleID:[7,8]}
  ]);
  const actionOptions =_.map(rawData,(element)=>{return <Option value={element.id} label={element.id}/>})
  function numbersCheck(check){
    const re = /^[0-9,]+$/
    if(check){
      console.log(check)
      return check.match(re)
    } 
    return;
  }
  function handleSelectChange(value, id){
    console.log(value,id)
  }
  function handleSelectRoleChange(value){
    console.log(value)
    setRoleID(value)
    
  }
  function handleSearchActionChange(value){
    console.log(value)
    setIdSearch(value)
    
  }
  let options = _.map([1,2,3,4,5,6,7,8,9,10],(element)=>{return <Option value={element} tag = {element}/>})
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
        message.error("Action cannot be empty ");
        return;
      }
      console.log("ACTION",action)
      let tempRawData = rawData;
      tempRawData[e].action= action;
      setRawData(tempRawData);
      setAction("");
      // setRoleID("")
      setEdit(-1);
    }
  //Resets state variable on cancelation of edit
    function cancel(e) {
      setAction("");
      // setRoleID("")
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
          // let options= null;
          let defaultOptions=null;
          if(object.mmRoleID){
          //  options = _.map(object.mmRoleID.split(","),(element)=>{return <Option value={element} tag = {element}/>})
           defaultOptions = _.map(object.mmRoleID,(element)=>{return element})
          }
        return {
          key : index,
          id: object.id,
          action: <Input 
                      onChange={(newValue)=>{setAction(newValue.currentTarget.value);}} 
                      disabled={index !== edit} 
                      defaultValue={object.action}
                    />,
          mmRoleID: 
          <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="select Role Id's"
          defaultValue={defaultOptions?defaultOptions:undefined}
          onChange={(value)=>{handleSelectChange(value, object.id)}}
          optionLabelProp="label"
        > {options}</Select>,
          
          
          
          // <div>{options}</div>,
          // <Input 
          //             onChange={(newValue)=>{
          //               if(newValue.currentTarget.value[newValue.currentTarget.value.length -1]== 0){
          //                 newValue.currentTarget.value[newValue.currentTarget.value.length -1]= 1
          //                 return;
          //               }
          //               setRoleID(numbersCheck(newValue.currentTarget.value))
          //               return roleID
          //             }} 
          //             disabled={index !== edit} 
          //             defaultValue={numbersCheck(object.mmRoleID)}
          //           />,
  //         <Menu onClick={}>
  //   <Menu.Item key="1">1st menu item</Menu.Item>
  //   <Menu.Item key="2">2nd menu item</Menu.Item>
  //   <Menu.Item key="3">3rd menu item</Menu.Item>
  // </Menu>,
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
                    setAction(rawData[index].action)
                    // setRoleID(rawData[index].mmRoleID)
                  }}
                >
                  Edit Action
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
      tempRawData.push({id: "",action:action,mmRoleID:roleID});
      setRawData(tempRawData);
      setAction("")
      setRoleID("")
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
            {`The below actions belong to the user id: ${urlUserID}`}
          </p>
          <p>
            Users can create, read, update, and delete actions. Users can add actions to roles by specifying role id's.
            Adding M:M relationships between actions and different users other than the main user shown in the url 
            will populate the table but will not automatically belong to the current user or current role.
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
            <Column title="Role ID's" dataIndex="mmRoleID" key="mmRoleID" />
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
         <Button style={{ width: "65%" }} disabled>
          Role IDs to add action
          </Button>
          <Select
          mode="multiple"
          style={{ width: '35%' }}
          placeholder="Role Id's To Add"
          onChange={(value)=>{handleSelectRoleChange(value)}}
          optionLabelProp="label"
        > {options}</Select>
        {/* <InputNumber
        style={{ width: "35%" }}
          placeholder ="Role ID"
          parser={value=>numbersCheck(value)}
          value={roleID}
           onChange={(newValue)=>{setRoleID(newValue);}} 
        />  */}
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
          Filter All Actions
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
        <Button style={{ width: "35%" }} disabled>
          Action ID
          </Button>
          <Select
          mode="multiple"
          value={idSearch}
          style={{ width: '65%' }}
          placeholder="Role Id's To Add"
          onChange={(value)=>{handleSearchActionChange(value)}}
          optionLabelProp="label"
        > {options}</Select>
          {/* <InputNumber 
          placeholder ="Filter By Action ID"
          min={1}
          value={idSearch}
           onChange={(value)=>{setIdSearch(value);}} 
        />  */}
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
