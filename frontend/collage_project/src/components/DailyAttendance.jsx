// import React from "react";
// import "../styles/ViewTable.css";

// export default function ViewTable({ title, data }) {
//   if (!Array.isArray(data) || data.length === 0) {
//     return (
//       <div className="view-card">
//         <h3>{title}</h3>
//         <div className="empty">No data</div>
//       </div>
//     );
//   }

//   const headers = Object.keys(data[0]);

//   return (
//     <div className="view-card">
//       <h3>{title}</h3>
//       <div className="table-wrap">
//         <table className="view-table">
//           <thead>
//             <tr>
//               {headers.map((h) => (
//                 <th key={h}>{h}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((r, i) => (
//               <tr key={i}>
//                 {headers.map((h) => (
//                   <td key={h}>{String(r[h] ?? "")}</td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }





import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/DailyAttendance.css";

function DailyAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [search,setSearch]=useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    fetchAttendanceStatus(date);
  }, [date]);

  const fetchAttendanceStatus = async (selectedDate) => {
    try {
      const res = await axios.get(`${BASE_URL}/attendance_status?date=${selectedDate}`);
      setAttendanceData(res.data.attendance_status || []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  const filteredData = attendanceData.filter(
    (item) =>
      item.employee_name.toLowerCase().includes(search.toLowerCase()) ||
      item.employee_no.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="daily-attendance-container">
      <h2>📅 Daily Attendance</h2>

      <div className="toolbar">
        <div className="date-filter">
          <label>Select Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search by name or employee no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <table className="attendance-table">
        <thead>
          <tr>
            <th>Emp No</th>
            <th>Name</th>
            <th>Department ID</th>
            <th>Status</th>
            <th>Log Type</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, idx) => {
              const timePart = item.datetime_log
                ? new Date(item.datetime_log).toLocaleTimeString()
                : "—";

              return (
                <tr key={idx}>
                  <td>{item.employee_no}</td>
                  <td>{item.employee_name}</td>
                  <td>{item.department_id}</td>
                  <td
                    className={`status ${
                      item.status === "Present" ? "present" : "absent"
                    }`}
                  >
                    {item.status}
                  </td>
                  <td>{item.log_type || "—"}</td>
                  <td>{timePart}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No attendance data found for this date.
              </td>
            </tr>
          )}
        </tbody>
      </table>

    
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ⬅ Prev
        </button>
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}

export default DailyAttendance;