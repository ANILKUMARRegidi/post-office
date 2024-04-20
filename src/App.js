import React, { useState } from "react";
import "./styles/style.css";

const App = () => {
  const [pincode, setPincode] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handlePincodeChange = (e) => {
    setPincode(e.target.value.trim());
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value.trim().toLowerCase());
  };

  const fetchPincodeDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data.");
      }
      const data = await response.json();
      const postOffices = data[0]?.PostOffice || [];
      setResults(postOffices);
      setShowResults(true); // Show results after fetching data
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterResults = () => {
    return results.filter(post => post.Name.toLowerCase().includes(filter));
  };

  return (
    <div className="container">
      <h1>Pincode Lookup</h1>

      {!showResults && ( // Only render input fields and button if showResults is false
        <div id='ui'>
          <label htmlFor="pincodeInput">Enter  pincode:</label>
          <input type="text" id="pincodeInput" value={pincode} onChange={handlePincodeChange} placeholder="Enter 6-digit Pincode" />
          <button id="lookupBtn" onClick={fetchPincodeDetails}>Lookup</button>
        </div>
      )}

      {showResults && (
        <>
          

          {loading && <div id="loader" className="loader"></div>}
          {error && <p>Error: {error}</p>}
          <div id="results">
            <p><strong>Pincode</strong>: {pincode}</p>
            <p><strong>Message</strong>: Number of pincode(s) found: {filterResults().length}</p>
            <div className="filter-container">
            <label htmlFor="filterInput">
              <i className="fas fa-filter"></i> {/* Filter icon */}
            </label>
            <input type="text" id="filterInput" value={filter} onChange={handleFilterChange} placeholder="Filter" />
          </div>
            {filterResults().map(post => (
              <div className="result-item" key={post.Pincode}>
                <p><strong>Post Office:</strong> {post.Name}</p>
                <p><strong>Pincode:</strong> {post.Pincode}</p>
                <p><strong>District:</strong> {post.District}</p>
                <p><strong>State:</strong> {post.State}</p>
              </div>
            ))}
            {filterResults().length === 0 && <p>Couldn't find the postal data you're looking for...</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
