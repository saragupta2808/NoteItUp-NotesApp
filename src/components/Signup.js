import React ,{useState} from 'react'
import { useNavigate } from "react-router-dom";

export default function Signup(props) {
  const [credentials, setCredentials] = useState({name:"",email: "", password:"",cpassword:""});
    let navigate= useNavigate();
    const host = "http://localhost:5000";
    const handleSubmit= async(e)=>{
        e.preventDefault(); //to prevent page from reloading on clicking submit button
        
        const {name,email,password}=credentials;
        const response = await fetch(`${host}/api/auth/createuser`, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
      
            headers: {
              "Content-Type": "application/json",
             
            },
      
            body: JSON.stringify({ name,email, password}), // body data type must match "Content-Type" header
          });
          const json= await response.json();
          console.log(json);
          if(json.success)
          {
            //save the authtoken and redirect
            localStorage.setItem('token',json.authtoken);
            navigate("/");
            props.showAlert("Account Created Successfully","success");
          }
          else{
            props.showAlert("Invalid Credentials", "danger");
          }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
      };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            aria-describedby="emailHelp"
            name="name"
            id="name"
            onChange={onChange}
            minLength={3}
            required
          />
          
        </div>
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
            onChange={onChange}
            minLength={3}
            required
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
            onChange={onChange}
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="cpassword"
            name="cpassword"
            onChange={onChange}
            minLength={5}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  )
}
