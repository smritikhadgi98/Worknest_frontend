import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context } from "../../main";
import toast from "react-hot-toast";
import {
  FaEdit,
  FaTrash,
  FaCamera,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPlus,
} from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    address: "",
    companyDescription: "",
    gender: "",
    skills: "",
  });

  const [photo, setPhoto] = useState(null);
  const [resume, setResume] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [resumeName, setResumeName] = useState("");
  const { isAuthorized } = useContext(Context);

  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal state for delete confirmation

  useEffect(() => {
    if (isAuthorized) {
      fetchUserData();
    }
  }, [isAuthorized]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/v1/user/getuser", {
        withCredentials: true,
      });
      const userData = response.data.user;
      setUser(userData);

      // Set photo preview if the user has a photo
      if (userData.photo) {
        setPhotoPreview(userData.photo);
      } else {
        setPhotoPreview(null);
      }

      setResumeName(userData.resume || "");

      setFormData({
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        companyDescription: userData.companyDescription || "",
        gender: userData.gender || "",
        skills: userData.skills || [],
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch user details");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const previewURL = URL.createObjectURL(file);
      setPhotoPreview(previewURL);  // This will update the image preview
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
      setResumeName(file.name);
    }
  };

  const handleSubmit = async () => {
    try {
      const submitFormData = new FormData();

      // Add basic form fields, ensuring only those with values are appended
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          submitFormData.append(key, formData[key]);
        }
      });

      // Add files if they exist
      if (photo) {
        submitFormData.append("photo", photo);
      }
      if (resume) {
        submitFormData.append("resume", resume);
      }

      // Send the request to the backend
      const response = await axios.put(
        "http://localhost:4000/api/v1/user/update",
        submitFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      // Handle the response and update the UI
      if (response.data && response.data.user) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        if (updatedUser.photo) {
          setPhotoPreview(updatedUser.photo);  // Update photo preview after update
        } else {
          setPhotoPreview(null);
        }
        if (updatedUser.resume) {
          setResumeName(updatedUser.resume);
        }
      }

      // Reset file states
      setPhoto(null);
      setResume(null);

      toast.success("Profile updated successfully");
      setIsEditable(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
      if (window.confirm("This is your last confirmation. Proceeding will permanently delete your account.")) {
        try {
          toast.loading("Deleting your account...");
          
          // Send delete request to the server
          const response = await axios.delete("http://localhost:4000/api/v1/user/delete", {
            withCredentials: true,
          });
  
          if (response.status === 200) {
            toast.dismiss(); // Remove the loading toast
            toast.success("Account deleted successfully");
            
            // Clear user session and redirect to the registration page
            setUser(null); // Clear local user data
            window.location.href = "/register"; // Redirect user to the registration page
          }
        } catch (error) {
          toast.dismiss(); // Remove the loading toast
          console.error("Deletion error:", error);
          toast.error(error.response?.data?.message || "Failed to delete account. Please try again.");
        }
      }
    }
  };

  const handleDeleteModal = () => {
    setShowDeleteModal(true);  // Open the delete modal
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);  // Close the modal without deleting
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ backgroundColor: "#C6D6C6", minHeight: "100vh" }}>
      <div
        style={{
          marginLeft: "250px",
          padding: "20px",
          boxSizing: "border-box",
          minHeight: "100vh",
          minWidth: "1000px",
          borderRadius: "50px 0 0 50px",
          backgroundColor: "#fff",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            minHeight: "900px",
            margin: "0 auto",
            marginTop: "20px",
            marginBottom: "20px",
            background: "#F7F7F5",
            borderRadius: "8px",
            padding: "20px",
            position: "relative",
          }}
        >
          {/* Edit/Delete Icons */}
          <div style={{ position: "absolute", top: "50px", right: "20px" }}>
            <div>
              <FaEdit
                onClick={() => setIsEditable(!isEditable)}
                style={{
                  cursor: "pointer",
                  fontSize: "26px",
                  color: isEditable ? "#28a745" : "#555",
                  marginBottom: "50px",
                }}
              />
            </div>
            <div>
              <FaTrash
                onClick={handleDeleteModal} // Open the modal instead of direct delete
                style={{
                  cursor: "pointer",
                  fontSize: "26px",
                  color: "#dc3545",
                  marginBottom: "50px",
                }}
              />
            </div>
          </div>

          {/* Profile Header */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            {/* Profile Photo */}
            <div style={{ marginRight: "20px" }}>
              <label htmlFor="photo-upload" style={{ cursor: "pointer", position: "relative" }}>
                <img
                  src={photoPreview || "https://via.placeholder.com/150"}
                  alt="Profile"
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid #ddd",
                  }}
                />
                {isEditable && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      backgroundColor: "#6B961F",
                      borderRadius: "50%",
                      padding: "8px",
                    }}
                  >
                    <FaCamera color="white" size={16} />
                  </div>
                )}
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handlePhotoUpload}
                disabled={!isEditable}
              />
            </div>

            {/* Name and Role */}
            <div>
              <h2 style={{ margin: "0", fontSize: "24px", color: "#333", marginLeft: "100px" }}>
                {user.name || "Your Name"}
              </h2>
              <p style={{ margin: "5px 0", fontSize: "16px", color: "#666", marginLeft: "100px" }}>
                {user.role || "Your Role"}
              </p>
            </div>
          </div>

          {/* Profile Fields */}
          <div>
            {/* Email */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
              <div
                style={{
                  padding: "10px",
                  marginTop: "50px",
                  marginBottom: "20px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FaEnvelope style={{ marginRight: "10px", color: "#555" }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  style={{ flex: 1, border: "none", outline: "none" }}
                  disabled={!isEditable}
                />
              </div>
            </div>

            {/* Phone */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
              <div
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  marginBottom: "20px",
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FaPhone style={{ marginRight: "10px", color: "#555" }} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  style={{ flex: 1, border: "none", outline: "none" }}
                  disabled={!isEditable}
                />
              </div>
            </div>

            {/* Address */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
              <div
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FaMapMarkerAlt style={{ marginRight: "10px", color: "#555" }} />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Address"
                  style={{ flex: 1, border: "none", outline: "none" }}
                  disabled={!isEditable}
                />
              </div>
            </div>

            {/* Conditional Rendering Based on Role */}
            {user.role === "Employer" ? (
              <div style={{ marginTop: "20px" }}>
                <h3
                  style={{
                    fontSize: "16px",
                    color: "#fff",
                    marginBottom: "10px",
                    backgroundColor: "#6B961F",
                    padding: "10px",
                    borderRadius: "4px",
                  }}
                >
                  About Company
                </h3>
                <textarea
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Company Description"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                  disabled={!isEditable}
                />
              </div>
            ) : (
              <div>
                {/* Gender */}
                <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "16px", marginBottom: "10px", color: "#333" }}>
                    Gender
                  </h3>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                    disabled={!isEditable}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Skills */}
                <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
                  <div
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      marginBottom: "20px",
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaPlus style={{ marginRight: "10px", color: "#555" }} />
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      placeholder=" Add Skills"
                      style={{ flex: 1, border: "none", outline: "none" }}
                      disabled={!isEditable}
                    />
                  </div>
                </div>

                {/* Resume Upload */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "16px", marginBottom: "10px", color: "#333" }}>
                    Resume
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {resumeName && (
                      <div
                        style={{
                          padding: "10px",
                          backgroundColor: "#e9ecef",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>{resumeName}</span>
                      </div>
                    )}
                    {isEditable && (
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          {isEditable && (
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                onClick={handleSubmit}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#6B961F",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditable(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {/* Delete Modal */}
{showDeleteModal && (
  <div
    style={{
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent black background
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "9999", // Ensures the modal is on top of other content
    }}
  >
    <div
      style={{
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "8px",
        width: "300px",
        textAlign: "center",
      }}
    >
      <h7>Are you sure you want to delete your account?</h7>
 
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-evenly" }}>
        <button
          onClick={handleDelete}
          style={{
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Yes, Delete
        </button>
        <button
          onClick={handleCloseModal}
          style={{
            backgroundColor: "#6B961F",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>


      )}
    </div>
  );
};

export default Profile;
