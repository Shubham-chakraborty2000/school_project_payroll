
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChartArea } from "react-icons/fa";
import "../styles/Sidebar.css";

function Sidebar() {
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };


  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/pms_logo.png" alt="PMS Logo" className="logo" />
        <h2 className="title">Payroll Management System</h2>
      </div>

      <ul className="menu">

        <li>
          <Link
            to="/"
            className={`dashboard-link ${isActive("/") ? "active-link" : ""}`}
            onClick={() => setOpenMenu(null)}
          >
            <FaChartArea className="dashboard-icon" />
            <span>Dashboard</span>
          </Link>
        </li>


        <li>
          <button
            className="menu-button"
            onClick={() => toggleMenu("employee")}
          >
            Employee Information
            <span className="arrow">
              {openMenu === "employee" ? "▲" : "▼"}
            </span>
          </button>
          {openMenu === "employee" && (
            <ul className="submenu">
              <li>
                <Link
                  to="/employees"
                  className={isActive("/employees") ? "active-link" : ""}
                >
                  Employee Details
                </Link>
              </li>
              <li>
                <Link
                  to="/employees/add"
                  className={isActive("/employees/add") ? "active-link" : ""}
                >
                  Add Employee
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li>
          <button
            className="menu-button"
            onClick={() => toggleMenu("attendance")}
          >
            Attendance Records
            <span className="arrow">
              {openMenu === "attendance" ? "▲" : "▼"}
            </span>
          </button>
          {openMenu === "attendance" && (
            <ul className="submenu">
              <li>
                <Link
                  to="/attendance/daily"
                  className={isActive("/attendance/daily") ? "active-link" : ""}
                >
                  Daily Attendance
                </Link>
              </li>
              <li>
                <Link
                  to="/attendance/summary"
                  className={
                    isActive("/attendance/summary") ? "active-link" : ""
                  }
                >
                  Attendance Summary
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/attendance/leaves"
                  className={isActive("/attendance/leaves") ? "active-link" : ""}
                >
                  Leave Records
                </Link>
              </li> */}
              {/* <li>
                <Link
                  to="/attendance/report"
                  className={isActive("/attendance/report") ? "active-link" : ""}
                >
                  Attendance Report
                </Link>
              </li> */}
            </ul>
          )}
        </li>


        <li>
          <button
            className="menu-button"
            onClick={() => toggleMenu("grosspay")}
          >
            Gross Pay
            <span className="arrow">
              {openMenu === "grosspay" ? "▲" : "▼"}
            </span>
          </button>
          {openMenu === "grosspay" && (
            <ul className="submenu">
              <li>
                <Link
                  to="/grosspay/basic"
                  className={isActive("/grosspay/basic") ? "active-link" : ""}
                >
                  Basic Salary
                </Link>
              </li>
              <li>
                <Link
                  to="/grosspay/bonus"
                  className={isActive("/grosspay/bonus") ? "active-link" : ""}
                >
                  Bonus
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/grosspay/calculation"
                  className={
                    isActive("/grosspay/calculation") ? "active-link" : ""
                  }
                >
                  Gross Pay Calculations
                </Link>
              </li> */}
            </ul>
          )}
        </li>


        <li>
          <button
            className="menu-button"
            onClick={() => toggleMenu("deduction")}
          >
            Deduction
            <span className="arrow">
              {openMenu === "deduction" ? "▲" : "▼"}
            </span>
          </button>
          {openMenu === "deduction" && (
            <ul className="submenu">
              <li>
                <Link
                  to="/deduction/tax"
                  className={isActive("/deduction/tax") ? "active-link" : ""}
                >
                  All Deduction
                </Link>
              </li>
              <li>
                <Link
                  to="/deduction/pf"
                  className={isActive("/deduction/pf") ? "active-link" : ""}
                >
                  Provident Fund
                </Link>
              </li>
            </ul>
          )}
        </li>


        <li>
          <button
            className="menu-button"
            onClick={() => toggleMenu("allowances")}
          >
            Allowances
            <span className="arrow">
              {openMenu === "allowances" ? "▲" : "▼"}
            </span>
          </button>
          {openMenu === "allowances" && (
            <ul className="submenu">
              <li>
                <Link
                  to="/allowances"
                  className={isActive("/allowances") ? "active-link" : ""}
                >
                  Allowance Types
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/allowances"
                  className={isActive("/allowances") ? "active-link" : ""}
                >
                  Allowances
                </Link>
              </li> */}
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;