import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { useRef } from "react";
import IrrigationApp from './IrrigationApp';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './iotDashboard';
function App() {
  // const [count, setCount] = useState(60);
  // const intervalRef = useRef(null);  // Use ref to persist interval ID

  // const handleStart = () => {
  //   // if (intervalRef.current) return; // Prevent multiple intervals
  //   intervalRef.current = setInterval(() => {
  //     setCount((prev) => prev - 1);
  //   }, 1000);
  // };

  // const handlePause = () => {
  //   clearInterval(intervalRef.current);
  //   intervalRef.current = null;  // Reset ref
  // };

  // const handleReset = () => {
  //   handlePause();  // Clear any existing interval
  //   setCount(60);
  // };

  return (
    <>
      {/* <h1> Timer {count}</h1>
      <button onClick={handleStart}>Start</button>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handleReset}>Reset</button> */}
      {/* <IrrigationApp/> */}
      <Dashboard/>
    </>
  );
};


export default App
