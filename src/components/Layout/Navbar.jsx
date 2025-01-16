import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../main";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaHome,
  FaClipboardList,
  FaCalendarCheck,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { matchPath } from "react-router-dom";

const Sidebar = () => {
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const location = useLocation();

  const [activeItem, setActiveItem] = useState("dashboard");

  const hideSidebarPages = ["/login", "/register", "/forgot-password","/video-call"];

  const isHideSidebar =
    hideSidebarPages.includes(location.pathname) ||
    matchPath("/reset-password/:token", location.pathname) !== null;

  useEffect(() => {
    if (hideSidebarPages.includes(location.pathname)) {
      setActiveItem("dashboard");
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
      setIsAuthorized(true);
    }
  };

  const styles = {
    sidebar: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "250px",
      height: "100%",
      background: "#C6D6C6",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: "20px",
      zIndex: 1000,
      transition: "left 0.3s ease",
    },
    logo: {
      marginBottom: "20px",
      width: "150px",
      height: "auto",
      textAlign: "center",
    },
    logoImg: {
      width: "100%",
      height: "auto",
    },
    menu: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      width: "100%",
      textAlign: "center",
    },
    menuItem: {
      width: "100%",
      textAlign: "center",
      margin: "20px 0",
    },
    link: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      textDecoration: "none",
      color: "#000",
      fontSize: "18px",
      padding: "15px 20px",
      width: "100%",
      borderRadius: "10px",
      background: "transparent",
      transition: "transform 0.3s, background 0.3s, color 0.3s",
      gap: "10px",
    },
    activeLink: {
      background: "#fff",
      color: "#184235",
      fontWeight: 600,
      borderRadius: "50px 0 0 50px",
      boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
      transform: "translateX(20px)",
    },
    button: {
      fontSize: "18px",
      fontWeight: 600,
      border: "none",
      borderRadius: "5px",
      background: "transparent",
      color: "#000",
      cursor: "pointer",
      transition: "background 0.3s, color 0.3s",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: "15px 20px",
      width: "100%",
      gap: "10px",
    },
  };

  return (
    <>
      {!isHideSidebar && (
        <div style={styles.sidebar}>
          <div style={styles.logo}>
            <img src="/logo.png" alt="WorkNest Logo" style={styles.logoImg} />
          </div>
          <ul style={styles.menu}>
            {/* Dashboard */}
            <li style={styles.menuItem}>
              <Link
                to="/job/getall"
                style={
                  activeItem === "dashboard"
                    ? { ...styles.link, ...styles.activeLink }
                    : styles.link
                }
                onClick={() => setActiveItem("dashboard")}
              >
                <FaHome /> Dashboard
              </Link>
            </li>

            {/* Job Seeker Links */}
            {user?.role === "Job Seeker" && (
              <>
                <li style={styles.menuItem}>
                  <Link
                    to="/applications/me"
                    style={
                      activeItem === "applications"
                        ? { ...styles.link, ...styles.activeLink }
                        : styles.link
                    }
                    onClick={() => setActiveItem("applications")}
                  >
                    <FaClipboardList /> My Applications
                  </Link>
                </li>
                <li style={styles.menuItem}>
                  <Link
                    to="/interviews"
                    style={
                      activeItem === "interviews"
                        ? { ...styles.link, ...styles.activeLink }
                        : styles.link
                    }
                    onClick={() => setActiveItem("interviews")}
                  >
                    <FaCalendarCheck /> My Interviews
                  </Link>
                </li>
                <li style={styles.menuItem}>
                  <Link
                    to="/account"
                    style={
                      activeItem === "account"
                        ? { ...styles.link, ...styles.activeLink }
                        : styles.link
                    }
                    onClick={() => setActiveItem("account")}
                  >
                    <FaUser /> My Account
                  </Link>
                </li>
              </>
            )}

            {/* Employer Links */}
            {user?.role === "Employer" && (
              <>
                <li style={styles.menuItem}>
                  <Link
                    to="/applications/me"
                    style={
                      activeItem === "applications"
                        ? { ...styles.link, ...styles.activeLink }
                        : styles.link
                    }
                    onClick={() => setActiveItem("applications")}
                  >
                    <FaClipboardList /> Applications
                  </Link>
                </li>
                <li style={styles.menuItem}>
                  <Link
                    to="/job/post"
                    style={
                      activeItem === "post-job"
                        ? { ...styles.link, ...styles.activeLink }
                        : styles.link
                    }
                    onClick={() => setActiveItem("post-job")}
                  >
                    <FaClipboardList /> Post New Job
                  </Link>
                </li>
                <li style={styles.menuItem}>
                  <Link
                    to="/job/me"
                    style={
                      activeItem === "view-jobs"
                        ? { ...styles.link, ...styles.activeLink }
                        : styles.link
                    }
                    onClick={() => setActiveItem("view-jobs")}
                  >
                    <FaClipboardList /> View Your Jobs
                  </Link>
                </li>
                <li style={styles.menuItem}>
                  <Link
                    to="/interviews"
                    style={
                      activeItem === "interviews"
                        ? { ...styles.link, ...styles.activeLink }
                        : styles.link
                    }
                    onClick={() => setActiveItem("interviews")}
                  >
                    <FaCalendarCheck /> Interviews
                  </Link>
                </li>
                <li style={styles.menuItem}>
                  <Link
                    to="/account"
                    style={
                      activeItem === "account"
                        ? { ...styles.link, ...styles.activeLink }
                        : styles.link
                    }
                    onClick={() => setActiveItem("account")}
                  >
                    <FaUser /> Account
                  </Link>
                </li>
              </>
            )}

            {/* Logout */}
            <li style={styles.menuItem}>
              <button
                style={
                  activeItem === "logout"
                    ? { ...styles.button, ...styles.activeLink }
                    : styles.button
                }
                onClick={() => {
                  setActiveItem("logout");
                  handleLogout();
                }}
              >
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Sidebar;
