import React, { useEffect, useState } from "react";
import "../styles/ProvidentFund.css";

const ProvidentFund = () => {
  const [deductions, setDeductions] = useState([]);
  const [formData, setFormData] = useState({
    salary_advance: "",
    pension: "",
    tax: "",
    national_fund: "",
    provident_fund: "",
    total_deduction: "",
    bank_id: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  useEffect(() => {
    fetch("http://localhost:5000/Deduction")
      .then((res) => res.json())
      .then((data) => {
        setDeductions(data.deduction_records || []);
      })
      .catch((err) => console.error("Error fetching deductions:", err));
  }, []);


  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const updatedForm = { ...formData, [id]: value };

  
    const s = parseFloat(updatedForm.salary_advance || 0);
    const p = parseFloat(updatedForm.pension || 0);
    const t = parseFloat(updatedForm.tax || 0);
    const nf = parseFloat(updatedForm.national_fund || 0);
    const pf = parseFloat(updatedForm.provident_fund || 0);
    updatedForm.total_deduction = (s + p + t + nf + pf).toFixed(2);

    setFormData(updatedForm);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/Deduction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      alert(result.message || "Deduction added successfully");

      // Refresh data
      fetch("http://localhost:5000/Deduction")
        .then((res) => res.json())
        .then((data) => setDeductions(data.deduction_records || []));

      // Reset form
      setFormData({
        salary_advance: "",
        pension: "",
        tax: "",
        national_fund: "",
        provident_fund: "",
        total_deduction: "",
        bank_id: "",
      });
    } catch (error) {
      console.error("Error adding deduction:", error);
      alert("Failed to add deduction");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="deduction-container">
      <h2>Deduction & Provident Fund</h2>

      
      <form onSubmit={handleSubmit} className="deduction-form">
        <div className="form-group">
          <label>Salary Advance:</label>
          <input
            type="number"
            id="salary_advance"
            value={formData.salary_advance}
            onChange={handleInputChange}
            placeholder="Enter salary advance"
          />
        </div>

        <div className="form-group">
          <label>Pension:</label>
          <input
            type="number"
            id="pension"
            value={formData.pension}
            onChange={handleInputChange}
            placeholder="Enter pension amount"
          />
        </div>

        <div className="form-group">
          <label>Tax:</label>
          <input
            type="number"
            id="tax"
            value={formData.tax}
            onChange={handleInputChange}
            placeholder="Enter tax amount"
          />
        </div>

        <div className="form-group">
          <label>National Fund:</label>
          <input
            type="number"
            id="national_fund"
            value={formData.national_fund}
            onChange={handleInputChange}
            placeholder="Enter national fund"
          />
        </div>

        <div className="form-group">
          <label>Provident Fund (EPF):</label>
          <input
            type="number"
            id="provident_fund"
            value={formData.provident_fund}
            onChange={handleInputChange}
            placeholder="Enter provident fund amount"
          />
        </div>

        <div className="form-group">
          <label>Bank ID:</label>
          <input
            type="number"
            id="bank_id"
            value={formData.bank_id}
            onChange={handleInputChange}
            placeholder="Enter Bank ID"
          />
        </div>

        <div className="form-group readonly">
          <label>Total Deduction:</label>
          <input
            type="text"
            id="total_deduction"
            value={formData.total_deduction}
            readOnly
          />
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Add Deduction"}
        </button>
      </form>

      
      <table className="deduction-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Salary Advance</th>
            <th>Pension</th>
            <th>Tax</th>
            <th>National Fund</th>
            <th>Provident Fund</th>
            <th>Total Deduction</th>
            <th>Account Name</th>
            <th>Account No</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {deductions.length > 0 ? (
            deductions.map((item) => (
              <tr key={item.deduction_id}>
                <td>{item.deduction_id}</td>
                <td>{item.salary_advance}</td>
                <td>{item.pension}</td>
                <td>{item.tax}</td>
                <td>{item.national_fund}</td>
                <td className="highlight-pf">
                  {item.provident_fund ? item.provident_fund : "0.00"}
                </td>
                <td>{item.total_deduction}</td>
                <td>{item.AccountName}</td>
                <td>{item.AccountNo}</td>
                <td>{item.phonenumber}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="no-data">
                No deduction records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProvidentFund;