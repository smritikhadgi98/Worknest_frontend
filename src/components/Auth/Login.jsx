import React, { useContext, useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import the eye icons
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility

  const { isAuthorized, setIsAuthorized } = useContext(Context);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { email, password, role },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setEmail("");
      setPassword("");
      setRole("");
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isAuthorized) {
    return <Navigate to={"/job/getall"} />;
  }

  return (
    <section className="authPage">
      <div className="container">
        <div className="header">
          <img src="/logo.png" alt="logo" />
          <h3>Login to your Account</h3>
        </div>
        <form onSubmit={handleLogin}>
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
          {/* Forgot Password */}
          <div
            style={{
              textAlign: "right",
              marginTop: "5px",
            }}
          >
            <span
              onClick={() => navigate("/forgot-password")}
              style={{
                color: "#666464",
                cursor: "pointer",
                fontSize: "0.9rem",
                textDecoration: "underline",
              }}
            >
              Forgot Password?
            </span>
          </div>
          <button type="submit">Login</button>
          <div className="separator">
            <span>OR</span>
          </div>
          <Link to={"/register"}>Register</Link>
        </form>
      </div>
      <div className="banner">
        <img src="/login.png" alt="login illustration" />
      </div>
    </section>
  );
};

export default Login;
