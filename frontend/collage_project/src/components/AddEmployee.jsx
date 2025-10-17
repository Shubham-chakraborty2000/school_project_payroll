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
    joining_date: "",
    retirement_date: "",
    date_of_birth: "",
    pan_no: "",
    aadhar_no: "",
    mobile_no: "",
    email: "",
    pf_account_no: "",
    bank_account_no: "",
    ifsc_code: "",
    esi_no: "",
    fathers_name: "",
    father_ph_no: "",
    spouse_name: "",
    spouse_ph_no: ""
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
        joining_date: "",
        retirement_date: "",
        date_of_birth: "",
        pan_no: "",
        aadhar_no: "",
        mobile_no: "",
        email: "",
        pf_account_no: "",
        bank_account_no: "",
        ifsc_code: "",
        esi_no: "",
        fathers_name: "",
        father_ph_no: "",
        spouse_name: "",
        spouse_ph_no: ""
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
        <h3 className="section-title">Personal Information</h3>
        <div className="form-grid">
          <div className="form-row"><label>Employee No:</label>
            <input type="text" name="employee_no" value={formData.employee_no} onChange={handleChange} required />
          </div>

          <div className="form-row"><label>First Name:</label>
            <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} required />
          </div>

          <div className="form-row"><label>Middle Name:</label>
            <input type="text" name="middlename" value={formData.middlename} onChange={handleChange} />
          </div>

          <div className="form-row"><label>Last Name:</label>
            <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} required />
          </div>

          <div className="form-row"><label>Joining Date:</label>
            <input type="date" name="joining_date" value={formData.joining_date} onChange={handleChange} required />
          </div>

          <div className="form-row"><label>Retirement Date:</label>
            <input type="date" name="retirement_date" value={formData.retirement_date} onChange={handleChange} />
          </div>

          <div className="form-row"><label>Date of Birth:</label>
            <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />
          </div>

          <div className="form-row"><label>Department:</label>
            <select name="department_id" value={formData.department_id} onChange={handleChange} required>
              <option value="">Select Department</option>
              {departments.map(dep => <option key={dep.id} value={dep.id}>{dep.name}</option>)}
            </select>
          </div>

          <div className="form-row"><label>Position:</label>
            <select name="position_id" value={formData.position_id} onChange={handleChange} required>
              <option value="">Select Position</option>
              {positions.map(pos => <option key={pos.id} value={pos.id}>{pos.title}</option>)}
            </select>
          </div>

          <div className="form-row"><label>Salary:</label>
            <input type="number" name="salary" value={formData.salary} onChange={handleChange} required />
          </div>
        </div>

        <h3 className="section-title">Identification Details</h3>
        <div className="form-grid">
          <div className="form-row"><label>PAN No:</label>
            <input type="text" name="pan_no" value={formData.pan_no} onChange={handleChange} />
          </div>

          <div className="form-row"><label>Aadhar No:</label>
            <input type="text" name="aadhar_no" value={formData.aadhar_no} onChange={handleChange} />
          </div>

          <div className="form-row"><label>Mobile No:</label>
            <input type="text" name="mobile_no" value={formData.mobile_no} onChange={handleChange} required />
          </div>

          <div className="form-row"><label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
        </div>

        <h3 className="section-title">Account Details</h3>
        <div className="form-grid">
          <div className="form-row"><label>PF Account No:</label>
            <input type="text" name="pf_account_no" value={formData.pf_account_no} onChange={handleChange} />
          </div>

          <div className="form-row"><label>Bank Account No:</label>
            <input type="text" name="bank_account_no" value={formData.bank_account_no} onChange={handleChange} />
          </div>

          <div className="form-row"><label>IFSC Code:</label>
            <input type="text" name="ifsc_code" value={formData.ifsc_code} onChange={handleChange} />
          </div>

          <div className="form-row"><label>ESI No:</label>
            <input type="text" name="esi_no" value={formData.esi_no} onChange={handleChange} />
          </div>
        </div>

        <h3 className="section-title">Family Information</h3>
        <div className="form-grid">
          <div className="form-row"><label>Father's Name:</label>
            <input type="text" name="fathers_name" value={formData.fathers_name} onChange={handleChange} />
          </div>

          <div className="form-row"><label>Father Phone:</label>
            <input type="text" name="father_ph_no" value={formData.father_ph_no} onChange={handleChange} />
          </div>

          <div className="form-row"><label>Spouse Name:</label>
            <input type="text" name="spouse_name" value={formData.spouse_name} onChange={handleChange} />
          </div>

          <div className="form-row"><label>Spouse Phone:</label>
            <input type="text" name="spouse_ph_no" value={formData.spouse_ph_no} onChange={handleChange} />
          </div>
        </div>

        <div className="button-row">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <span className="spinner"></span> : "➕ Add Employee"}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => (window.location.href = "/employees")}
          >
            ⬅ Back to List
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEmployee;