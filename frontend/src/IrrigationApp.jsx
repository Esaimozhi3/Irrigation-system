import React, { useState } from "react";
import { Button, Card,Form, InputGroup } from "react-bootstrap";
import { format, addMinutes } from "date-fns";

const IrrigationApp = () => {
  const [plots, setPlots] = useState(4);
  const [motors, setMotors] = useState(2);
  const [startTime, setStartTime] = useState("06:00");
  const [endTime, setEndTime] = useState("19:00");
  const [runtime, setRuntime] = useState(5);
  const [interval, setInterval] = useState(20);
  const [schedule, setSchedule] = useState([]);

  // logic to generate the irrigation logic 

  const generateSchedule = () => {
    const start = new Date();
    start.setHours(...startTime.split(":").map(Number));
    const end = new Date();
    end.setHours(...endTime.split(":").map(Number));
    
    const cycles = [];
    let current = new Date(start);
    let plotIndex = 0;
    
    while (current < end) {
      for (let m = 0; m < motors && plotIndex < plots; m++) {
        const startCycle = format(current, "HH:mm");
        console.log("starttime, ", startCycle, toMilitaryTime(startCycle),)
        const endCycle = format(addMinutes(current, runtime), "HH:mm");
        cycles.push({
          index : plotIndex,
          RunBy: `Motor ${m + 1}`,
          plot: `Plot ${plotIndex + 1}`,
          startTime: toMilitaryTime(startCycle),
          endTime: toMilitaryTime(endCycle)
        });
        plotIndex++;
      }
      current = addMinutes(current, interval);
    }
    setSchedule(cycles);
    submitCycle(cycles);
  };

 // logic to convert normal time to militory time

  const toMilitaryTime = (time) => {
    if (/^\d{2}:\d{2}$/.test(time)) {
        return time; 
    }
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) {
        hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
        hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// submit irrigation details to the backend 

  const submitCycle = async (schedule) => {
    if (schedule.length === 0) {
      alert("No schedule to save!");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(schedule)   // Send the corrected data
      });
  
      if (response.ok) {
        alert("Schedule saved successfully!");
        window.location.reload();
      } else {
        alert("Failed to save schedule.");
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
      alert("Error connecting to server.");
    }
  };
  
  return (
    <div className="container p-10">
      <Form>
      <InputGroup size="sm" className="m-3">
      <Form.Group className="m-3 col-3" controlId="exampleForm.ControlInput1">
        <Form.Label>No Of Plots</Form.Label>
        <Form.Control  type="number"
              placeholder="Plots"
              value={plots}
              onChange={(e) => setPlots(+e.target.value)} />
      </Form.Group>
      <Form.Group className="m-3 col-3" controlId="exampleForm.ControlInput1">
        <Form.Label> No Of Motors</Form.Label>
        <Form.Control type="number"
              placeholder="Motors"
              value={motors}
              onChange={(e) => setMotors(+e.target.value)} />
      </Form.Group>
      
      <Form.Group className="m-3 col-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Start Time</Form.Label>
        <Form.Control  type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)} />
      </Form.Group>
      </InputGroup>
      <InputGroup size="sm" className="m-3">
      <Form.Group className="m-3 col-3" controlId="exampleForm.ControlInput1">
        <Form.Label>End Time</Form.Label>
        <Form.Control  type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}/>
      </Form.Group>
      <Form.Group className="m-3 col-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Run Time</Form.Label>
        <Form.Control  type="number"
              placeholder="Runtime (min)"
              value={runtime}
              onChange={(e) => setRuntime(+e.target.value)}/>
      </Form.Group>
      <Form.Group className="m-3 col-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Interval</Form.Label>
        <Form.Control type="number"
              placeholder="Interval (min)"
              value={interval}
              onChange={(e) => setInterval(+e.target.value)}/>
      </Form.Group>
      </InputGroup>
    </Form>
  <div className="d-flex justify-content-between w-100">
  <span></span>
  <Button onClick={generateSchedule} className="d-flex align-items-center">
    Generate Schedule
  </Button>
</div>
    </div>
   
  );
};

export default IrrigationApp;
