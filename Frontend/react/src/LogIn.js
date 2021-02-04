import { Input, Button, Card, Select } from "antd";
import { useState } from "react";
import { useHistory } from "react-router-dom";

import "antd/dist/antd.css";

const { Option } = Select;

function LogIn() {
  let history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("");
  function handleLogIn() {
    history.push("/Users");
    console.log(history);
  }
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Card
        title="Log In"
        bordered={false}
        style={{ width: "200px", height: "auto", margin: "auto" }}
      >
        <p>
          <Input
            placeholder="Username"
            onChange={(input) => {
              setUsername(input.currentTarget.value);
            }}
            style={{ maxWidth: 200, margin: "auto" }}
          />
        </p>
        <p>
          <Input
            placeholder="Password"
            onChange={(input) => {
              setPassword(input.currentTarget.value);
            }}
            style={{ maxWidth: 200, margin: "auto" }}
          />
        </p>
        <p>
          <Select
            defaultValue="Basic"
            style={{ width: 120 }}
            onChange={(value) => {
              setUserRole(value);
            }}
          >
            <Option value="Basic">Basic</Option>
            <Option value="super">Super</Option>
          </Select>
        </p>
        <p>
          <Button type="primary" onClick={handleLogIn}>
            Log In
          </Button>
        </p>
      </Card>
    </div>
  );
}

export default LogIn;
