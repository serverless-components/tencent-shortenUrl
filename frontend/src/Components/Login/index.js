import { useState } from "react";
import { Input, Button } from "antd";
import "./index.css";

const Login = () => {
    const [authPass, setAuthpass] = useState("");
    const submit = () => {
        window.localStorage.setItem("authPass", authPass);
        window.location.replace("/");
    };
    return (
        <div className="login">
            <Input
                style={{ width: 400 }}
                placeholder="请输入登录密码"
                defaultValue={authPass}
                onChange={(e) => setAuthpass(e.target.value)}
            />
            <Button onClick={() => submit()} type="primary">
                登陆
            </Button>
        </div>
    );
};

export default Login;
