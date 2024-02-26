import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

const SignUp = () => {
    const [credentials, setCredentials] = useState({name:"", email:"", password:"", cpassword:""})
    let history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {name, email, password} = credentials;
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });
        const json = await response.json();
        console.log(json);
        if (json.success){
            // Save the Auth-Token & Redirect
            localStorage.setItem('token', json.authtoken);
            history.push("/");
        } else {
            alert("Invalid credentials")
        }
    }

    return (
        <div className='container'>
            <form>
                <div className="mb-3">
                    <label for="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name="name" onChange={handleSubmit} />
                </div>
                <div className="mb-3">
                    <label for="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" onChange={handleSubmit} aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label for="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" onChange={handleSubmit} minLength={5}required/>
                </div>
                <div className="mb-3">
                    <label for="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={handleSubmit} minLength={5}required/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default SignUp
