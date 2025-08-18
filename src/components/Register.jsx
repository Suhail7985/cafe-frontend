import "./Register.css";
// import { useRef } from "react";
import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
export default function Register() {
  const [user, setUser] = useState({});
  const [error, setError] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const Navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL
  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    try {
      const url = `${API_URL}/api/users/register`;
      const result = await axios.post(url, user);
      setError("Data saved successfully");
      Navigate("/login")
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  };
  return (
    <div className="App-Register-Row">
      <div className="register-card">
        <h2>Registration Form</h2>
        {error}
        <form onSubmit={handleSubmit} className="register-form-fields" noValidate>
          <label className="field">
            <span>First Name</span>
            <input
              type="text"
              onChange={(e) => setUser({ ...user, firstname: e.target.value })}
              placeholder="Enter First Name"
              value={user?.firstname || ""}
              required
            />
          </label>
          <label className="field">
            <span>Last Name</span>
            <input
              type="text"
              placeholder="Enter Last Name"
              onChange={(e) => setUser({ ...user, lastname: e.target.value })}
              value={user?.lastname || ""}
              required
            />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              placeholder="Enter Email Address"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              value={user?.email || ""}
              required
            />
          </label>
          <label className="field">
            <span>Password</span>
            <div className="password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                value={user?.password || ""}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </label>
          <label className="field">
            <span>Phone Number</span>
            <input
              type="tel"
              placeholder="Enter Phone Number"
              onChange={(e) => setUser({ ...user, phoneNo: e.target.value })}
              value={user?.phoneNo || ""}
              required
            />
          </label>
          <button type="submit" className="submit-btn">Create Account</button>
        </form>
        <hr />
        <Link to="/login">Already a member? Login Here...</Link>
      </div>
    </div>
  );
}
// export default function Register() {
//   const firstname = useRef();
//   const lastname = useRef();
//   const email = useRef();
//   const password = useRef();
//   const handleSubmit = () => {
//     const user = {
//       firstname: firstname.current.value,
//       lastname: lastname.current.value,
//       email: email.current.value,
//       password: password.current.value,
//     };
//     console.log(user);
//   };
//   return (
//     <div className="App-Register-Row">
//       <div style={{ backgroundColor: "white" }}>
//         <h2>Registration Form</h2>
//         <p>
//           <input type="text" placeholder="Enter First Name" ref={firstName} />
//         </p>
//         <p>
//           <input type="text" placeholder="Enter Last Name" ref={lastName} />
//         </p>
//         <p>
//           <input type="text" placeholder="Enter Email Address" ref={email} />
//         </p>
//         <p>
//           <input type="password" placeholder="Enter Password" ref={password} />
//         </p>
//         <p>
//           <button onClick={handleSubmit}>Submit</button>
//         </p>
//       </div>
//     </div>
//   );
// }
