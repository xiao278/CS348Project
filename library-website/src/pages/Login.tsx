import React, { useState, useEffect } from 'react';

import "./Login.css";

function Login({setPage}) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function fetchLogin(usr:string, pwd:string) {
        let response = await fetch("http://localhost:8080/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({username:usr, password:pwd})
            }
        )
        .then(response => {
            return response.json();
        });
        return response;
    }

    async function login_attempt(username: string, password: string) {
        let result = await fetchLogin(username, password);
        if (result.role === "reader" || result.role === "staff") {
            sessionStorage.setItem("username", username);
            sessionStorage.setItem("password", password);
            sessionStorage.setItem("role", result.role)
            setPage("reader");
        }
    }

    async function login_click () {
        // console.log(typeof(setPage));
        // setPage('reader');
        login_attempt(username, password);
    };

    useEffect(() => {
        // attempt to retrieve username and password
        if (username == "" || password == "") {
            let temp_usr = sessionStorage.getItem("username");
            let temp_pwd = sessionStorage.getItem("password");
            if (!temp_pwd || !temp_usr) {
                sessionStorage.clear();
            }
            else {
                login_attempt(temp_usr, temp_pwd);
            }
        }
    })

    return (
        <div className='Login-Container'>
            <div className='Login-Box'>
                <div className='Login-Field-Container'>
                    <p>Username</p>
                    <input type="text" onChange={(e) => {setUsername(e.target.value)}}></input>
                </div>
                <div className='Login-Field-Container'>
                    <p>Password</p>
                    <input type="password" onChange={(e) => {setPassword(e.target.value)}}></input>
                </div>
                <div className='Login-Field-Container'>
                    <button className='Login-Button' onClick={login_click}>Login</button>
                </div>
            </div>
        </div>
    );
}

export default Login;