import React, { useState, useEffect } from "react";
import "../styles/Allowances.css";

const Allowances = () => {
  const [allowances, setAllowances] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);
  const [formData, setFormData] = useState({
    employee_id: "",
    type: "",
    amount: "",
    effective_date: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

 
  const fetchAllowances = () => {
    fetch("http://localhost:5000/allowances")
      .then((res) => res.json())
      .then((data) => setAllowances(data.allowances || []))
      .catch((err) => console.error("Error fetching allowances:", err));
  };

  useEffect(() => {
    fetchAllowances();
  }, []);

 
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/add_allowance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      alert(result.message || "Allowance added successfully");
      fetchAllowances();
      setFormData({
        employee_id: "",
        type: "",
        amount: "",
        effective_date: "",
      });
    } catch (error) {
      console.error("Error adding allowance:", error);
      alert("Failed to add allowance");
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const filteredRecords = allowances.filter(
    (a) =>
      a.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.employee_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  return (
    <div className="allowance-container">
      <h2>Employee Allowances</h2>

     
      <div className="allowance-top">
        <input
          type="text"
          className="search-box"
          placeholder="Search by name, ID, or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <form onSubmit={handleSubmit} className="allowance-form">
          <div className="form-group">
            <label>Employee ID:</label>
            <input
              type="number"
              id="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Type:</label>
            <select id="type" value={formData.type} onChange={handleChange} required>
              <option value="">Select Type</option>
              <option value="Housing">Housing</option>
              <option value="Transport">Transport</option>
              <option value="Medical">Medical</option>
              <option value="Meal">Meal</option>
              <option value="Festival">Festival</option>
            </select>
          </div>

          <div className="form-group">
            <label>Amount:</label>
            <input
              type="number"
              id="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              required
            />
          </div>

          <div className="form-group">
            <label>Effective Date:</label>
            <input
              type="date"
              id="effective_date"
              value={formData.effective_date}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Add Allowance"}
          </button>
        </form>
      </div>

      
      <table className="allowance-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Effective Date</th>
            <th>Date Created</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.length > 0 ? (
            currentRecords.map((a) => (
              <tr key={a.allowance_id}>
                <td>{a.allowance_id}</td>
                <td>{`${a.employee_no} - ${a.firstname} ${a.lastname}`}</td>
                <td>{a.type}</td>
                <td>{a.amount}</td>
                <td>{a.effective_date}</td>
                <td>{a.date_created}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-data">
                No allowance records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Allowances;