import React, { useState } from "react";
import axios from "axios";
import {useAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
import {API_BASE} from "../config/api";




const loginForm={
    email:"",
    password:""
}

const LoginPage=()=>{
    const [login,setLogin]=useState(loginForm);
    const {loginUser}=useAuth();
    console.log('loginUser=', loginUser);
    const navigate=useNavigate();
    const onChange=(e)=>{
    setLogin({...login,[e.target.name]:e.target.value})
}

const toBackend=async(e)=>{
     e.preventDefault();
    try {
    const res=await axios.post(`${API_BASE}/api/auth/login`, login);
    const {token,user} = res.data;
    loginUser(token, user);
    if (user.role === "admin") {navigate("/admin");alert("Admin logIn successful!");}
    else if (user.role === "vendor") {navigate("/vendor");alert("Vendor logIn successful!")}
    else {navigate("/");alert("Custom logIn successful!")}      
    } catch (error) {
        console.error(error);
        alert("LogIn failed!");
  }
     
}

    return(
        <main className="loginContainer">
        <h1>Login Page</h1>
        <br />
        <h2>Please enter your email and password to log in.</h2>
        <br /><br />
        <form onSubmit={toBackend} className="loginForm">
         <br /><br />
        <label>Email:<input name="email" value={login.email} onChange={onChange} required/></label>
         <br /><br />
        <label>Password:<input name="password" value={login.password} onChange={onChange} required/></label>
         <br /><br />
        <button type="submit">LogIn</button>
        </form>
        </main>

    )
}




export default LoginPage;