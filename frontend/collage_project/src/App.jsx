// import React, { useState } from "react";
// import Sidebar from "./components/Sidebar";
// // import AddClass from "./components/AddClass";
// import AddStudent from "./components/AddStudent";
// import AddSubject from "./components/AddSubject";
// import AddMarks from "./components/AddMarks";
// import ViewClasses from "./components/ViewClasses";
// import ViewStudents from "./components/ViewStudents";
// import ViewSubjects from "./components/ViewSubjects";
// import ViewMarks from "./components/ViewMarks";

// export default function App() {
//   const [page, setPage] = useState("Add Student"); // default page

//   const renderContent = () => {
//     switch (page) {
//       case "Add Class":
//         return <AddClass />;
//       case "Add Student":
//         return <AddStudent />;
//       case "Add Subject":
//         return <AddSubject />;
//       case "Add Marks":
//         return <AddMarks />;
//       case "View Classes":
//         return <ViewClasses />;
//       case "View Students":
//         return <ViewStudents />;
//       case "View Subjects":
//         return <ViewSubjects />;
//       case "View Marks":
//         return <ViewMarks />;
//       default:
//         return <div style={{ padding: 20 }}>Select a menu</div>;
//     }
//   };

//   return (
//     <div style={{ display: "flex", minHeight: "100vh", background: "#f3f6fb" }}>
//       <Sidebar onSelect={setPage} selected={page} />
//       <div style={{ flex: 1, padding: 24 }}>
//         <h1 style={{ marginBottom: 18 }}>
//           Netaji Subhash Engineering College — Admin
//         </h1>
//         {renderContent()}
//       </div>
//     </div>
//   );
// }



import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import EmployeeDetails from './components/EmployeeDetails';
import AddEmployee from './components/AddEmployee';
import DailyAttendance from './components/DailyAttendance';
import AttendanceSummary from './components/AttendanceSummary';
// import LeaveRecords from './components/LeaveRecords';
// import AttendanceReport from './components/AttendanceSummary';
import BasicSalary from './components/BasicSalary';
import Bonus from './components/Bonus';
// import GrossPayCalculation from './components/GrossPayCalculation';
import AllDeduction from './components/AllDeduction';
import ProvidentFund from './components/ProvidentFund';
// import AllowanceTypes from './components/AllowanceTypes';
import Allowances from './components/Allowances';
import "./App.css";

function App() {

  const [user, setUser] = useState('Shubham'); 
  const handleLogout = () => {
    
    setUser('');
  };

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Topbar user={user} onLogout={handleLogout} />
          <div className="page-content">
            <Routes>
             
              <Route path="/" element={<Navigate to="/employees" />} />
              <Route path="/employees" element={<EmployeeDetails />} />
              <Route path="/employees/add" element={<AddEmployee />} />

            
              <Route path="/attendance/daily" element={<DailyAttendance />} />
              <Route path="/attendance/summary" element={<AttendanceSummary />} />
              {/* <Route path="/attendance/leaves" element={<LeaveRecords />} /> */}
              {/* <Route path="/attendance/report" element={<AttendanceReport />} /> */}

            
              <Route path="/grosspay/basic" element={<BasicSalary />} />
              <Route path="/grosspay/bonus" element={<Bonus />} />
              {/* <Route path="/grosspay/calculation" element={<GrossPayCalculation />} /> */}

             
              <Route path="/deduction/tax" element={<AllDeduction />} />
              <Route path="/deduction/pf" element={<ProvidentFund />} />

              
              {/* <Route path="/allowances/types" element={<AllowanceTypes />} /> */}
              <Route path="/allowances" element={<Allowances />} />

             
              <Route path="*" element={<Navigate to="/employees" />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );               



}

export default App;








// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Sidebar from "./components/Sidebar";
// import Topbar from "./components/Topbar";

// import EmployeeDetails from "./components/EmployeeDetails";
// import AddEmployee from "./components/AddEmployee";
// import DailyAttendance from "./components/DailyAttendance";
// import AttendanceSummary from "./components/AttendanceSummary";
// import BasicSalary from "./components/BasicSalary";
// import Bonus from "./components/Bonus";
// import AllDeduction from "./components/AllDeduction";
// import Allowances from "./components/Allowances";
// import ProvidentFund from "./components/ProvidentFund";

// import "./App.css";

// function App() {
//   const handleLogout = () => {
//     alert("Logged out successfully!");
    
//   };

//   return (
//     <Router>
//       <div className="app-container">
//         <aside className="sidebar">
//           <Sidebar />
//         </aside>

//         <div className="main-content">
//           <header className="topbar">
//             <Topbar user="Shubham" onLogout={handleLogout} />
//           </header>

//           <main className="page-content">
//             <Routes>
//               <Route path="/employees" element={<EmployeeDetails />} />
//               <Route path="/employees/add" element={<AddEmployee />} />
//               <Route path="/attendance/daily" element={<DailyAttendance />} />
//               <Route path="/attendance/summary" element={<AttendanceSummary />} />
//               <Route path="/grosspay/basic" element={<BasicSalary />} />
//               <Route path="/bonus" element={<Bonus />} />
//               <Route path="/deduction" element={<AllDeduction />} />
//               <Route path="/allowances" element={<Allowances />} />
//               <Route path="/deduction/provident-fund" element={<ProvidentFund />} />
//             </Routes>
//           </main>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;