import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const Application = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [skills, setSkills] = useState("");
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const { id } = useParams();

  const handleFileChange = (event, setFile) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleApplication = async (e) => {
    e.preventDefault();

    if (!resume || !coverLetter) {
      toast.error("Both Resume and Cover Letter are required.");
      return;
    }

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("skills", skills);
    formData.append("resume", resume);
    formData.append("coverLetter", coverLetter);
    formData.append("jobId", id);

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/application/post",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      navigateTo("/job/getall");
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed");
    }
  };

  if (!isAuthorized || (user && user.role === "Employer")) {
    navigateTo("/");
  }

  const styles = {
    container: {
      marginLeft: "250px", /* Adjust this value to match your navbar width */
  padding: "20px",
  boxSizing: "border-box",
  minWidth: "1000px",
  minHeight: "700px",
  borderRadius: "50px 0 0 50px",
  backgroundColor: "#fff", /* Add rounded corner effect */

    },
    heading: {
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "20px",
      textAlign:"center"
    },
    form: {
      display: "flex",
      flexDirection: "column",
     justifyContent:"center",
      gap: "20px",
      width: "100%",
     
      maxWidth: "900px",
      maxHeight: "1200px",
      backgroundColor: "#f1f3f6",
      marginLeft:"200px",
      padding: "30px",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      gap: "15px",
    },
    input: {
      flex: 5,
      padding: "12px",
      fontSize: "16px",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    button: {
      backgroundColor: "#4CAF50",
      color: "#fff",
      padding: "12px 20px",
      fontSize: "18px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      textAlign: "center",
    },
  };
  
  return (
    <div style={{ backgroundColor: '#C6D6C6', minHeight: '100vh' }}>
    <section style={styles.container}>
      <h1 style={styles.heading}>Application Form</h1>
      <form onSubmit={handleApplication} style={styles.form}>
        <div style={styles.row}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.row}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={styles.input}
          />
        </div>
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          style={styles.input}
        />
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => handleFileChange(e, setCoverLetter)}
          style={styles.input}
        />
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => handleFileChange(e, setResume)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Send Application
        </button>
      </form>
    </section>
    </div>
  );
  
 
};

export default Application;
