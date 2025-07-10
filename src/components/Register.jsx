    import "./Register.css";
    import { useState } from "react";
    import axios from "axios";
    export default  function Register(){
        const [user, setUser] = useState({});
        const [error, setError] = useState()
        const handleSubmit = async () =>{
            

        try {
            // const url = "http://localhost:8080/api/users/register"
            const url = "https://cafe-backend-wine.vercel.app/api/users/register"
            const result = await axios.post(url, user);
            setError("Data saved successfully")
        }
        catch(err){
            console(err)
            setError("Something went wrong")
        }
    }
        
        
    return (
        <div className="App-Register-Row">
        <div>
            <h2>Register Form</h2>
            {error}
            <p>
            <input type="text" onChange={(e) => setUser({ ...user, firstname: e.target.value })}
            placeholder="First Name"/>
            </p>

            <p>
            <input type="text" onChange={(e) => setUser({ ...user, lastname: e.target.value })}
            placeholder="Last Name"/>
            </p>

            <p>
            <input type="text" onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Email Address"/>
            </p>

            <p>
            <input type="text" onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Password"/>
            </p>

            <button onClick={handleSubmit}>Submit</button>
        </div>
                </div>
        );
    }