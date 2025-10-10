// import { MenuItem, TextField } from "@mui/material";
// import React, { useState } from "react";
// import api from "../api";

// function AddSubject() {
//   const [subName, setSubName] = useState("");
//   const [message, setMessage] = useState("");
//   const [className, setClassName] = useState("");
//   const [section, setSection] = useState("");
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!subName.trim()) {
//       setMessage("⚠ Subject name cannot be empty");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:5000/add_subject", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           sub_name: subName,
//           class_id: className.class_id,
//         }),
//       });

//       const data = await response.json();
//       if (data.error) {
//         setMessage("❌ " + data.error);
//       } else {
//         setMessage("✅ " + data.message);
//         setSubName("");
//       }
//     } catch (error) {
//       setMessage("❌ Something went wrong: " + error.message);
//     }
//   };
//   const [classList, setClassList] = useState([]);
//   React.useEffect(() => {
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
//   const uniqueClassNames = Array.from(
//     new Set((classList || []).map((c) => c.CLASS_NAME || c.class_name))
//   ).filter(Boolean);

//   const uniqueSections = Array.from(
//     new Set((classList || []).map((c) => c.SECTION || c.section))
//   ).filter(Boolean);

//   return (
//     <div>
//       <h2>Add Subject</h2>
//       <form onSubmit={handleSubmit}>
//         <TextField
//           select
//           label="Class"
//           value={
//             className.class_name && className.section
//               ? `${className.class_name}-${className.section}-${className.class_id}`
//               : ""
//           }
//           onChange={(e) => {
//             const [name, section, id] = e.target.value.split("-");
//             setClassName({ class_name: name, section: section, class_id: id });
//           }}
//           size="small"
//         >
//           <MenuItem value="">-- Select class and section --</MenuItem>
//           {classList.map((n) => (
//             <MenuItem
//               key={n.class_id}
//               value={`${n.class_name}-${n.section}-${n.class_id}`} // FIXED here
//             >
//               {n.class_name} - {n.section}
//             </MenuItem>
//           ))}
//         </TextField>

//         {/* <TextField
//           select
//           label="Section"
//           value={section}
//           onChange={(e) => setSection(e.target.value)}
//           size="small"
//         >
//           <MenuItem value="">-- Select section --</MenuItem>
//           {uniqueSections.map((s) => (
//             <MenuItem key={s} value={s}>
//               {s}
//             </MenuItem>
//           ))}
//         </TextField> */}
//         <input
//           type="text"
//           value={subName}
//           onChange={(e) => setSubName(e.target.value)}
//           placeholder="Enter subject name"
//         />
//         <button type="submit">Add</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// }

// export default AddSubject;





import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AttendanceSummary.css";

export default function AttendanceSummary() {
  const [month, setMonth] = useState(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${d.getFullYear()}-${mm}`;
  });
  const [data, setData] = useState([]); 
  const [filtered, setFiltered] = useState([]); 
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);

  const BASE = "http://localhost:5000";

  useEffect(() => {
    fetchSummary(month);
   
    setSearch("");
    setPage(1);
  }, [month]);

  useEffect(() => {
    
    const q = search.trim().toLowerCase();
    if (!q) {
      setFiltered(data);
      setPage(1);
      return;
    }
    const out = data.filter((r) => {
      const name = (r.employee_name || "").toLowerCase();
      const no = (r.employee_no || "").toLowerCase();
      return name.includes(q) || no.includes(q);
    });
    setFiltered(out);
    setPage(1);
  }, [search, data]);

  async function fetchSummary(selectedMonth) {
    try {
      setLoading(true);
      setErr(null);
      const res = await axios.get(
        `${BASE}/attendance_summary?month=${encodeURIComponent(selectedMonth)}`
      );
     
      const list = res.data?.summary || [];
      setData(list);
      setFiltered(list);
      setPage(1);
    } catch (e) {
      console.error(e);
      setErr(e.response?.data?.error || e.message || "Failed to fetch");
      setData([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  }

  
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  function gotoPage(p) {
    if (p < 1) p = 1;
    if (p > totalPages) p = totalPages;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="pms-page attendance-summary-page">
      <div className="page-header">
        <div>
          <h1>Attendance Summary</h1>
          <p className="subtitle">Monthly overview of presence / absence</p>
        </div>
        <div className="header-controls">
          <label className="label-inline">
            Month
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="input-month"
            />
          </label>

          <div className="search-wrap">
            <input
              type="text"
              placeholder="Search by name or employee no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      <div className="panel">
        {loading ? (
          <div className="loading">Loading attendance summary…</div>
        ) : err ? (
          <div className="error">Error: {err}</div>
        ) : (
          <>
            <div className="table-wrap">
              <table className="summary-table">
                <thead>
                  <tr>
                    <th>Emp. No</th>
                    <th>Name</th>
                    <th>Present Days</th>
                    <th>Absent Days</th>
                    <th>Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty">
                        No records for selected month.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((r) => (
                      <tr key={r.employee_id}>
                        <td>{r.employee_no || "—"}</td>
                        <td>{r.employee_name || "—"}</td>
                        <td>{r.present_days ?? 0}</td>
                        <td>{r.absent_days ?? 0}</td>
                        <td>
                          <div className="percent-cell">
                            <div className="percent-value">
                              {typeof r.attendance_percent === "number"
                                ? r.attendance_percent.toFixed(2) + "%"
                                : "—"}
                            </div>
                            <div className="percent-bar-outer">
                              <div
                                className="percent-bar-inner"
                                style={{
                                  width: `${Math.max(
                                    0,
                                    Math.min(100, r.attendance_percent || 0)
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="pagination-row">
              <div className="pagination-left">
                Showing {filtered.length === 0 ? 0 : (page - 1) * itemsPerPage + 1}{" "}
                to{" "}
                {Math.min(filtered.length, page * itemsPerPage)} of {filtered.length}{" "}
                entries
              </div>

              <div className="pagination-controls">
                <button
                  className="btn page-btn"
                  onClick={() => gotoPage(1)}
                  disabled={page === 1}
                >
                  First
                </button>
                <button
                  className="btn page-btn"
                  onClick={() => gotoPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </button>

                <span className="page-indicator">
                  Page {page} of {totalPages}
                </span>

                <button
                  className="btn page-btn"
                  onClick={() => gotoPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </button>
                <button
                  className="btn page-btn"
                  onClick={() => gotoPage(totalPages)}
                  disabled={page === totalPages}
                >
                  Last
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}



