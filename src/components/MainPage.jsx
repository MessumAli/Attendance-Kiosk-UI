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
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
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
      const options1 = {
        hour: "numeric",
        minute: "2-digit",
      };
      const options2 = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        // hour: "numeric",
        // minute: "2-digit",
      };
      const formattedTime = now.toLocaleTimeString("en-US", options1);
      const formattedDate = now.toLocaleDateString("en-US", options2);
      setCurrentTime(formattedTime);
      setCurrentDate(formattedDate);
    }, 1000);

    return () => {
      clearInterval(intervalId);
      delayedHandleRFIDScanned.cancel();
    };
  }, [delayedHandleRFIDScanned]);

  return (
    <div className="relative h-screen bg-black">
      <div className="relative">
        <img
          className="fixed top-[-80px] right-[-90px] w-72"
          src={Green}
          alt=""
        />
      </div>
      <div className="relative">
        <img
          className="fixed bottom-[-160px] left-[-100px] w-72"
          src={Blue}
          alt=""
        />
      </div>
      <div className="flex">
        <div className="p-4 w-72">
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

      <div className="flex items-center justify-between sm:flex-col lg:flex-row sm:mt-28 lg:mt-20">
        <div className="flex flex-col md:mr-44 lg:ml-36 ">
          <p className="text-white text-7xl">Welcome to </p>
          <p className="pb-2 mt-5 overflow-hidden text-6xl font-bold animate-typing text-lime-500">
            Symtera&nbsp;Technologies
          </p>

          {/* <div className="w-auto"> */}
          <select
            className="p-2 mx-4 mt-10 border text-3xl font-bold rounded-md border-gray-300 sm:w-[650px] md:w-80 lg:w-72"
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
          {/* </div> */}
        </div>
        <div
          className="z-10 mt-[-80px]"
          style={{ transform: `rotate(-90deg)` }}
        >
          <Webcam
            className="rounded-xl"
            audio={false}
            height={200}
            width={400}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode: "user",
              width: 250,
              height: 400,
            }}
            ref={webcamRef}
          />
        </div>
      </div>

      <p className="sm:mt-[-70px] lg:mt-32 text-white font-bold text-7xl lg:text-5xl text-center">
        {currentTime}
      </p>
      <p className="sm:mt-[30px] lg:mt-32 text-white font-semibold text-5xl lg:text-5xl text-center">
        {currentDate}
      </p>
      {/* {logImg && (
        <div className="mt-5">
          <p className="text-lg text-white">Captured Image:</p>
          <img src={logImg} alt="Captured" className="rounded-lg" />
        </div>
      )} */}
    </div>
  );
};

export default MainPage;
