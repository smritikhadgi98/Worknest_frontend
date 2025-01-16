import React, { useContext, useState } from "react";
import { FaRegUser, FaUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { FaPencilAlt } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
   const [passwordVisible, setPasswordVisible] = useState(false);  // State for password visibility
  

  const { isAuthorized, setIsAuthorized, user, setUser } = useContext(Context);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        { name, phone, email, role, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setRole("");
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if(isAuthorized){
    return <Navigate to={'/'}/>
  }


  return (
    <>
      <section className="authPage">
        <div className="container">
          <div className="header">
            <img src="logo.png" alt="logo" />
            <h3>Create a new account</h3>
          </div>
          <form>
          <div className="inputTag2">
            <label>Login As</label>
            <div className="radioGroup">
              <label>
                <input
                  type="radio"
                  value="Employer"
                  checked={role === "Employer"}
                  onChange={(e) => setRole(e.target.value)}
                />
                
                Employer
              </label>
              <label>
                <input
                  type="radio"
                  value="Job Seeker"
                  checked={role === "Job Seeker"}
                  onChange={(e) => setRole(e.target.value)}
                />
                Job Seeker
              </label>
            </div>
          </div>
            <div className="inputTag">
              <label>Name</label>
              <div>
                <input
                  type="text"
                  placeholder="Zeeshan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <FaUser />
              </div>
            </div>
            <div className="inputTag">
              <label>Email Address</label>
              <div>
                <input
                  type="email"
                  placeholder="zk@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <MdOutlineMailOutline />
              </div>
            </div>
            <div className="inputTag">
              <label>Phone Number</label>
              <div>
                <input
                  type="text"
                  placeholder="12345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <FaPhoneFlip />
              </div>
            </div>
             <div className="inputTag">
              <label>Password</label>
              <div>
                <input
                  type={passwordVisible ? "text" : "password"} // Toggle input type
                  placeholder="Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                 <span
                  className="togglePassword"
                  onClick={() => setPasswordVisible(!passwordVisible)} // Toggle visibility
                >
                  {passwordVisible ? (
                    <i className="fas fa-eye"></i> // Eye slash when visible
                  ) : (
                    <i className="fas fa-eye-slash"></i> // Eye when hidden
                  )}
                </span>
                <RiLock2Fill />
               
              </div>
            </div>
            <button type="submit" onClick={handleRegister}>
              Register
            </button>
            <div className="separator">
    <span>OR</span>
  </div>
            <Link to={"/login"}>Login
            </Link>
          </form>
        </div>
        <div className="banner">
          <img src="/register.png" alt="login" />
        </div>
      </section>
    </>
  );
};

export default Register;
