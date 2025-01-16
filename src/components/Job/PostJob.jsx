import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(""); // This will hold the selected job type
  const [vacancy, setVacancy] = useState("");
  const [requirement, setRequirement] = useState("");
  const [deadline, setDeadline] = useState("");
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState("");

  const { isAuthorized, user } = useContext(Context);

  const navigateTo = useNavigate();
  if (!isAuthorized || (user && user.role !== "Employer")) {
    navigateTo("/");
  }

  const handleJobPost = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/job/post",
        {
          title,
          description,
          type,
          
          salary,
          vacancy,
          deadline,
          requirement,
          experience
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response.data.message);

      // Clear the form fields upon success
      setTitle("");
      setDescription("");
      setType("");
      setVacancy("");
      setRequirement("");
     
      setDeadline("");
      setSalary("");
      setExperience("");
    } catch (err) {
      toast.error(err.response.data.message || "Failed to post the job.");
    }
  };

  return (
    <div style={{ backgroundColor: '#C6D6C6', minHeight: '100vh' }}>
      <div className="job_post page">
        <h6>CREATE JOB</h6>
        <div className="main-content">
          <form onSubmit={handleJobPost}>
            <div className="wrapper">
              <div>
                <label htmlFor="title">Job Title</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="type">Job Type</label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="">Select Job Type</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                </select>
              </div>
            </div>
            <div className="wrapper">
             
              <div>
                <label htmlFor="vacancy">Vacancy</label>
                <input
                  id="vacancy"
                  type="number"
                  value={vacancy}
                  onChange={(e) => setVacancy(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="salary">Salary</label>
                <input
                  id="salary"
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="wrapper">
              
              <div>
                <label htmlFor="experience">Experience</label>
                <select
                  id="experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                >
                  <option value="">Select Experience Needed</option>
                  <option value="Under 1 year">Under 1 year</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="2-6 years">2-6 years</option>
                  <option value="Over 6 years">Over 6 years</option>
                </select>
              </div>
              <div>
            <div>
                <label htmlFor="deadline">Job Deadline</label>
                <input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>
            </div>
            </div>

            
            <div>
              <label htmlFor="requirement">Job Requirements</label>
              <textarea
                id="requirement"
                rows="5"
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="description">Job Description</label>
              <textarea
                id="description"
                rows="10"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <button type="submit">Post Job</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
