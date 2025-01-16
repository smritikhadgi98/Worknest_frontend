import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaPen, FaTrashAlt } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker CSS

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [editingMode, setEditingMode] = useState(null);
  const { isAuthorized, user } = useContext(Context);
  const [selectedDate, setSelectedDate] = useState(null); // State to hold the selected date

  const navigateTo = useNavigate();

  // Define job types and locations (for dropdowns)
  const jobTypes = ["Full-Time", "Part-Time"];
  const experience = ["Under 1 year", "1-2 years", "2-6 years", "Over 6 years"];

  // Function to format date to yyyy-mm-dd format for input[type="date"]
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // Convert date to yyyy-mm-dd format
  };

  // Fetching all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/job/getmyjobs",
          { withCredentials: true }
        );
        setMyJobs(data.myJobs);
      } catch (error) {
        toast.error(error.response.data.message);
        setMyJobs([]);
      }
    };
    fetchJobs();
  }, []);

  if (!isAuthorized || (user && user.role !== "Employer")) {
    navigateTo("/"); // Redirect if the user is not authorized
  }

  // Function For Enabling Editing Mode
  const handleEnableEdit = (jobId) => {
    setEditingMode(jobId);
    const jobToEdit = myJobs.find((job) => job._id === jobId);
    setSelectedDate(jobToEdit.deadline); // Set the deadline to the selected date when editing
  };

  // Function For Disabling Editing Mode
  const handleDisableEdit = () => {
    setEditingMode(null);
    setSelectedDate(null); // Reset the selected date when editing is disabled
  };

  // Function For Updating The Job
  const handleUpdateJob = async (jobId) => {
    const updatedJob = myJobs.find((job) => job._id === jobId);
    updatedJob.deadline = selectedDate; // Use selectedDate here
    await axios
      .put(`http://localhost:4000/api/v1/job/update/${jobId}`, updatedJob, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setEditingMode(null);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  // Function For Deleting Job
  const handleDeleteJob = async (jobId) => {
    await axios
      .delete(`http://localhost:4000/api/v1/job/delete/${jobId}`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setMyJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const handleInputChange = (jobId, field, value) => {
    setMyJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, [field]: value } : job
      )
    );
  };

  return (
    <div style={{ backgroundColor: '#C6D6C6', minHeight: '100vh' }}>
      <div className="myJobs page">
        <h6>Posted Jobs</h6>
        <div className="container">
          {myJobs.length > 0 ? (
            <div className="banner">
              {myJobs.map((element) => (
                <div className="card" key={element._id}>
                  <div className="content">
                    <div className="short_fields">
                      <div>
                        <span>Title:</span>
                        <input
                          type="text"
                          disabled={editingMode !== element._id}
                          value={element.title}
                          onChange={(e) =>
                            handleInputChange(element._id, "title", e.target.value)
                          }
                        />
                      </div>

                      {/* Job Type Dropdown */}
                      <div>
                        <span>Job Type:</span>
                        <select
                          disabled={editingMode !== element._id}
                          value={element.type}
                          onChange={(e) =>
                            handleInputChange(element._id, "type", e.target.value)
                          }
                        >
                          {jobTypes.map((type, index) => (
                            <option key={index} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Experience Dropdown */}
                      <div>
                        <span>Experience:</span>
                        <select
                          disabled={editingMode !== element._id}
                          value={element.experience}
                          onChange={(e) =>
                            handleInputChange(element._id, "experience", e.target.value)
                          }
                        >
                          {experience.map((exp, index) => (
                            <option key={index} value={exp}>
                              {exp}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <span>Vacancy:</span>
                        <input
                          type="text"
                          disabled={editingMode !== element._id}
                          value={element.vacancy}
                          onChange={(e) =>
                            handleInputChange(element._id, "vacancy", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <span>Salary:</span>
                        <input
                          type="text"
                          disabled={editingMode !== element._id}
                          value={element.salary}
                          onChange={(e) =>
                            handleInputChange(element._id, "salary", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <span>Deadline:</span>
                        <input
                          type="date"
                          disabled={editingMode !== element._id}
                          value={selectedDate ? formatDate(selectedDate) : formatDate(element.deadline)} // Show formatted date
                          onChange={(e) => setSelectedDate(e.target.value)} // Update selectedDate when changed
                        />
                      </div>
                    </div>
                    <div className="long_field">
                      <div>
                        <span>Requirements:</span>
                        <textarea
                          rows={5}
                          value={element.requirement}
                          disabled={editingMode !== element._id}
                          onChange={(e) =>
                            handleInputChange(element._id, "requirement", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <span>Description:</span>
                        <textarea
                          rows={5}
                          value={element.description}
                          disabled={editingMode !== element._id}
                          onChange={(e) =>
                            handleInputChange(element._id, "description", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="button_wrapper">
                    <div className="edit_btn_wrapper">
                      {editingMode === element._id ? (
                        <>
                          <button
                            onClick={() => handleUpdateJob(element._id)}
                            className="check_btn"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleDisableEdit()}
                            className="cross_btn"
                          >
                            <RxCross2 />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEnableEdit(element._id)}
                          className="edit_btn"
                        >
                          <FaPen /> {/* Edit Icon */}
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteJob(element._id)}
                      className="delete_btn"
                    >
                      <FaTrashAlt /> {/* Delete Icon */}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>
              You've not posted any job or maybe you deleted all of your jobs!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyJobs;
