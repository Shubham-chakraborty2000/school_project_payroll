// import React, { useEffect, useState } from "react";
// import api from "../api";
// import ViewTable from "./ViewTable";

// export default function ViewClasses() {
//   const [data, setData] = useState([]);
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await api.get("/get_classes");
//         setData(res.data?.classes);
//       } catch (e) {
//         console.warn(e);
//       }
//     })();
//   }, []);
//   return <ViewTable title="Classes" data={data} />;
// }






import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/BasicSalary.css";

function BasicSalary() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newSalary, setNewSalary] = useState("");
  const itemsPerPage = 8;

  
  useEffect(() => {
    axios
      .get("http://localhost:5000/basic_salary")
      .then((res) => {
        setEmployees(res.data.basic_salary);
      })
      .catch((err) => console.error("Error fetching salaries:", err));
  }, []);


  const filtered = employees.filter(
    (emp) =>
      emp.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employee_no.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const openModal = (employee) => {
    setSelectedEmployee(employee);
    setNewSalary(employee.salary);
  };

  const handleSalaryUpdate = () => {
    axios
      .put(`http://localhost:5000/EmployeeInformation/${selectedEmployee.employee_id}`, {
        ...selectedEmployee,
        salary: newSalary,
      })
      .then(() => {
        alert("Salary updated successfully!");
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.employee_id === selectedEmployee.employee_id
              ? { ...emp, salary: newSalary }
              : emp
          )
        );
        closeModal();
      })
      .catch((err) => console.error("Error updating salary:", err));
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    setNewSalary("");
  };

  return (
    <div className="basic-salary-container">
      <h2 className="section-title">Gross Pay › Basic Salary</h2>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search by name or employee no..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <table className="salary-table">
        <thead>
          <tr>
            <th>Employee No</th>
            <th>Full Name</th>
            <th>Current Salary (₹)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.length > 0 ? (
            paginated.map((emp) => (
              <tr key={emp.employee_id}>
                <td>{emp.employee_no}</td>
                <td>
                  {emp.firstname} {emp.lastname}
                </td>
                <td>{parseFloat(emp.salary).toLocaleString()}</td>
                <td>
                  <button className="edit-btn" onClick={() => openModal(emp)}>
                    ✏️ Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", color: "#888" }}>
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>

     
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

  
      {selectedEmployee && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Salary</h3>
            <p>
              <strong>Employee:</strong> {selectedEmployee.firstname}{" "}
              {selectedEmployee.lastname}
            </p>
            <p>
              <strong>Employee No:</strong> {selectedEmployee.employee_no}
            </p>
            <label>New Salary (₹):</label>
            <input
              type="number"
              value={newSalary}
              onChange={(e) => setNewSalary(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleSalaryUpdate} className="save-btn">
                Save
              </button>
              <button onClick={closeModal} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BasicSalary;