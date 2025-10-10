// import React, { useState } from "react";
// import api from "../api";
// import {
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Button,
// } from "@mui/material";
// import "../styles/AddClass.css";

// export default function AddClass() {
//   const [className, setClassName] = useState("");
//   const [section, setSection] = useState("");
//   const [resp, setResp] = useState(null);

//   const onSubmit = async () => {
//     try {
//       const res = await api.post("/add_class", {
//         class_name: className,
//         section,
//       });
//       setResp(res.data);
//       setClassName("");
//       setSection("");
//     } catch (err) {
//       setResp({ error: err.response?.data?.error || err.message });
//     }
//   };

//   return (
//     <Card className="card">
//       <CardContent>
//         <Typography variant="h6">Add Class & Section</Typography>
//         <div className="form-row">
//           <TextField
//             label="Class name"
//             value={className}
//             onChange={(e) => setClassName(e.target.value)}
//             size="small"
//           />
//           <TextField
//             label="Section"
//             value={section}
//             onChange={(e) => setSection(e.target.value)}
//             size="small"
//           />
//           <Button variant="contained" onClick={onSubmit}>
//             Save
//           </Button>
//         </div>
//         {resp && <pre className="resp">{JSON.stringify(resp, null, 2)}</pre>}
//       </CardContent>
//     </Card>
//   );
// }





import React from 'react';
import '../styles/Topbar.css';

function Topbar({ user, onLogout }) {
  return (
    <div className="topbar">
      <div className="left-title"> Payroll Management</div>
      <div className="right-controls">
        <span className="username">Hello, {user}</span>
        <button className="logout-button" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Topbar;
