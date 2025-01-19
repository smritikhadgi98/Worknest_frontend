import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Expand/collapse icons

const Faq = () => {
  // FAQs Data
  const faqData = [
    {
      question: " How do I edit my profile?",
      answer:
        "Navigate to “My Account and update your information directly.",
    },
    {
      question: "How can I track my job application status?",
      answer:
        "You can track your application in real-time through the 'My Applications' tab. The status will update automatically as your application progresses.",
    },
    {
      question: " Can I apply to multiple jobs?",
      answer:
        "  Yes, you can apply to as many jobs as you want.",
    },
    {
      question: "How do I upload or update my resume?",
      answer:
        " Go to your profile settings and upload a PDF or DOCX file under the “Resume” section. You can update it anytime.",
    },
    {
        question: "How do I post a job?",
        answer:
          "Click on “Post New Job”, fill in the job details, and submit. Your listing will be live after approval.",
      },
      {
        question: " How do I close a job post?",
        answer:
          " Go to “View Jobs”, select the job, and click the Delete or Close icon.",
      },
      {
        question: " Can I edit a job posting after publishing?",
        answer:
          " Yes! Go to “My Job Listings”, select the job, and click “Edit” to update details.",
      },
  ];

  // State to track the open FAQ index
  const [openIndex, setOpenIndex] = useState(null);

  // Function to toggle FAQ answer
  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      style={{
        backgroundColor: "#F9F9F9",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginLeft:"250px",
        // paddingLeft:"250px"
      }}
    >
      <section
        style={{
          width: "90%", // Increased width
          maxWidth: "1000px", // Set maximum width
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "15px",
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.15)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "1.6rem",
            color: "#333",
            marginBottom: "30px",
          }}
        >
          Frequently Asked Questions
        </h2>

        <div>
          {faqData.map((faq, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.1)",
                marginBottom: "20px",
                overflow: "hidden",
                transition: "all 0.3s ease",
              }}
            >
              {/* Question Section */}
              <div
                onClick={() => toggleFaq(index)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px 25px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#fff",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  background: "#C6D6C6",
                  borderRadius: "12px",
                  color:"#666464"
                }}
              >
                <span>{faq.question}</span>
                {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
              </div>

              {/* Answer Section (Collapsible) */}
              {openIndex === index && (
                <div
                  style={{
                    backgroundColor: "#F5F5F5",
                    padding: "18px 25px",
                    fontSize: "1rem",
                    color: "#444",
                    borderTop: "1px solid #ddd",
                    animation: "slideDown 0.3s ease",
                    textAlign: "left",
                  }}
                >
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Faq;
