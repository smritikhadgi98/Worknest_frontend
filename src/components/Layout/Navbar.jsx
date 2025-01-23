import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../main";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  BiInfoCircle,
  BiGridAlt,
  BiFileBlank,
  BiVideo,
  BiUser,
  BiLogOut,
  BiEdit,
  BiBriefcaseAlt2,
} from "react-icons/bi";
import { FaClipboardList } from "react-icons/fa";
import { matchPath } from "react-router-dom";

const Sidebar = () => {
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const location = useLocation();

  const [activeItem, setActiveItem] = useState("dashboard");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const hideSidebarPages = ["/login", "/register", "/forgot-password", "/video-call"];
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
    } finally {
      setShowLogoutPopup(false);
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
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000,
    },
    modalContent: {
      background: "#fff",
      borderRadius: "8px",
      fontSize:"20px",
      padding: "20px",
      width: "500px", // Increased from 400px to 500px
      textAlign: "center",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },

    modalButtons: {
      display: "flex",
      justifyContent: "center",
      marginTop: "20px",
      gap: "60px",  // Reduced the gap between buttons
  
    },
    modalButton: {
      padding: "10px 20px",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
      fontSize: "16px",
    },
    yesButton: {
      background: "red",
      color: "white",
    },
    noButton: {
      background: "green",
      color: "white",
    },

    // Decreased the font size for the text
    modalHeading: {
      fontSize: "16px", // Reduced font size for the "Do you want to logout?" text
    },
  };

  

  return (
    <>
      {!isHideSidebar && (
        <div style={styles.sidebar}>
          <div style={styles.logo}>
            <Link
              to="/job/getall"
              style={{ textDecoration: "none" }}
              onClick={() => setActiveItem("dashboard")}
            >
              <img src="/logo.png" alt="WorkNest Logo" style={styles.logoImg} />
            </Link>
          </div>
          <ul style={styles.menu}>
            {/* Dashboard */}
            <li style={styles.menuItem}>
              <Link
                to="/job/getall"
                style={activeItem === "dashboard" ? { ...styles.link, ...styles.activeLink } : styles.link}
                onClick={() => setActiveItem("dashboard")}
              >
                <BiGridAlt /> Dashboard
              </Link>
            </li>
            {/* Job Seeker Links */}
            {user?.role === "Job Seeker" && (
              <>
                <li style={styles.menuItem}>
                  <Link
                    to="/applications/me"
                    style={activeItem === "applications" ? { ...styles.link, ...styles.activeLink } : styles.link}
                    onClick={() => setActiveItem("applications")}
                  >
                    <BiFileBlank /> My Applications
                  </Link>
                </li>
                <li style={styles.menuItem}>
                  <Link
                    to="/interviews"
                    style={activeItem === "interviews" ? { ...styles.link, ...styles.activeLink } : styles.link}
                    onClick={() => setActiveItem("interviews")}
                  >
                    <BiVideo /> My Interviews
                  </Link>
                </li>
                <li style={styles.menuItem}>
                  <Link
                    to="/account"
                    style={activeItem === "account" ? { ...styles.link, ...styles.activeLink } : styles.link}
                    onClick={() => setActiveItem("account")}
                  >
                    <BiUser /> My Account
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
                    style={activeItem === "applications" ? { ...styles.link, ...styles.activeLink } : styles.link}
                    onClick={() => setActiveItem("applications")}
                  >
                    <FaClipboardList /> Applications
                  </Link>
                </li>
                <li style={styles.menuItem}>
                  <Link
                    to="/job/post"
                    style={activeItem === "post-job" ? { ...styles.link, ...styles.activeLink } : styles.link}
                    onClick={() => setActiveItem("post-job")}
                  >
                    <BiEdit /> Post New Job
                  </Link>
                </li>
                <li style={styles.menuItem}>
                  <Link
                    to="/job/me"
                    style={activeItem === "view-jobs" ? { ...styles.link, ...styles.activeLink } : styles.link}
                    onClick={() => setActiveItem("view-jobs")}
                  >
                    <BiBriefcaseAlt2 /> View Your Jobs
                  </Link>
                </li>
                <li style={styles.menuItem}>
                  <Link
                    to="/interviews"
                    style={activeItem === "interviews" ? { ...styles.link, ...styles.activeLink } : styles.link}
                    onClick={() => setActiveItem("interviews")}
                  >
                    <BiVideo /> Interviews
                  </Link>
                </li>
                <li style={styles.menuItem}>
                  <Link
                    to="/account"
                    style={activeItem === "account" ? { ...styles.link, ...styles.activeLink } : styles.link}
                    onClick={() => setActiveItem("account")}
                  >
                    <BiUser /> Account
                  </Link>
                </li>
              </>
            )}

            {/* FAQ */}
            <li style={styles.menuItem}>
              <Link
                to="/faq"
                style={activeItem === "faq" ? { ...styles.link, ...styles.activeLink } : styles.link}
                onClick={() => setActiveItem("faq")}
              >
                <BiInfoCircle /> FAQ
              </Link>
            </li>

            {/* Logout */}
            <li style={styles.menuItem}>
              <button
                style={activeItem === "logout" ? { ...styles.button, ...styles.activeLink } : styles.button}
                onClick={() => setShowLogoutPopup(true)}
              >
                <BiLogOut /> Logout
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutPopup && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalHeading}>Do you want to logout?</h3>
            <div style={styles.modalButtons}>
              <button
                style={{ ...styles.modalButton, ...styles.yesButton }}
                onClick={handleLogout}
              >
                Yes
              </button>
              <button
                style={{ ...styles.modalButton, ...styles.noButton }}
                onClick={() => setShowLogoutPopup(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
