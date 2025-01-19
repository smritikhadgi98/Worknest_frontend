import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";

const MyApplications = () => {
  const { user } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);  // State for delete confirmation modal
  const [deleteId, setDeleteId] = useState(null);  // Track application to delete
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const endpoint =
          user?.role === "Employer"
            ? "http://localhost:4000/api/v1/application/employer/getall"
            : "http://localhost:4000/api/v1/application/jobseeker/getall";

        const res = await axios.get(endpoint, { withCredentials: true });
        setApplications(res.data.applications);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch applications");
      }
    };

    if (isAuthorized) {
      fetchApplications();
    } else {
      navigateTo("/");
    }
  }, [isAuthorized, user, navigateTo]);

  const deleteApplication = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:4000/api/v1/application/delete/${deleteId}`,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setApplications((prevApplications) =>
        prevApplications.filter((application) => application._id !== deleteId)
      );
      setDeleteModalOpen(false);  // Close the delete confirmation modal after success
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete application");
      setDeleteModalOpen(false);  // Close the modal even on error
    }
  };

  const openModal = (url) => {
    setFileUrl(url);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFileUrl("");
  };

  // Open delete confirmation modal
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteId(null);
  };

  return (
    <div style={{ backgroundColor: "#C6D6C6", minHeight: "100vh" }}>
      <section className="my_applications page">
        <div className="main-content">
          {applications.length <= 0 ? (
            <h4>No Applications Found</h4>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontWeight: "bold",
                  padding: "12px 16px",
                  borderBottom: "2px solid #ddd",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <div style={{ flex: 2, textAlign: "left" }}>
                  {user.role === "Employer" ? "Job Position" : "Date"}
                </div>
                <div style={{ flex: 2, textAlign: "left" }}>
                  {user.role === "Employer" ? "Applicant Name" : "Job Role"}
                </div>
                <div style={{ flex: 2, textAlign: "left" }}>
                  {user.role === "Employer" ? "Resume" : "Company"}
                </div>
                <div style={{ flex: 2, textAlign: "left" }}>
                  {user.role === "Employer" ? "Cover Letter" : "Status"}
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>Action</div>
              </div>
              {applications.map((element) =>
                user.role === "Employer" ? (
                  <EmployerCard
                    element={element}
                    key={element._id}
                    openModal={openModal}
                    openDeleteModal={openDeleteModal}  // Pass openDeleteModal to EmployerCard
                  />
                ) : (
                  <JobSeekerCard
                    element={element}
                    key={element._id}
                    openDeleteModal={openDeleteModal}  // Pass openDeleteModal to JobSeekerCard
                  />
                )
              )}
            </>
          )}
        </div>
      </section>

      {modalOpen && <ResumeModal fileUrl={fileUrl} onClose={closeModal} />}
      
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "9999",
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
            <h7>Are you sure you want to delete this application?</h7>
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-evenly" }}>
              <button
                onClick={deleteApplication}
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
                onClick={closeDeleteModal}
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

const JobSeekerCard = ({ element, openDeleteModal }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        borderBottom: "1px solid #ddd",
        backgroundColor: "#fff",
      }}
    >
      <div style={{ flex: 2, textAlign: "left" }}>
        {new Date(element.jobAppliedOn).toLocaleDateString()}
      </div>
      <div style={{ flex: 2, textAlign: "left" }}>{element.jobTitle}</div>
      <div style={{ flex: 2, textAlign: "left" }}>{element.employerName}</div>
      <div style={{ flex: 2, textAlign: "left" }}>{element.status}</div>
      <div style={{ flex: 1, textAlign: "center" }}>
        <button
          onClick={() => openDeleteModal(element._id)}  // Open delete modal
          style={{
            backgroundColor: "#ff4d4f",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "8px 12px",
            cursor: "pointer",
            fontSize: "14px",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#d9363e")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff4d4f")}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const EmployerCard = ({ element, openModal, openDeleteModal }) => {
  const [status, setStatus] = useState(element.status);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      setStatus(newStatus);
      const res = await axios.put(
        `http://localhost:4000/api/v1/application/update-status/${element._id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success(res.data.message);
    } catch (error) {
      setStatus(element.status);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        borderBottom: "1px solid #ddd",
        backgroundColor: "#fff",
      }}
    >
      <div style={{ flex: 2, textAlign: "left" }}>{element.jobTitle}</div>
      <div style={{ flex: 2, textAlign: "left" }}>{element.applicantName}</div>
      <div style={{ flex: 2, textAlign: "left" }}>
        <button
          onClick={() => openModal(element.resume.url)}
          style={{
            backgroundColor: "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "8px 12px",
            cursor: "pointer",
            fontSize: "14px",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#45a049")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#4caf50")}
        >
          View Resume
        </button>
      </div>
      <div style={{ flex: 2, textAlign: "left" }}>
        <button
          onClick={() => openModal(element.coverLetter.url)}
          style={{
            backgroundColor: "#2196f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "8px 12px",
            cursor: "pointer",
            fontSize: "14px",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#1e88e5")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#2196f3")}
        >
          View Cover Letter
        </button>
      </div>
      <div style={{ flex: 1, textAlign: "center" }}>
        <select
          value={status}
          onChange={handleStatusChange}
          style={{
            padding: "6px",
            borderRadius: "4px",
            width: "100%",
            maxWidth: "120px",
          }}
        >
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
    

     
    </div>
  );
};

export default MyApplications;
