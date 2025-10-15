// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../styles/PayHead.css";

// export default function PayHead() {
//   const [payheads, setPayheads] = useState([]);
//   const [q, setQ] = useState("");
//   const [page, setPage] = useState(1);
//   const [perPage] = useState(8);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(false);

//   const [showModal, setShowModal] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [form, setForm] = useState({
//     name: "",
//     type: "Earning",
//     action: "Fixed",
//     percentage: "",
//     description: "",
//     status: "Active"
//   });

//   const BASE = "http://localhost:5000";

//   const fetchPayheads = async (p = page, qstr = q) => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${BASE}/payhead`, {
//         params: { page: p, per_page: perPage, q: qstr }
//       });
//       setPayheads(res.data.payheads || []);
//       setTotal(res.data.total || 0);
//       setPage(res.data.page || p);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPayheads(1, "");
//   }, []);

//   const openAdd = () => {
//     setEditing(null);
//     setForm({
//       name: "",
//       type: "Earning",
//       action: "Fixed",
//       percentage: "",
//       description: "",
//       status: "Active"
//     });
//     setShowModal(true);
//   };

//   const openEdit = (ph) => {
//     setEditing(ph);
//     setForm({
//       name: ph.name || "",
//       type: ph.type || "Earning",
//       action: ph.action || "Fixed",
//       percentage: ph.percentage == null ? "" : String(ph.percentage),
//       description: ph.description || "",
//       status: ph.status || "Active"
//     });
//     setShowModal(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (form.action === "Percentage" && form.percentage !== "") {
//         const num = parseFloat(form.percentage);
//         if (isNaN(num) || num < 0 || num > 100) {
//           alert("Percentage must be a number between 0 and 100");
//           return;
//         }
//       }
//       if (!form.name.trim()) {
//         alert("Name is required");
//         return;
//       }

//       if (editing) {
//         await axios.put(`${BASE}/payhead/${editing.id}`, {
//           ...form,
//           percentage: form.action === "Percentage" ? form.percentage : null
//         });
//         alert("Pay head updated");
//       } else {
//         await axios.post(`${BASE}/payhead`, {
//           ...form,
//           percentage: form.action === "Percentage" ? form.percentage : null
//         });
//         alert("Pay head created");
//       }
//       setShowModal(false);
//       fetchPayheads(1, q);
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.error || "Failed");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this pay head?")) return;
//     try {
//       await axios.delete(`${BASE}/payhead/${id}`);
//       fetchPayheads(1, q);
//     } catch (err) {
//       console.error(err);
//       alert("Delete failed");
//     }
//   };

//   const totalPages = Math.max(1, Math.ceil((total || 0) / perPage));

//   return (
//     <div className="payhead-page">
//       <div className="payhead-header">
//         <div>
//           <h2>Pay Heads</h2>
//           <p className="subtitle">Define earning and deduction components</p>
//         </div>
//         <div className="controls">
//           <input
//             type="text"
//             placeholder="Search by name, type or action"
//             value={q}
//             onChange={(e) => { setQ(e.target.value); }}
//             onKeyDown={(e) => { if (e.key === "Enter") fetchPayheads(1, q); }}
//             className="search-input"
//           />
//           <button className="btn primary" onClick={() => fetchPayheads(1, q)}>Search</button>
//           <button className="btn" onClick={openAdd}>+ Add New</button>
//         </div>
//       </div>

//       <div className="card">
//         <div className="table-wrap">
//           <table className="payhead-table">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Type</th>
//                 <th>Action</th>
//                 <th>% / Value</th>
//                 <th>Description</th>
//                 <th>Status</th>
//                 <th style={{ width: 120 }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr><td colSpan="7" className="center">Loading…</td></tr>
//               ) : payheads.length === 0 ? (
//                 <tr><td colSpan="7" className="center">No pay heads found</td></tr>
//               ) : (
//                 payheads.map((p) => (
//                   <tr key={p.id}>
//                     <td>{p.name}</td>
//                     <td><span className={`badge ${p.type === 'Earning' ? 'earning' : 'deduction'}`}>{p.type}</span></td>
//                     <td>{p.action}</td>
//                     <td>{p.action === 'Percentage' ? `${p.percentage ?? '-'}%` : p.action === 'Fixed' ? '-' : (p.percentage ?? '-') }</td>
//                     <td>{p.description || '-'}</td>
//                     <td>{p.status}</td>
//                     <td>
//                       <button className="icon edit" onClick={() => openEdit(p)}>✏</button>
//                       <button className="icon del" onClick={() => handleDelete(p.id)}>🗑</button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="pager">
//           <div className="pager-info">Showing {Math.min((page-1)*perPage+1, total||0)} to {Math.min(page*perPage, total||0)} of {total||0}</div>
//           <div className="pager-controls">
//             <button className="btn" disabled={page===1} onClick={() => { setPage(1); fetchPayheads(1,q); }}>First</button>
//             <button className="btn" disabled={page===1} onClick={() => { const np = Math.max(1, page-1); setPage(np); fetchPayheads(np,q); }}>Prev</button>
//             <span className="page-ind">Page {page} of {totalPages}</span>
//             <button className="btn" disabled={page===totalPages} onClick={() => { const np = Math.min(totalPages, page+1); setPage(np); fetchPayheads(np,q); }}>Next</button>
//             <button className="btn" disabled={page===totalPages} onClick={() => { setPage(totalPages); fetchPayheads(totalPages,q); }}>Last</button>
//           </div>
//         </div>
//       </div>

//       {showModal && (
//         <div className="ph-modal">
//           <div className="ph-modal-box">
//             <h3>{editing ? 'Edit Pay Head' : 'Add Pay Head'}</h3>

//             <form onSubmit={handleSubmit}>
//               <label>
//                 Name
//                 <input name="name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
//               </label>

//               <div className="row">
//                 <label>
//                   Type
//                   <select name="type" value={form.type} onChange={(e)=> setForm({...form, type: e.target.value})}>
//                     <option value="Earning">Earning</option>
//                     <option value="Deduction">Deduction</option>
//                   </select>
//                 </label>

//                 <label>
//                   Action
//                   <select name="action" value={form.action} onChange={(e)=> setForm({...form, action: e.target.value, percentage: e.target.value==='Percentage' ? form.percentage : ""})}>
//                     <option value="Fixed">Fixed</option>
//                     <option value="Percentage">Percentage</option>
//                     <option value="Formula">Formula</option>
//                   </select>
//                 </label>

//                 <label>
//                   % (if applicable)
//                   <input name="percentage" value={form.percentage} onChange={(e)=> setForm({...form, percentage: e.target.value})} placeholder="e.g. 10" disabled={form.action !== 'Percentage'} />
//                 </label>
//               </div>

//               <label>
//                 Description
//                 <input name="description" value={form.description} onChange={(e)=> setForm({...form, description: e.target.value})} />
//               </label>

//               <label>
//                 Status
//                 <select name="status" value={form.status} onChange={(e)=> setForm({...form, status: e.target.value})}>
//                   <option value="Active">Active</option>
//                   <option value="Inactive">Inactive</option>
//                 </select>
//               </label>

//               <div className="modal-actions">
//                 <button className="btn primary" type="submit">Save</button>
//                 <button className="btn" type="button" onClick={() => setShowModal(false)}>Cancel</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }












import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/PayHead.css";

export default function PayHead() {
  const [payheads, setPayheads] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(8);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    type: "Earning",
    action: "Fixed",
    percentage: "",
    description: "",
    status: "Active",
  });

  const BASE = "http://localhost:5000";


  const fetchPayheads = async (p = page, qstr = q) => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE}/payhead`, {
        params: { page: p, per_page: perPage, q: qstr },
      });
      setPayheads(res.data.payheads || []);
      setTotal(res.data.total || 0);
      setPage(res.data.page || p);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayheads(1, "");
  }, []);

  
  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      type: "Earning",
      action: "Fixed",
      percentage: "",
      description: "",
      status: "Active",
    });
    setShowModal(true);
  };


  const openEdit = (ph) => {
    setEditing(ph);
    setForm({
      name: ph.name || "",
      type: ph.type || "Earning",
      action: ph.action || "Fixed",
      percentage: ph.percentage == null ? "" : String(ph.percentage),
      description: ph.description || "",
      status: ph.status || "Active",
    });
    setShowModal(true);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.action === "Percentage" && form.percentage !== "") {
        const num = parseFloat(form.percentage);
        if (isNaN(num) || num < 0 || num > 100) {
          alert("Percentage must be a number between 0 and 100");
          return;
        }
      }

      if (!form.name.trim()) {
        alert("Name is required");
        return;
      }

      if (editing) {
        await axios.put(`${BASE}/payhead/${editing.id}`, {
          ...form,
          percentage: form.action === "Percentage" ? form.percentage : null,
        });
        alert("✅ Pay head updated successfully");
      } else {
        await axios.post(`${BASE}/payhead`, {
          ...form,
          percentage: form.action === "Percentage" ? form.percentage : null,
        });
        alert("✅ Pay head created successfully");
      }

      setShowModal(false);
      fetchPayheads(1, q);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to save pay head");
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pay head?")) return;
    try {
      await axios.delete(`${BASE}/payhead/${id}`);
      fetchPayheads(1, q);
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const totalPages = Math.max(1, Math.ceil((total || 0) / perPage));

  return (
    <div className="payhead-page">
      <div className="payhead-header">
        <div>
          <h2>Pay Heads</h2>
          <p className="subtitle">Define earning and deduction components</p>
        </div>
        <div className="controls">
          <input
            type="text"
            placeholder="Search by name, type or action"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") fetchPayheads(1, q);
            }}
            className="search-input"
          />
          <button className="btn primary" onClick={() => fetchPayheads(1, q)}>
            Search
          </button>
          <button className="btn" onClick={openAdd}>
            + Add New
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="payhead-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Action</th>
                <th>% / Value</th>
                <th>Description</th>
                <th>Status</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="center">
                    Loading…
                  </td>
                </tr>
              ) : payheads.length === 0 ? (
                <tr>
                  <td colSpan="7" className="center">
                    No pay heads found
                  </td>
                </tr>
              ) : (
                payheads.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>
                      <span
                        className={`badge ${
                          p.type === "Earning" ? "earning" : "deduction"
                        }`}
                      >
                        {p.type}
                      </span>
                    </td>
                    <td>{p.action}</td>
                    <td>
                      {p.action === "Percentage"
                        ? `${p.percentage ?? "-"}%`
                        : "-"}
                    </td>
                    <td>{p.description || "-"}</td>
                    <td>{p.status}</td>
                    <td>
                      <button
                        className="icon edit"
                        onClick={() => openEdit(p)}
                        title="Edit"
                      >
                        ✏
                      </button>
                      <button
                        className="icon del"
                        onClick={() => handleDelete(p.id)}
                        title="Delete"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        
        <div className="pager">
          <div className="pager-info">
            Showing {Math.min((page - 1) * perPage + 1, total || 0)} to{" "}
            {Math.min(page * perPage, total || 0)} of {total || 0}
          </div>
          <div className="pager-controls">
            <button
              className="btn"
              disabled={page === 1}
              onClick={() => {
                setPage(1);
                fetchPayheads(1, q);
              }}
            >
              First
            </button>
            <button
              className="btn"
              disabled={page === 1}
              onClick={() => {
                const np = Math.max(1, page - 1);
                setPage(np);
                fetchPayheads(np, q);
              }}
            >
              Prev
            </button>
            <span className="page-ind">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn"
              disabled={page === totalPages}
              onClick={() => {
                const np = Math.min(totalPages, page + 1);
                setPage(np);
                fetchPayheads(np, q);
              }}
            >
              Next
            </button>
            <button
              className="btn"
              disabled={page === totalPages}
              onClick={() => {
                setPage(totalPages);
                fetchPayheads(totalPages, q);
              }}
            >
              Last
            </button>
          </div>
        </div>
      </div>

    
      {showModal && (
        <div className="ph-modal">
          <div className="ph-modal-box">
            <h3>{editing ? "Edit Pay Head" : "Add Pay Head"}</h3>

            <form onSubmit={handleSubmit}>
              <label>
                Name
                <input
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </label>

              <div className="row">
                <label>
                  Type
                  <select
                    name="type"
                    value={form.type}
                    onChange={(e) =>
                      setForm({ ...form, type: e.target.value })
                    }
                  >
                    <option value="Earning">Earning</option>
                    <option value="Deduction">Deduction</option>
                  </select>
                </label>

                <label>
                  Action
                  <select
                    name="action"
                    value={form.action}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        action: e.target.value,
                        percentage:
                          e.target.value === "Percentage"
                            ? form.percentage
                            : "",
                      })
                    }
                  >
                    <option value="Fixed">Fixed</option>
                    <option value="Percentage">Percentage</option>
                    <option value="Formula">Formula</option>
                  </select>
                </label>

            
                {form.action === "Percentage" && (
                  <label>
                    Percentage (%)
                    <input
                      type="number"
                      name="percentage"
                      value={form.percentage}
                      onChange={(e) =>
                        setForm({ ...form, percentage: e.target.value })
                      }
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="e.g. 10"
                      required
                    />
                  </label>
                )}
              </div>

              <label>
                Description
                <input
                  name="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </label>

              <label>
                Status
                <select
                  name="status"
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>

              <div className="modal-actions">
                <button className="btn primary" type="submit">
                  Save
                </button>
                <button
                  className="btn"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}