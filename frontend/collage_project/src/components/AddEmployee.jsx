// import React, { useEffect, useState } from "react";
// import api from "../api";
// import {
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Button,
//   MenuItem,
// } from "@mui/material";
// import "../styles/AddStudent.css";

// export default function AddStudent() {
//   const [name, setName] = useState("");
//   const [classList, setClassList] = useState([]);
//   const [className, setClassName] = useState("");
//   const [section, setSection] = useState("");
//   const [resp, setResp] = useState(null);

//   useEffect(() => {
//     async function load() {
//       try {
//         const res = await api.get("/get_classes");
//         setClassList(res.data?.classes);
//       } catch (err) {
//         console.error(err);
//       }
//     }
//     load();
//   }, []);

//   const onSubmit = async () => {
//     try {
//       const res = await api.post("/add_student", {
//         name,
//         class_name: className,
//         section,
//       });
//       setResp(res.data);
//       setName("");
//       setClassName("");
//       setSection("");
//     } catch (err) {
//       setResp({ error: err.response?.data?.error || err.message });
//     }
//   };

//   // derive unique class names and sections for dropdowns
//   const uniqueClassNames = Array.from(
//     new Set((classList || []).map((c) => c.CLASS_NAME || c.class_name))
//   ).filter(Boolean);

//   const uniqueSections = Array.from(
//     new Set((classList || []).map((c) => c.SECTION || c.section))
//   ).filter(Boolean);

//   return (
//     <Card className="card">
//       <CardContent>
//         <Typography variant="h6">Add Student</Typography>
//         <div className="form-row">
//           <TextField
//             label="Student name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             size="small"
//           />
//           <TextField
//             select
//             label="Class"
//             value={className}
//             onChange={(e) => setClassName(e.target.value)}
//             size="small"
//           >
//             <MenuItem value="">-- Select class --</MenuItem>
//             {uniqueClassNames.map((n) => (
//               <MenuItem key={n} value={n}>
//                 {n}
//               </MenuItem>
//             ))}
//           </TextField>
//           <TextField
//             select
//             label="Section"
//             value={section}
//             onChange={(e) => setSection(e.target.value)}
//             size="small"
//           >
//             <MenuItem value="">-- Select section --</MenuItem>
//             {uniqueSections.map((s) => (
//               <MenuItem key={s} value={s}>
//                 {s}
//               </MenuItem>
//             ))}
//           </TextField>
//           <Button variant="contained" onClick={onSubmit}>
//             Save
//           </Button>
//         </div>
//         {resp && <pre className="resp">{JSON.stringify(resp, null, 2)}</pre>}
//       </CardContent>
//     </Card>
//   );
// }







import React, { useState } from "react";
import axios from "axios";
import "../styles/AddEmployee.css";

function AddEmployee() {
  const [formData, setFormData] = useState({
    employee_no: "",
    firstname: "",
    middlename: "",
    lastname: "",
    department_id: "",
    position_id: "",
    salary: "",
  });

  const [loading, setLoading] = useState(false);
  const BASE_URL = "http://localhost:5000";

  const departments = [
    { id: 1, name: "HR" },
    { id: 2, name: "Finance" },
    { id: 3, name: "IT" },
    { id: 4, name: "Operations" },
  ];

  const positions = [
    { id: 1, title: "Manager" },
    { id: 2, title: "Assistant" },
    { id: 3, title: "Technician" },
    { id: 4, title: "Clerk" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/employeeinformation`, formData);
      alert(res.data.message || "Employee added successfully!");
      setFormData({
        employee_no: "",
        firstname: "",
        middlename: "",
        lastname: "",
        department_id: "",
        position_id: "",
        salary: "",
      });
    } catch (err) {
      console.error("Error adding employee:", err);
      alert("Failed to add employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-employee">
      <h2>Add New Employee</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Employee No:</label>
          <input
            type="text"
            name="employee_no"
            value={formData.employee_no}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <label>First Name:</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <label>Middle Name:</label>
          <input
            type="text"
            name="middlename"
            value={formData.middlename}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <label>Department:</label>
          <select
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select Department</option>
            {departments.map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label>Position:</label>
          <select
            name="position_id"
            value={formData.position_id}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select Position</option>
            {positions.map((pos) => (
              <option key={pos.id} value={pos.id}>
                {pos.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label>Salary:</label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="button-row">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : (
              "➕ Add Employee"
            )}
          </button>

          <button
            type="button"
            className="cancel-btn"
            onClick={() => (window.location.href = "/employees")}
            disabled={loading}
          >
            ⬅ Back to List
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEmployee;