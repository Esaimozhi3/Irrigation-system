import React, { useEffect, useState } from 'react';
import Modal from "react-modal";
import 'bootstrap/dist/css/bootstrap.min.css';
import IrrigationApp from './IrrigationApp';

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [devices, setDevices] = useState([]);
  const [currentTime, setCurrentTime] = useState('');
  const [selectedFilterValue, setSelectedFilterValue] = useState('');
  const [filterTextValue, setFilterTextValue] = useState('');
  const itemsPerPage = 7;
  const [filteredDevices, setFlteredDevices] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const totalPages = Math.ceil(devices.length / itemsPerPage);
  selectedFilterValue

  useEffect(() => {
    let ctime;
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
       ctime = `${hours}:${minutes}`
      setCurrentTime(`${hours}:${minutes}`);
      console.log(ctime, "current time")
    };
    console.log(currentTime, "current time")
    updateTime();
    getIrrigationDetails(ctime);
    const interval = setInterval(updateTime, 1000 * 60); // Update every minute
    return () => clearInterval(interval);
   
  }, []); 

  //  logic for page navigation 

  const startIndex = (currentPage - 1) * itemsPerPage;
  let currentDevices;
  if(filteredDevices.length > 0){
     currentDevices = filteredDevices.slice(startIndex, startIndex + itemsPerPage);
  } else {
     currentDevices = devices.slice(startIndex, startIndex + itemsPerPage);
  }
  

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // function to convert miltary time to standard time

  const toStandardTime = (militaryTime) => {
    if (!militaryTime || typeof militaryTime !== 'string' || !militaryTime.includes(':')) {
        console.warn(`Invalid time format: ${militaryTime}`);  // Debugging log
        return 'Invalid Time';  
    }

    const [hoursStr, minutesStr] = militaryTime.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (isNaN(hours) || isNaN(minutes)) {
        console.warn(`Invalid time values: ${militaryTime}`);
        return 'Invalid Time';
    }

    const period = hours >= 12 ? 'PM' : 'AM';
    const standardHours = hours % 12 || 12;

    return `${standardHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// get irrigation details 

  const getIrrigationDetails = async (ctime) => {
    try {
      const response = await fetch("http://localhost:5000/api/schedule", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
     
      const data1 = data.map(value => ({
          index : value.index,
          RunBy : value.RunBy,
          plot: value.plot,
          startTime:toStandardTime(value.startTime),
          endTime: toStandardTime(value.endTime),
          status : getStatus((value.startTime),(value.endTime),ctime )
      }))
      console.log(data, data1);
      setDevices(data1); 
    } catch (error) {
      console.error("Error fetching irrigation details:", error);
    }
  };

  const getStatus = (startTime, endTime, currentTime) => {
    // if (!currentTime) return 'Pending';
    if (currentTime > endTime) return 'Done';
    if (currentTime >= startTime && currentTime <= endTime) return 'In-Progress';
    return 'Pending';
  };
  
  // logic to filter based on the selected type
  
const handleFilter = (e) => {
  setFlteredDevices([])
  let value = e.target.value, filteredDevices;
  setFilterTextValue(value)
  if(value){
  if(selectedFilterValue == "runBy"){
     filteredDevices = devices.filter(device => device.RunBy.toLowerCase().includes(value.toLowerCase()) )
  } else if(selectedFilterValue == "status"){
     filteredDevices = devices.filter(device => device.status.toLowerCase().includes(value.toLowerCase()) )
  } else if(selectedFilterValue == "plot"){
     filteredDevices = devices.filter(device => device.plot.toLowerCase().includes(value.toLowerCase()) )
  }
  if(filteredDevices.length > 0)
    {
     setFlteredDevices(filteredDevices)
    } else {
     setFlteredDevices([])
    }
} else {
  setFlteredDevices([])
}
}

  return (
    <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to bottom, rgb(85, 163, 227) 75%, rgb(236, 240, 243) 25%)',
        color: '#fff', 
        padding: '50px'
      }}>
        <Modal 
        isOpen={isOpen} 
        onRequestClose={() => setIsOpen(false)}
        style={{
          content: {
            width: "700px",
            height: "400px",
            margin: "auto",
            padding: "20px",
            borderRadius: "10px",
          }
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h4>Irrigation Details</h4>
          <div
  style={{ cursor: "pointer", fontSize: "28px" }}
  onClick={() => setIsOpen(false)}
>
  &times;
</div>
        </div>
        <IrrigationApp/>
      </Modal>
    <div className="container py-4">
    <h1 className="mb-4 inline-block">Irrigation System</h1>
      <div style={{ display : 'flex' ,alignItems: "left", gap: "10px", justifyContent : 'flex-end', marginBottom : '10px' }}>
       <select value = {selectedFilterValue} onChange={(e) => setSelectedFilterValue(e.target.value)}>
        <option value="">Filter By</option>
        <option value= "plot"> Plot</option>
        <option value= "status"> Status</option>
        <option value= "runBy"> RunBy</option>
      </select>
      <input type='text' value = {filterTextValue}  onChange={handleFilter} placeholder='Search' />
      <button className="btn btn-warning" onClick={()=> setIsOpen(true)}> Edit </button>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>Index</th>
                <th>RunBy</th>
                <th>Plot</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              { (filterTextValue && filteredDevices.length == 0) ?  " No records " :currentDevices.map((device) => (
                <tr key={device.id}>
                  <td>{device.index}</td>
                  <td>{device.RunBy}</td>
                  <td>{device.plot}</td>
                  <td>{device.startTime}</td>
                  <td>{device.endTime}</td>
                  <td style={{color : device.status == "Done" ? "red" :  device.status == "In-Progress" ? "green" : "blue" }}>{device.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <button className="btn btn-primary" onClick={prevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button className="btn btn-primary" onClick={nextPage} disabled={currentPage === totalPages}>
              Next 
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
