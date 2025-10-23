import React, { useState } from "react";
import axios from "axios";

const authForm={
    name:"",
    email:"",
    password:"",
    profileImage:"",
    role:""
}

const RegisterPage=()=>{
const [auth,setAuth]=useState(authForm);
const onChange=(e)=>{
    setAuth({...auth,[e.target.name]:e.target.value})
}

const toBackend=async (e)=>{
    e.preventDefault();
    try {
        const {name,email,password,role}=auth;
        const res=await axios.post("http://localhost:5005/api/auth/register",{name,email,password,desiredRole:role});
        console.log("Registered:", res.data);
        alert("Registration successful!");
    } catch (error) {
        console.error(error);
        alert("Registration failed!");
    }
}

return(
<main className="registerContainer">
<h1>Register</h1>
<h2>Please fill in the registration information.</h2>
<form onSubmit={toBackend} className="resisterForm">
<label>Name:<input name="name" value={auth.name} onChange={onChange} required/></label>
<br /><br />

<label>Email:<input name="email" value={auth.email} onChange={onChange} required/></label>
<br /><br />
<label>Password:<input name="password" value={auth.password} onChange={onChange} required/></label>
<br /><br />
<label>ProfileImage:<input name="profileImage" value={auth.profileImage} onChange={onChange} /></label>
<br /><br />
<fieldset><legend>Role</legend>
<label>Customer<input type="radio" name="role" value="customer" checked={auth.role === "customer"} onChange={onChange} required/></label>
<br />
<label>Vendor<input type="radio" name="role" value="vendor" checked={auth.role === "vendor"} onChange={onChange} required/></label>
<br />
<label>Admin<input type="radio" name="role" value="admin" checked={auth.role === "admin"} onChange={onChange} required/></label>
</fieldset>
<br /><br />
<button type="submit">Register</button>
</form>
</main>
)
}

export default RegisterPage;