// ResumeModal.jsx
import React, { useState } from "react";

const ResumeModal = ({ fileUrl, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  if (!fileUrl) return null;

  const isPDF = fileUrl.toLowerCase().endsWith('.pdf');

  const handleLoadSuccess = () => {
    setIsLoading(false);
    setLoadError(false);
  };

  const handleLoadError = () => {
    setIsLoading(false);
    setLoadError(true);
  };

  return (
    <div className="modal-overlay" style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}>
      <div className="modal-content" style={{
        backgroundColor: "#fff",
        borderRadius: "8px",
        padding: "20px",
        width: "90%",
        height: "90%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}>
        <button
          className="close-btn"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "#ff4d4f",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            fontSize: "16px",
            cursor: "pointer",
            zIndex: 2
          }}
        >
          ×
        </button>

        {isLoading && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1
          }}>
            Loading...
          </div>
        )}

        {loadError && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#ff4d4f",
            textAlign: "center"
          }}>
            <p>Failed to load the document.</p>
            <p>Please try opening it in a new tab:</p>
            <a 
              href={fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                color: "#1890ff",
                textDecoration: "underline"
              }}
            >
              Open Document
            </a>
          </div>
        )}

        <div style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          {isPDF ? (
            <iframe
              src={fileUrl}
              title="Document Viewer"
              style={{
                width: "100%",
                height: "100%",
                border: "none"
              }}
              onLoad={handleLoadSuccess}
              onError={handleLoadError}
            />
          ) : (
            <img
              src={fileUrl}
              alt="Document Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain"
              }}
              onLoad={handleLoadSuccess}
              onError={handleLoadError}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;