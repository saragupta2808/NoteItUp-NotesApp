import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login(props) {
    const [credentials, setCredentials] = useState({email: "", password:""});
    let navigate= useNavigate();
    const host = "http://localhost:5000";
    const handleSubmit= async(e)=>{
        e.preventDefault(); //to prevent page from reloading on clicking submit button
        
       const {email,password}=credentials;
        const response = await fetch(`${host}/api/auth/login`, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
      
            headers: {
              "Content-Type": "application/json",
             
            },
      
            body: JSON.stringify({ email, password}), // body data type must match "Content-Type" header
          });
          const json= await response.json();
          console.log(json);
          if(json.success)
          {
            //save the authtoken and redirect
            localStorage.setItem('token',json.authtoken);
            navigate("/");
            props.showAlert("Successfully logged in","success");
          }
          else{
            props.showAlert("Invalid Credentials","danger");
          }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
      };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            aria-describedby="emailHelp"
            name="email"
            id="email"
           // value={credentials.email}
            onChange={onChange}
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
           // value={credentials.password}
            onChange={onChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
