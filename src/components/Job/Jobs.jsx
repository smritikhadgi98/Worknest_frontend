import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { FaTimes } from "react-icons/fa"; // Import cross icon

const Jobs = () => {
  const [allJobs, setAllJobs] = useState([]); // Store all jobs fetched from the API
  const [filteredJobs, setFilteredJobs] = useState([]); // Store filtered jobs
  const [searchTitle, setSearchTitle] = useState(""); // Title search
  const [searchLocation, setSearchLocation] = useState(""); // Location search
  const [filterType, setFilterType] = useState("");
  const [filterExperience, setFilterExperience] = useState("");

  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  // Fetch jobs initially when the component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/job/getall", { withCredentials: true });
        setAllJobs(data.jobs); // Store all jobs
        setFilteredJobs(data.jobs); // Set filtered jobs initially as all jobs
      } catch (error) {
        console.error(error);
      }
    };

    fetchJobs();
  }, []);

  // If not authorized, navigate to home page
  if (!isAuthorized) {
    navigateTo("/"); // Redirect to home if not authorized
  }

  // Function to filter jobs based on selected filters
  const filterJobs = () => {
    let filtered = [...allJobs]; // Start with all jobs

    if (filterType) {
      filtered = filtered.filter((job) => job.type === filterType);
    }

    if (filterExperience) {
      filtered = filtered.filter((job) => job.experience === filterExperience);
    }

    // Set filtered jobs
    setFilteredJobs(filtered);
  };

  // Function to handle the search button click
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent the form from reloading the page
  
    if (!searchTitle && !searchLocation) {
      // If both fields are empty, return early (no search is performed)
      setFilteredJobs(allJobs); 
      return;
    }
  
    let filtered = [...allJobs]; // Start with all jobs
  
    if (searchTitle) {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }
  
    if (searchLocation) {
      filtered = filtered.filter((job) =>
        job.postedBy.address.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }
  
    setFilteredJobs(filtered); // Update filtered jobs based on search criteria
  };
  
  // Handle the filter change for job type
  const handleTypeChange = (e) => {
    setFilterType(e.target.checked ? e.target.value : ""); // Set type based on checkbox state
  };

  // Handle the filter change for experience
  const handleExperienceChange = (e) => {
    setFilterExperience(e.target.checked ? e.target.value : ""); // Set experience based on checkbox state
  };

  useEffect(() => {
    filterJobs(); // Apply filters whenever the filter type or experience changes
  }, [filterType, filterExperience]); // Depend on filterType and filterExperience

  const handleClearTitle = () => {
    setSearchTitle(""); // Clear title search
    if (searchLocation) {
      setFilteredJobs(allJobs.filter(job => job.location.toLowerCase().includes(searchLocation.toLowerCase())));
    } else {
      setFilteredJobs(allJobs); // Reset filtered jobs to all jobs if location is cleared too
    }
  };
  
  const handleClearLocation = () => {
    setSearchLocation(""); // Clear location search
    if (searchTitle) {
      setFilteredJobs(allJobs.filter(job => job.title.toLowerCase().includes(searchTitle.toLowerCase())));
    } else {
      setFilteredJobs(allJobs); // Reset filtered jobs to all jobs if title is cleared too
    }
  };
  
  

  return (
    <div style={{ backgroundColor: "#C6D6C6", minHeight: "100vh" }}>
      <section className="jobs page">
        <h6 style={{ marginLeft: "20px", marginTop: "10px" }}>TOP JOBS</h6>

        {/* Search Box Container */}
        <div
          className="search-box-container"
          style={{
            display: "flex",
            width: "500px",
           
            height: "fit-content",
            flexDirection: "column",
            alignItems: "center",
            paddingLeft: "20px",
            paddingRight: "20px",
            backgroundColor: "#fff", // White background for the search box
            borderRadius: "8px", // Rounded corners
            border: "1px solid #CCC", // Black border around the entire search box
            marginLeft: "auto", // Center the box
            marginRight: "auto", // Center the box
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.46)",
            zIndex: "1", // Ensure it stays on top of other elements
          }}
        >
          {/* Search Form */}
          <form onSubmit={handleSearch} style={{ display: "flex", width: "100%", gap: "10px", marginBottom: "20px" }}>
            {/* Title Search Input */}
           {/* Title Search Input */}
              <div style={{ position: "relative", flex: 1 }}>
                <input
                  type="text"
                  placeholder="Search by Title"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  style={{
                    padding: "0px",
                    marginTop: "20px",
                    borderRadius: "4px",
                    border: "none",
                    outline: "none", // Removed the border
                    width: "100%",
                  }}
                />
                {searchTitle && (
                  <FaTimes
                    onClick={handleClearTitle}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "70%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      outline: "none", 
                      color: "gray",
                    }}
                  />
                )}
              </div>

              {/* Location Search Input */}
              <div style={{ position: "relative", flex: 1 }}>
                <input
                  type="text"
                  placeholder="Search by Location"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  style={{
                    padding: "0px",
                    marginTop: "20px",
                    borderRadius: "4px",
                    border: "none", 
                    outline: "none", // Removed the border
                    width: "100%",
                  }}
                />
                {searchLocation && (
                  <FaTimes
                    onClick={handleClearLocation}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "70%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      outline: "none", 
                      color: "gray",
                    }}
                  />
                )}
              </div>

            <button
              type="submit"
              style={{
                padding: "5px 20px",
                width: "120px",
                backgroundColor: "#6B961F",
                color: "white",
                marginTop: "16px",
                border: "none",
                borderRadius: "10px",
                marginLeft: "10px",
              }}
            >
              Search
            </button>
          </form>
        </div>

        {/* Filters */}
        <div
          className="filters"
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            right: "10px",
            top: "150px",
            width: "180px",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h7 style={{ marginBottom: "20px" }}>Filter Jobs</h7>

          {/* Job Type Filter */}
          <div style={{ marginBottom: "20px" }}>
            <h7>Job Type</h7>
            <div style={{ marginBottom: "10px", marginTop: "10px" }}>
              <label>
                <input
                  type="checkbox"
                  value="Full Time"
                  checked={filterType === "Full Time"}
                  onChange={handleTypeChange}
                />
                <span style={{ marginLeft: "8px" }}>Full Time</span>
              </label>
            </div>
            <div style={{ marginBottom: "10px", marginTop: "10px" }}>
              <label>
                <input
                  type="checkbox"
                  value="Part Time"
                  checked={filterType === "Part Time"}
                  onChange={handleTypeChange}
                />
                <span style={{ marginLeft: "8px" }}>Part Time</span>
              </label>
            </div>
          </div>

          {/* Experience Filter */}
          <div>
            <h7>Experience</h7>
            <div style={{ marginBottom: "10px", marginTop: "10px" }}>
              <label>
                <input
                  type="checkbox"
                  value="Under 1 year"
                  checked={filterExperience === "Under 1 year"}
                  onChange={handleExperienceChange}
                />
                <span style={{ marginLeft: "8px" }}>Under 1 year</span>
              </label>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>
                <input
                  type="checkbox"
                  value="1-2 years"
                  checked={filterExperience === "1-2 years"}
                  onChange={handleExperienceChange}
                />
                <span style={{ marginLeft: "8px" }}>1 - 2 Years</span>
              </label>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>
                <input
                  type="checkbox"
                  value="2-6 years"
                  checked={filterExperience === "2-6 years"}
                  onChange={handleExperienceChange}
                />
                <span style={{ marginLeft: "8px" }}>2 - 6 Years</span>
              </label>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>
                <input
                  type="checkbox"
                  value="Over 6 years"
                  checked={filterExperience === "Over 6 years"}
                  onChange={handleExperienceChange}
                />
                <span style={{ marginLeft: "8px" }}>Over 6 Years</span>
              </label>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="container">
  <div
    className="banner"
    style={{
      display: "grid", // Use grid layout
      gridTemplateColumns: "repeat(3, 1fr)", // 3 columns in a row
      gap: "20px", // Space between the cards
      marginRight: "300px", // Optional margin for space between job list and filters
      overflowX: "auto", // Optional: Make the container horizontally scrollable if needed
    }}
  >
    {filteredJobs.length > 0 ? (
      filteredJobs.map((job) => (
        <div
          className="card"
          key={job._id}
          style={{
            height: "350px",
            padding: "10px",
            backgroundColor: "#fff",
            borderRadius: "4px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.46)",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#C6D6C6"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fff"}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {job.postedBy?.photo && (
              <img
                src={`http://localhost:4000/uploads/${job.postedBy.photo}`}
                alt="User Photo"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "10px",
                  marginRight: "10px",
                }}
              />
            )}
            <div>
              <p style={{ fontSize: "20px", paddingLeft:"10px", paddingBottom:"20px"}}>{job.postedBy?.name}</p>
              <p style={{ fontSize: "18px", paddingLeft:"10px" }}>{job.postedBy?.address}</p>
            </div>
          </div>
          <h5 style={{ fontSize: "20px",paddingLeft:"10px", }}>{job.title}</h5>
          <p
  style={{
    fontSize: "18px",
    color: "gray",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    paddingLeft:"10px",
  }}
>
  {job.description.split(" ").slice(0, 5).join(" ")}{job.description.split(" ").length > 10 ? "..." : ""}
</p>



          <p style={{ fontSize: "18px" , paddingLeft:"10px",}}>Vacancy: {job.vacancy}</p>
          <p style={{ color: "red", fontSize: "18px" , paddingLeft:"10px",}}>{job.type}</p>
          <Link
  to={`/job/${job._id}`}
  style={{
    backgroundColor: "#6B961F",
    borderRadius: "15px",
    color: "white",
    padding: "5px 20px",
    textAlign: "center",
    display: "inline-block",
    textDecoration: "none",
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
>
  View More
</Link>

        </div>
      ))
    ) : (
      <p>No jobs found</p>
    )}
  </div>
</div>
      

      </section>
    </div>
  );
};

export default Jobs;
