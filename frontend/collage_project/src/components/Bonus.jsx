// import React, { useEffect, useState } from "react";
// import api from "../api";
// import ViewTable from "./ViewTable";

// export default function ViewMarks() {
//   const [data, setData] = useState([]);
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await api.get("/get_add_marks");
//         setData(res.data?.add_marks);
//       } catch (e) {
//         console.warn(e);
//       }
//     })();
//   }, []);
//   return <ViewTable title="Marks" data={data} />;
// }




import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Bonus.css';

function Bonus() {
  const [bonuses, setBonuses] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchBonuses();
  }, []);

  const fetchBonuses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/bonus');
      setBonuses(response.data.bonuses || []);
    } catch (error) {
      console.error('Error fetching bonuses:', error);
    }
  };

  const filtered = bonuses.filter(b =>
    b.firstname.toLowerCase().includes(search.toLowerCase()) ||
    b.lastname.toLowerCase().includes(search.toLowerCase()) ||
    b.employee_no.toLowerCase().includes(search.toLowerCase()) ||
    b.bonus_type.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bonus?')) return;
    try {
      await axios.delete(`http://localhost:5000/bonus/${id}`);
      fetchBonuses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/bonus/${modalData.id}`, modalData);
      } else {
        await axios.post('http://localhost:5000/bonus', modalData);
      }
      fetchBonuses();
      setShowModal(false);
      setModalData(null);
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (data = null) => {
    setModalData(
      data || { employee_id: '', bonus_type: '', amount: '', bonus_date: '', description: '' }
    );
    setIsEditing(!!data);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  return (
    <div className="bonus-container">
      <h2>Bonus Management</h2>

      <div className="bonus-toolbar">
        <button className="add-btn" onClick={() => openModal()}>+ Add Bonus</button>
        <input
          type="text"
          placeholder="Search by name, ID, or type"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="bonus-table">
        <thead>
          <tr>
            <th>Employee No</th>
            <th>Name</th>
            <th>Bonus Type</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((b) => (
            <tr key={b.id}>
              <td>{b.employee_no}</td>
              <td>{b.firstname} {b.lastname}</td>
              <td>{b.bonus_type}</td>
              <td>₹{b.amount}</td>
              <td>{b.bonus_date}</td>
              <td>{b.description || '-'}</td>
              <td>
                <button className="edit-btn" onClick={() => openModal(b)}>✏️</button>
                <button className="delete-btn" onClick={() => handleDelete(b.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? 'active' : ''}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{isEditing ? 'Edit Bonus' : 'Add New Bonus'}</h3>
            <form onSubmit={handleAddOrEdit}>
              {!isEditing && (
                <input
                  type="number"
                  placeholder="Employee ID"
                  value={modalData.employee_id}
                  onChange={(e) => setModalData({ ...modalData, employee_id: e.target.value })}
                  required
                />
              )}
              <input
                type="text"
                placeholder="Bonus Type (Festival, Performance...)"
                value={modalData.bonus_type}
                onChange={(e) => setModalData({ ...modalData, bonus_type: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Amount"
                value={modalData.amount}
                onChange={(e) => setModalData({ ...modalData, amount: e.target.value })}
                required
              />
              <input
                type="date"
                placeholder="Bonus Date"
                value={modalData.bonus_date}
                onChange={(e) => setModalData({ ...modalData, bonus_date: e.target.value })}
              />
              <textarea
                placeholder="Description"
                value={modalData.description}
                onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
              ></textarea>

              <div className="modal-actions">
                <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bonus;