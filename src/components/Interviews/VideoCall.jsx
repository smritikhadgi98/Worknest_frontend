import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { FaMicrophone, FaMicrophoneSlash, FaPhoneAlt } from "react-icons/fa";

// Assuming you're using a Socket.IO server
const socket = io("http://localhost:4000");

const VideoCallPage = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [isMicEnabled, setIsMicEnabled] = useState(true); // State for microphone status
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [roomId, setRoomId] = useState("");  // State for roomId

  useEffect(() => {
    // Get roomId from localStorage or generate one if not present
    const storedRoomId = localStorage.getItem("roomId") || "defaultRoom";
    setRoomId(storedRoomId);
    localStorage.setItem("roomId", storedRoomId);  // Save roomId for future use

    const startCall = async () => {
      try {
        // Get local media stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        console.log("Stream: ", stream); // Log the stream to check if it's captured
        setLocalStream(stream);

        // Create peer connection
        const pc = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        setPeerConnection(pc);

        // Add local stream to peer connection
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        // Emit socket event to join the room
        socket.emit("joinRoom", { roomId: storedRoomId });

        // Handle incoming ICE candidates
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("iceCandidate", { candidate: event.candidate, roomId: storedRoomId });
          }
        };

        // Handle incoming remote stream
        pc.ontrack = (event) => {
          setRemoteStream(event.streams[0]);
        };

        // Listen for call events (Offer/Answer)
        socket.on("callOffer", async (offer) => {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("sendAnswer", { answer, roomId: storedRoomId });
        });

        socket.on("callAnswer", async (answer) => {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socket.on("iceCandidate", async ({ candidate }) => {
          if (candidate) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
        });

        // Create an offer if this user is the caller
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("callOffer", { offer, roomId: storedRoomId });

      } catch (error) {
        console.error("Error accessing media devices: ", error);
        toast.error("Failed to access camera or microphone.");
      }
    };

    startCall();

    return () => {
      // Clean up on unmount
      socket.emit("leaveRoom", { roomId });
      localStream?.getTracks().forEach((track) => track.stop());
      peerConnection?.close();
    };
  }, []); // Empty dependency array to run this effect only once

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const toggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled; // Toggle the audio track's enabled state
        setIsMicEnabled(audioTrack.enabled);  // Update mic state
        console.log("Mic enabled:", audioTrack.enabled);
      }
    }
  };

  const endCall = () => {
    socket.emit("leaveRoom", { roomId });
    localStream?.getTracks().forEach((track) => track.stop());  // Stop the local stream
    setLocalStream(null);  // Reset the local stream state
    setRemoteStream(null);  // Reset the remote stream state
    peerConnection?.close();  // Close the peer connection
    toast.success("Call ended.");
    window.close(); // Close the browser window after ending the call
  };

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
      {/* Local Video */}
      <video
        ref={localVideoRef}
        autoPlay
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {/* Remote Video */}
      <video
        ref={remoteVideoRef}
        autoPlay
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      {/* Control buttons */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Microphone button */}
        <button
          onClick={toggleMic}
          style={{
            padding: "10px 20px",
            margin: "0 10px",
            backgroundColor: isMicEnabled ? "green" : "red",
            color: "white",
            border: "none",
            borderRadius: "50%",
          }}
        >
          {isMicEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </button>

        {/* End call button */}
        <button
          onClick={endCall}
          style={{
            padding: "10px 20px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "50%",
          }}
        >
          <FaPhoneAlt />
        </button>
      </div>
    </div>
  );
};

export default VideoCallPage;
