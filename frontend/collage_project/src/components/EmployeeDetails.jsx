// import React, { useEffect, useState } from "react";
// import api from "../api";
// import {
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Button,
//   MenuItem,
//   CircularProgress,
//   Alert,
// } from "@mui/material";
// import "../styles/AddMarks.css";

// export default function AddMarks() {
//   const [students, setStudents] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [examTypes, setExamTypes] = useState([]);
//   const [form, setForm] = useState({
//     st_id: "",
//     sub_id: "",
//     exam_type_id: "",
//     marks: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [resp, setResp] = useState(null);

//   // Load initial data
//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const [sRes, subRes, eRes] = await Promise.all([
//           api.get("/get_students"),
//           api.get("/get_subjects"),
//           api.get("/get_exam_type"),
//         ]);
//         setStudents(sRes.data?.student || []);
//         console.log(sRes.data);
//         setSubjects(subRes.data?.subjects || []);
//         setExamTypes(eRes.data?.exam_type || []);
//       } catch (err) {
//         setError(err.response?.data?.error || "Failed to load data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadData();
//   }, []);

//   const handleChange = (e) =>
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

//   const onSubmit = async () => {
//     setSaving(true);
//     setError("");
//     try {
//       const res = await api.post("/add_marks", form);
//       setResp(res.data);
//       setForm({ st_id: "", sub_id: "", exam_type_id: "", marks: "" }); // Reset only on success
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to save marks");
//     } finally {
//       setSaving(false);
//     }
//   };

//   console.log({ students });

//   return (
//     <Card className="card">
//       <CardContent>
//         <Typography variant="h6">Add Marks</Typography>

//         {loading && <CircularProgress size={24} />}
//         {error && <Alert severity="error">{error}</Alert>}

//         {!loading && (
//           <>
//             <div className="form-row">
//               <TextField
//                 select
//                 name="st_id"
//                 value={form.st_id}
//                 onChange={handleChange}
//                 label="Student"
//                 size="small"
//                 fullWidth
//               >
//                 <MenuItem value="">-- Select --</MenuItem>
//                 {students.map((s) => (
//                   <MenuItem key={s.student_id} value={s.student_id}>
//                     {s.student_name}
//                   </MenuItem>
//                 ))}
//               </TextField>

//               <TextField
//                 select
//                 name="sub_id"
//                 value={form.sub_id}
//                 onChange={handleChange}
//                 label="Subject"
//                 size="small"
//                 fullWidth
//               >
//                 <MenuItem value="">-- Select --</MenuItem>
//                 {subjects.map((sub) => (
//                   <MenuItem key={sub.subject_id} value={sub.subject_id}>
//                     {sub.subject_name}
//                   </MenuItem>
//                 ))}
//               </TextField>

//               <TextField
//                 select
//                 name="exam_type_id"
//                 value={form.exam_type_id}
//                 onChange={handleChange}
//                 label="Exam"
//                 size="small"
//                 fullWidth
//               >
//                 <MenuItem value="">-- Select --</MenuItem>
//                 {examTypes.map((e) => (
//                   <MenuItem key={e.exam_type_id} value={e.exam_type_id}>
//                     {e.exam_name}
//                   </MenuItem>
//                 ))}
//               </TextField>

//               <TextField
//                 name="marks"
//                 label="Marks"
//                 value={form.marks}
//                 onChange={handleChange}
//                 size="small"
//                 fullWidth
//               />
//             </div>

//             <div style={{ marginTop: 12 }}>
//               <Button
//                 variant="contained"
//                 onClick={onSubmit}
//                 disabled={
//                   saving ||
//                   !form.st_id ||
//                   !form.sub_id ||
//                   !form.exam_type_id ||
//                   !form.marks
//                 }
//               >
//                 {saving ? "Saving..." : "Save Marks"}
//               </Button>
//             </div>

//             {resp && (
//               <pre className="resp">{JSON.stringify(resp, null, 2)}</pre>
//             )}
//           </>
//         )}
//       </CardContent>
//     </Card>
//   );
// }






import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/EmployeeDetails.css";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";

function EmployeeDetails() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editEmployee, setEditEmployee] = useState(null);
  const itemsPerPage = 8;
  const BASE_URL = "http://localhost:5000";

  const fetchEmployees = () => {
    axios
      .get(`${BASE_URL}/employeeinformation`)
      .then((response) => setEmployees(response.data.employees || []))
      .catch((error) => console.error("Error fetching employees:", error));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employee_no?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      axios
        .delete(`${BASE_URL}/EmployeeInformation/${id}`)
        .then(() => {
          alert("Employee deleted successfully!");
          fetchEmployees();
        })
        .catch((err) => console.error(err));
    }
  };

  const handleEditClick = (emp) => {
    setEditEmployee(emp);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`${BASE_URL}/EmployeeInformation/${editEmployee.id}`, editEmployee)
      .then(() => {
        alert("Employee updated successfully!");
        setEditEmployee(null);
        fetchEmployees();
      })
      .catch((err) => console.error("Error updating employee:", err));
  };

  return (
    <div className="employee-details">
      <div className="header-bar">
        <h2>Employee Directory</h2>
        <div className="toolbar">
          <button
            className="add-new-button"
            onClick={() => (window.location.href = "/employees/add")}
          >
            + Add New
          </button>
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Emp No</th>
              <th>First</th>
              <th>Last</th>
              <th>Dept</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Joining</th>
              <th>Retirement</th>
              <th>DOB</th>
              <th>PAN</th>
              <th>Aadhar</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Bank Acc</th>
              <th>IFSC</th>
              <th>PF</th>
              <th>ESI</th>
              <th>Father</th>
              <th>Father Ph</th>
              <th>Spouse</th>
              <th>Spouse Ph</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.length === 0 ? (
              <tr>
                <td colSpan="21" className="no-data">No employees found</td>
              </tr>
            ) : (
              paginatedEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.employee_no}</td>
                  <td>{emp.firstname}</td>
                  <td>{emp.lastname}</td>
                  <td>{emp.department_id}</td>
                  <td>{emp.position_id}</td>
                  <td>₹{emp.salary}</td>
                  <td>{emp.joining_date || "-"}</td>
                  <td>{emp.retirement_date || "-"}</td>
                  <td>{emp.date_of_birth || "-"}</td>
                  <td>{emp.pan_no || "-"}</td>
                  <td>{emp.aadhar_no || "-"}</td>
                  <td>{emp.mobile_no || "-"}</td>
                  <td>{emp.email || "-"}</td>
                  <td>{emp.bank_account_no || "-"}</td>
                  <td>{emp.ifsc_code || "-"}</td>
                  <td>{emp.pf_account_no || "-"}</td>
                  <td>{emp.esi_no || "-"}</td>
                  <td>{emp.fathers_name || "-"}</td>
                  <td>{emp.father_ph_no || "-"}</td>
                  <td>{emp.spouse_name || "-"}</td>
                  <td>{emp.spouse_ph_no || "-"}</td>
                  <td>
                    <button
                      className="action-button edit"
                      onClick={() => handleEditClick(emp)}
                    >
                      ✏
                    </button>
                    <button
                      className="action-button delete"
                      onClick={() => handleDelete(emp.id)}
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {editEmployee && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Employee Information</h3>
            <form onSubmit={handleUpdateSubmit}>
              {Object.keys(editEmployee).map(
                (key) =>
                  key !== "id" && (
                    <label key={key}>
                      {key.replaceAll("_", " ").toUpperCase()}:
                      <input
                        type="text"
                        value={editEmployee[key] || ""}
                        onChange={(e) =>
                          setEditEmployee({
                            ...editEmployee,
                            [key]: e.target.value,
                          })
                        }
                      />
                    </label>
                  )
              )}
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setEditEmployee(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeDetails;