// import React, { useEffect, useState } from "react";

// function ViewSubjects() {
//   const [subjects, setSubjects] = useState([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/get_subjects");
//         const data = await response.json();
//         if (data.error) {
//           setError(data.error);
//         } else {
//           setSubjects(data.subjects);
//         }
//       } catch (err) {
//         setError("❌ Failed to fetch subjects: " + err.message);
//       }
//     };

//     fetchSubjects();
//   }, []);

//   return (
//     <div>
//       <h2>Subjects List</h2>
//       {error && <p>{error}</p>}
//       <ul>
//         {subjects.map((sub) => (
//           <li key={sub.subject_id}>
//             {sub.subject_id} - {sub.subject_name}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default ViewSubjects;





import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AllDeduction.css";

const AllDeduction   = () => {
  const [deductions, setDeductions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    bank_id: "",
    salary_advance: "",
    pension: "",
    tax: "",
    national_fund: "",
    total_deduction: ""
  });

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

 
  const fetchDeductions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/Deduction");
      setDeductions(res.data.deduction_records || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDeductions();
  }, []);

  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const updatedForm = { ...formData, [id]: value };

    const salary = parseFloat(updatedForm.salary_advance || 0);
    const pension = parseFloat(updatedForm.pension || 0);
    const tax = parseFloat(updatedForm.tax || 0);
    const nf = parseFloat(updatedForm.national_fund || 0);

    updatedForm.total_deduction = (salary + pension + tax + nf).toFixed(2);
    setFormData(updatedForm);
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/Deduction", formData);
      alert("Deduction added successfully!");
      setShowModal(false);
      fetchDeductions();
      setFormData({
        bank_id: "",
        salary_advance: "",
        pension: "",
        tax: "",
        national_fund: "",
        total_deduction: ""
      });
    } catch (error) {
      console.error("Error adding deduction:", error);
      alert("Failed to add deduction");
    }
  };

 
  const filteredData = deductions.filter(
    (item) =>
      item.AccountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.AccountNo.toString().includes(searchTerm)
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  return (
    <div className="deduction-container">
      <h2>Deduction Management</h2>

      <div className="deduction-top">
        <input
          type="text"
          placeholder="Search by Account Name or Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => setShowModal(true)}>+ Add Deduction</button>
      </div>

      <table className="deduction-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Account Name</th>
            <th>Account No</th>
            <th>Salary Advance</th>
            <th>Pension</th>
            <th>Tax</th>
            <th>National Fund</th>
            <th>Total Deduction</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.length > 0 ? (
            currentRecords.map((item) => (
              <tr key={item.deduction_id}>
                <td>{item.deduction_id}</td>
                <td>{item.AccountName}</td>
                <td>{item.AccountNo}</td>
                <td>{item.salary_advance.toFixed(2)}</td>
                <td>{item.pension.toFixed(2)}</td>
                <td className="highlight-tax">{item.tax.toFixed(2)}</td>
                <td>{item.national_fund.toFixed(2)}</td>
                <td className="total-col">{item.total_deduction.toFixed(2)}</td>
                <td>{item.phonenumber}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No deduction records found</td>
            </tr>
          )}
        </tbody>
      </table>

     
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          Prev
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
          Next
        </button>
      </div>

     
      {showModal && (
        <div className="deduction-modal">
          <div className="deduction-modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h3>Add Deduction</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="number"
                id="bank_id"
                value={formData.bank_id}
                onChange={handleInputChange}
                placeholder="Bank ID"
                required
              />
              <input
                type="number"
                id="salary_advance"
                value={formData.salary_advance}
                onChange={handleInputChange}
                placeholder="Salary Advance"
                required
              />
              <input
                type="number"
                id="pension"
                value={formData.pension}
                onChange={handleInputChange}
                placeholder="Pension"
                required
              />
              <input
                type="number"
                id="tax"
                value={formData.tax}
                onChange={handleInputChange}
                placeholder="Tax (Income Tax Cut)"
                required
              />
              <input
                type="number"
                id="national_fund"
                value={formData.national_fund}
                onChange={handleInputChange}
                placeholder="National Fund"
                required
              />
              <input
                type="number"
                id="total_deduction"
                value={formData.total_deduction}
                placeholder="Total Deduction"
                readOnly
              />
              <button type="submit">Save Deduction</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllDeduction