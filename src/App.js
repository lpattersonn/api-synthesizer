import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Papa from 'papaparse';
import React, { useState, useEffect } from 'react';

function App() {
  const [mercyAPI, setMercyAPI] = useState([]);
  const [apiValue, setAPIValue] = useState("");
  const [userValue, setUserValue] = useState();
  const [userObject, setUserObject] = useState();
  const [userReturn, setUserReturn] = useState();
  const [csvData, setCSVData] = useState([]);

// Download CSV\
const downloadCSV = () => {
  if (csvData.length > 0) {
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert("Enter your API details and search before downloading CSV.");
  }
};

// API Call 
function handleClick() {
  if (mercyAPI.length === 0) {
    axios.get(apiValue)
    .then(function (response) {
      setMercyAPI(response.data);
      processCSVData(response.data);
    })
    .catch(function (err) {
      console.log(err);
    });
  }
};

const processCSVData = (apiData) => {
  if (apiData[userValue]) {
    const newData = apiData[userValue].map((item) => ({
      [userReturn]: item[userObject][userReturn]
    }));
    setCSVData(newData);
  } else {
    setCSVData([]);
  }
};


const dataCall = () => {
  if (mercyAPI[userValue]) {
      if (userReturn) {
        return (
          <table>
            <thead>
              <tr>
                <th>{userReturn}:</th>
              </tr>
            </thead>
            <tbody>
              {csvData.map((rowData, index) => (
                <tr key={index}>
                  <td>{rowData[userReturn]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
    } else {
      return (
        <table>
          <thead>
            <tr>
              <th>Results:</th>
            </tr>
          </thead>
          <tbody>
            {csvData.map((rowData, index) => (
              <tr key={index}>
                <td>{rowData}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  } else {
    return (
      <div className="mb-3">
        No Values Found.
      </div>
    );
  }
};
  
  return (
    <div className="container primary mt-5">
      <h1>API Synthesizer</h1>
      <p>JSON Array of objects API Synthesizer.</p>
      <div className="card mt-4">
        <div className="card-body">
          <form onSubmit={(e) => {
            e.preventDefault();
            } }>
            <div className="row">
              <div className="col-lg-6 mb-3">
                <label htmlFor="api-string">1. Enter Your Api URL*</label>
                <input type="text" className="form-control" id="api-string" value={apiValue} onChange={e => {
                  setAPIValue(e.target.value);
                  console.log(apiValue) }} required />
              </div>
              <div className="col-lg-6 mb-3">
                  <label htmlFor="object-string">2. Enter Data Array Name</label>
                  <input type="text" className="form-control" id="value-string" value={userValue} onChange={e => {setUserValue(e.target.value)}} />
              </div>
              <div className="col-lg-6 mb-3">
                  <label htmlFor="object-string">3. Enter Object Name</label>
                  <input type="text" className="form-control" id="object-string" value={userObject} onChange={e => {setUserObject(e.target.value)}} />
              </div>
              <div className="col-lg-6 mb-3">
                  <label htmlFor="return-string">4. Enter Key Name</label>
                  <input type="text" className="form-control" id="return-string" value={userReturn} onChange={e => {setUserReturn(e.target.value)}} />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-auto">
                <button type="submit" className="btn btn-primary btn-lg" onClick={()=>handleClick()}>
                  Search
                </button>
              </div>
              <div className="col-auto">
                <button type="submit" className="btn btn-secondary btn-lg" onClick={downloadCSV}>
                  Export CSV
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="results card mt-4"> 
        <div className="results card-body"> 
          <div className="row">
            <div className="col-lg-12">
                <h2>Values:</h2>
                {dataCall()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default App;
