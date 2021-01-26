import React, { useState } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography } from 'antd';

function User () {
const originData = [];

for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      width: '25%',
      editable: true,
    },
    {
      title: 'age',
      dataIndex: 'age',
      width: '15%',
      editable: true,
    },
    {
      title: 'address',
      dataIndex: 'address',
      width: '40%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href="javascript:;"
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};
}


// import { Table, Button, Typography } from 'antd';
// import {useState} from 'react';
// import {
//   useHistory
// } from "react-router-dom";
// import { unmountComponentAtNode } from 'react-dom';

// import logo from './logo.svg';

// // import './App.css';
// import 'antd/dist/antd.css';

// const { Column, ColumnGroup } = Table;
// function User() {
//     const { Title } = Typography;
//     const history = useHistory();
//     const dataSource = [
//         {
//           key: '1',
//           username: 'Mike',
//           email: "blah@oregonstate.edu",
//           edit: 
//           <div>
//             <Button 
//               onClick={()=>{history.push("/Sessions/:1")}}
//             >
//               Sessions
//             </Button>
//             <Button 
//               onClick={()=>{history.push("/Roles/:1")}}
//             >
//               Roles
//             </Button>
//             <Button 
//               onClick={()=>{history.push("/Actions/:1")}}
//             >
//               Available Actions
//             </Button>
//             <Button 
//               onClick={()=>{history.push("/Credentials/:1")}}
//             >
//               Credentials
//             </Button>
//             </div>
//         },
//         {
//           key: '2',
//           username: 'John',
//           email: "blah@gmail.com",
//           edit: <div><Button>Edit</Button> <Button>View History</Button></div>
//         },
//       ];
      
//   const [username, setUsername] = useState("");
//   return (
//       <div style={{ width: "100%", height: "100%" }}>
//         <Title style={{margin:"auto", width:"fit-content"}}>Edit Users</Title>
//         <Table style={{width:"auto"}} dataSource={dataSource}>
//             <Column title="Username" dataIndex="username" key="username" />
//             <Column title="Email" dataIndex="email" key="email" />
//             <Column title="Created" dataIndex="createdAt" key="createdAt" />
//             <Column title="" dataIndex="edit" key="edit" />
//         </Table>;
//       </div>
//     );
// }

export default User;
