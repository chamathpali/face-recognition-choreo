import "./App.css";

import React, { useRef, useState } from "react";

const ProfilePage = () => {
  const webcamRef = useRef(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [showMatchTick, setShowMatchTick] = useState(false);

  // Webcam setup
  const setupWebcam = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = {
        video: true,
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          if (webcamRef.current) {
            webcamRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error("Error accessing the webcam", error);
        });
    }
  };

  // Handle profile photo upload
  const handleCapture = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const imgElement = document.createElement("img");
      imgElement.src = e.target.result;
      imgElement.className = "mb-4 w-64 h-64 object-cover rounded-full";
      const container = document.getElementById("profile-image");
      container.innerHTML = "";
      container.appendChild(imgElement);

      // Image is uploaded, show webcam
      setImageUploaded(true);
      setupWebcam();
    };
    reader.readAsDataURL(file);
  };

  // TODO: Integrate with CHoreo Backend
  const handleMatchCheck = () => {
    setShowMatchTick(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500">
      <div className="p-8 bg-white shadow-xl rounded-lg w-[800px]">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">
            Face Recognition Powered with Choreo
          </h1>
          <div id="profile-image" className="mb-4"></div>
          <h2 className="text-xl mb-4">Step 1: Upload Profile Photo</h2>
          <input type="file" onChange={handleCapture} className="mb-4" />

          {imageUploaded && (
            <>
              <div className="w-full max-w-md">
                <video
                  ref={webcamRef}
                  autoPlay
                  playsInline
                  className="w-full"
                />
              </div>
              <button
                onClick={handleMatchCheck}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Step 2: Verify Face Recognition with Webcam
              </button>
            </>
          )}

          {showMatchTick && (
            <div className="text-green-500 text-2xl mt-4">✅</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
