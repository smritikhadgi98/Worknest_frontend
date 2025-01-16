import React, { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:4000"); // Replace with your signaling server URL

const Interviews = () => {
  const { user } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const endpoint =
          user?.role === "Employer"
            ? "http://localhost:4000/api/v1/interviews/employer-interview"
            : "http://localhost:4000/api/v1/interviews/jobseeker-interview";

        const res = await axios.get(endpoint, { withCredentials: true });
        setApplications(res.data.interviewDetails);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthorized) {
      fetchApplications();
    } else {
      navigateTo("/");
    }
  }, [isAuthorized, user, navigateTo]);

  return (
    <div style={{ backgroundColor: "#C6D6C6", minHeight: "100vh" }}>
      <section className="my_applications page">
        <div className="main-content">
          {loading ? (
            <h4>Loading...</h4>
          ) : applications.length <= 0 ? (
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
                <div style={{ flex: 1, textAlign: "left" }}>
                  {user.role === "Employer" ? "Job Position" : "Job Title"}
                </div>
                <div style={{ flex: 1, textAlign: "left" }}>
                  {user.role === "Employer" ? "Applicant Name" : "Company Name"}
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>Interview Date</div>
                <div style={{ flex: 1, textAlign: "center" }}>Interview Time</div>
                <div style={{ flex: 1, textAlign: "center" }}>Video Call</div>
              </div>
              {applications.map((element) =>
                user.role === "Employer" ? (
                  <EmployerCard key={element._id} element={element} />
                ) : (
                  <JobSeekerCard key={element._id} element={element} />
                )
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

const VideoCallButton = ({ element }) => {
  const startVideoCall = () => {
    // Prepare the data for the new window
    const callData = {
      roomId: element.applicationId,
    };

    // Store the call data in localStorage (or you could use URL params)
    localStorage.setItem("videoCallData", JSON.stringify(callData));

    // Open the video call in a new window
    const callWindow = window.open(
      "/video-call", // Path to the video call page
      "Video Call",
      "width=800,height=600,scrollbars=no,resizable=no"
    );

    if (!callWindow) {
      toast.error("Failed to open video call window. Please allow pop-ups.");
    }
  };

  return (
    <div style={{ flex: 1, textAlign: "center" }}>
      <button
        style={{
          backgroundColor: "#6B961F",
          borderRadius: "15px",
          color: "white",
          padding: "5px 20px",
          textAlign: "center",
          display: "inline-block",
          textDecoration: "none",
          border: "none", // Remove the border
          transition: "all 0.3s", // Smooth transition for background color and text color change
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#F4BA1A"; // Change background color on hover
          e.currentTarget.style.color = "black"; // Change text color to black on hover
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#6B961F"; // Revert background color when mouse leaves
          e.currentTarget.style.color = "white"; // Revert text color to white when mouse leaves
        }}
        onClick={startVideoCall}
      >
        Join Video
      </button>
    </div>
  );
};



const JobSeekerCard = ({ element }) => (
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
    <div style={{ flex: 1, textAlign: "left" }}>
      {element.jobTitle}
    </div>
    <div style={{ flex: 1, textAlign: "left" }}>
      {element.employerName}
    </div>
    <div style={{ flex: 1, textAlign: "center" }}>
      {element.interviewDate}
    </div>
    <div style={{ flex: 1, textAlign: "center" }}>
      {element.interviewTime}
    </div>
    <VideoCallButton element={element} />
  </div>
);


const EmployerCard = ({ element }) => {
  const [interviewDate, setInterviewDate] = useState(element.interviewDate || "");
  const [interviewTime, setInterviewTime] = useState(element.interviewTime || "");
  const [isScheduled, setIsScheduled] = useState(Boolean(element.interviewDate && element.interviewTime));

  const handleDateChange = (e) => setInterviewDate(e.target.value);
  const handleTimeChange = (e) => setInterviewTime(e.target.value);

  const scheduleInterview = async () => {
    if (!interviewDate || !interviewTime) {
      toast.error("Please select both date and time for the interview.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/interviews/schedule",
        {
          applicationId: element.applicationId,
          interviewDate,
          interviewTime,
        },
        { withCredentials: true }
      );

      toast.success(response.data.message);
      setIsScheduled(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to schedule interview.");
    }
  };

  const validateAndStartCall = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/interviews/room/${element.applicationId}`,
        { withCredentials: true }
      );

      const roomId = response.data.roomId;
      const scheduledTime = new Date(`${interviewDate}T${interviewTime}`);
      const currentTime = new Date();

      if (scheduledTime > currentTime) {
        toast.error("You can only start the call after the scheduled interview time.");
      } else {
        startVideoCall(roomId);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch room ID.");
    }
  };

  const startVideoCall = (roomId) => {
    const callData = { roomId };

    const callWindow = window.open(
      `/video-call?roomId=${roomId}`,
      "Video Call",
      "width=800,height=600,scrollbars=no,resizable=no"
    );

    if (!callWindow) {
      toast.error("Failed to open video call window. Please allow pop-ups.");
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
      <div style={{ flex: 1, textAlign: "left" }}>{element.jobTitle}</div>
      <div style={{ flex: 1, textAlign: "left" }}>{element.applicantName}</div>

      {/* Interview Date and Time */}
      <div style={{ flex: 1, textAlign: "center" }}>
        {isScheduled ? (
          <>
            <div>{interviewDate}</div>
          </>
        ) : (
          <input
            type="date"
            value={interviewDate}
            onChange={handleDateChange}
            disabled={isScheduled}
            style={{ marginRight: "10px" }}
          />
        )}
      </div>

      <div style={{ flex: 1, textAlign: "center" }}>
        {isScheduled ? (
          <>
            <div>{interviewTime}</div>
          </>
        ) : (
          <input
            type="time"
            value={interviewTime}
            onChange={handleTimeChange}
            disabled={isScheduled}
            style={{ marginRight: "10px" }}
          />
        )}
      </div>

      {/* Buttons */}
      <div style={{ flex: 1, textAlign: "center" }}>
        {isScheduled ? (
          <button
            style={{
              backgroundColor: "#6B961F",
              borderRadius: "15px",
              color: "white",
              padding: "5px 20px",
              textAlign: "center",
              display: "inline-block",
              textDecoration: "none",
              transition: "all 0.3s",
              border: "none", // Remove the border
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F4BA1A";
              e.currentTarget.style.color = "black";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#6B961F";
              e.currentTarget.style.color = "white";
            }}
            onClick={validateAndStartCall}
          >
            Start Video Call
          </button>
        ) : (
          <button
            style={{
              backgroundColor: "#6B961F",
              borderRadius: "15px",
              color: "white",
              padding: "5px 20px",
              textAlign: "center",
              display: "inline-block",
              textDecoration: "none",
              transition: "all 0.3s",
              border: "none", // Remove the border
           
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F4BA1A";
              e.currentTarget.style.color = "black";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#6B961F";
              e.currentTarget.style.color = "white";
            }}
            onClick={scheduleInterview}
          >
            Schedule Interview
          </button>
        )}
      </div>
    </div>
  );
};



export default Interviews;
