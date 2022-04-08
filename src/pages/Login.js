import React, { useState } from "react";
import './Login.css';
import Axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login(setToken) {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState('');

    const displayInfo = () => {
        console.log(email);
        console.log(password);
        setEmail("");
        setPassword("");
    };

    const login = () => {
        //http://ec2-3-93-234-9.compute-1.amazonaws.com:3000/api/login
        Axios.post("http://localhost:3000/api/login", {
            email: email,
            password: password,
        }).then((response) => {
            console.log(response);
            if(response.data.message) {
                setLoginStatus(response.data.message);
            }
            else{
                setLoginStatus("Greetings, " + response.data[0].fName);
                localStorage.setItem("userInfo", JSON.stringify(response.data[0]));
                navigate('/');
                window.location.reload(false);
            }
        });
    };

    return (
        <login>
            <div className="login-wrapper">
                <h2>Log in</h2>
                {/* <button onClick={displayInfo}>Log In</button> */}
                <label>
                    <p>Email</p>
                    <input type="text" placeholder="Enter Email" onChange={(e)=> {setEmail(e.target.value);}}/>
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" placeholder="Enter Password" onChange={(e)=> {setPassword(e.target.value);}}/>
                </label>
                    <button type="submit" onClick={login}>Submit</button>
            </div>
            <h1> {loginStatus}</h1>
        </login>
    )
}