import React, { useState, useEffect, useRef } from "react";
import { debounce } from "lodash";
import axios from "axios";
import Webcam from "react-webcam";
import Logo from "../assets/logo.png";
import Green from "../assets/green.png";
import Blue from "../assets/blue.png";

const MainPage = () => {
  const [rfId, setRFID] = useState("Log-In");
  const [attendanceLog, setAttendanceLog] = useState("Log-In");
  const [currentDateTime, setCurrentDateTime] = useState("");
  // const [logImg, setLogImg] = useState(null);
  const inputRef = useRef(null);
  const webcamRef = useRef(null);

  const clearInput = () => {
    setRFID("");
  };

  const delayedHandleRFIDScanned = debounce(() => {
    handleRFIDScanned();
  }, 500);

  const handleRFIDScanned = async () => {
    if (rfId.length == 10) {
      const attendanceLogImg = webcamRef.current.getScreenshot();
      createAttendanceLog(rfId, attendanceLog, attendanceLogImg);
      // setLogImg(attendanceLogImg);
      clearInput();
    } else {
      console.log("Skipping API call.");
      clearInput();
    }
  };

  const createAttendanceLog = async (rfId, attendanceLog, attendanceLogImg) => {
    console.log("first", rfId);
    console.log("second", attendanceLog);
    console.log("third", attendanceLogImg);

    try {
      const response = await axios.post(
        "/api/v1/attendanceLog/create-attendance-log",
        {
          rfId,
          attendanceLog,
          attendanceLogImg,
        }
      );

      console.log(response.data);
    } catch (error) {
      console.error("Error updating user status:", error.message);
    }
  };

  useEffect(() => {
    delayedHandleRFIDScanned();
    inputRef.current.focus();

    const intervalId = setInterval(() => {
      const now = new Date();
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      };
      const formattedDateTime = now.toLocaleDateString("en-US", options);
      setCurrentDateTime(formattedDateTime);
    }, 1000);

    return () => {
      clearInterval(intervalId);
      delayedHandleRFIDScanned.cancel();
    };
  }, [delayedHandleRFIDScanned]);

  return (
    <div className="h-screen bg-black relative">
      <div className="relative">
        <img
          className="fixed top-[-80px] right-[-90px] w-72"
          src={Green}
          alt=""
        />
      </div>
      <div className="relative">
        <img
          className="fixed bottom-[-110px] left-[-100px] w-72"
          src={Blue}
          alt=""
        />
      </div>
      <div className="flex">
        <div className="w-72 p-4">
          <img src={Logo} alt="" />
        </div>
        <div>
          <input
            ref={inputRef}
            type="text"
            className="invisible"
            placeholder="Scan RFID"
            value={rfId}
            onChange={(e) => setRFID(e.target.value)}
          />
        </div>
      </div>

      <div className="flex md:flex-col lg:flex-row justify-between items-center md:mt-52 lg:mt-20">
        <div className="md:mr-44 lg:ml-36 flex flex-col ">
          <p className="text-white text-7xl">Welcome to </p>
          <p className="mt-5 text-7xl animate-typing overflow-hidden text-lime-500 font-bold">
            Symtera!
          </p>

          <select
            className="border border-gray-300 p-2 mx-4 my-10 md:w-96 lg:w-72"
            value={attendanceLog}
            onChange={(e) => setAttendanceLog(e.target.value)}
          >
            <option value="Log-In">Log-In</option>
            <option value="Log-Out">Log-Out</option>
            <option value="On-Break">On-Break</option>
            <option value="Off-Break">Off-Break</option>
            <option value="Officially-Log-Out">Officially-Log-Out</option>
            <option value="Officially-Log-In">Officially-Log-In</option>
          </select>
        </div>
        <div className="mr-48 z-10">
          <Webcam
            className="rounded-xl"
            audio={false}
            height={200}
            width={400}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode: "user",
            }}
            ref={webcamRef}
          />
        </div>
      </div>

      <p className="md:mt-[200px] lg:mt-32 text-white font-bold text-4xl lg:text-5xl text-center">
        {currentDateTime}
      </p>
      {/* {logImg && (
        <div className="mt-5">
          <p className="text-white text-lg">Captured Image:</p>
          <img src={logImg} alt="Captured" className="rounded-lg" />
        </div>
      )} */}
    </div>
  );
};

export default MainPage;
