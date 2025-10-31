import React, { useState } from "react";
import http from "../config/api";
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

const toBackend = async (e) => {
  e.preventDefault();

  const payload = {
    email: (login.email || "").trim(),
    password: (login.password || "").trim(),
  };

  if (!payload.email || !payload.password) {
    alert("Email/Password required");
    return;
  }

  try {
    const res = await http.post("/auth/login", payload);
    const { token, user } = res.data;
    loginUser(token, user);
    if (user.role==="admin"){ alert("Admin logIn successful!");  navigate("/"); }
    else if (user.role==="vendor"){ alert("Vendor logIn successful!"); navigate("/"); }
    else{ alert("Custom logIn successful!"); navigate("/"); }
  } catch (err) {
    console.error(
      "LOGIN ERROR ->",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    alert(
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      "LogIn failed!"
    );
  }
};
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