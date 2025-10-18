import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import "../styles/Dashboard.css";

function Dashboard() {
  const [value, setValue] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [hoverEvent, setHoverEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", event_date: "" });

  const BASE = "http://localhost:5000/api/dashboard";

  useEffect(() => {
    fetchEvents();
    fetchBirthdays();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${BASE}/events`);
      setEvents(res.data.events || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBirthdays = async () => {
    try {
      const res = await axios.get(`${BASE}/birthdays`);
      setBirthdays(res.data.birthdays || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE}/events`, form);
      setShowModal(false);
      setForm({ title: "", description: "", event_date: "" });
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create event");
    }
  };

  const tileContent = ({ date }) => {
    const hasEvent = events.some(
      (ev) => new Date(ev.event_date).toDateString() === date.toDateString()
    );
    return hasEvent ? <div className="event-dot"></div> : null;
  };

  const handleHover = (date) => {
    const evs = events.filter(
      (ev) => new Date(ev.event_date).toDateString() === date.toDateString()
    );
    setHoverEvent(evs.length > 0 ? evs : null);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <h2><i className="fa-solid fa-chart-line"></i> Dashboard Overview</h2>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Add Event
        </button>
      </div>

      <div className="dashboard-layout">
        <div className="dashboard-left">
          <div className="dashboard-card calendar-card">
            <Calendar
              onChange={setValue}
              value={value}
              tileContent={tileContent}
              calendarType="gregory"
              onMouseOver={(e) => {
                const tile = e.target.closest(".react-calendar__tile");
                if (tile && tile.getAttribute("aria-label")) {
                  handleHover(new Date(tile.getAttribute("aria-label")));
                }
              }}
            />
            {hoverEvent && (
              <div className="event-hover">
                <h4>🎉 {hoverEvent.length} Event(s)</h4>
                <ul>
                  {hoverEvent.map((ev) => (
                    <li key={ev.id}>
                      <strong>{ev.title}</strong>
                      <p>{ev.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-right">
          <div className="dashboard-card">
            <h3>🎂 Today's Birthdays</h3>
            <div className="scroll-panel">
              {birthdays.length > 0 ? (
                <ul>
                  {birthdays.map((b) => (
                    <li key={b.id}>
                      <span className="name">{b.name}</span>
                      <span className="dob">
                        ({new Date(b.date_of_birth).toLocaleDateString()})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No birthdays today</p>
              )}
            </div>
          </div>

          <div className="dashboard-card">
            <h3>📣 Upcoming Events</h3>
            <div className="scroll-panel">
              {events.length > 0 ? (
                <ul>
                  {events.map((ev) => (
                    <li key={ev.id}>
                      <strong>{ev.title}</strong> <br />
                      <span className="event-date">{ev.event_date}</span>
                      <p>{ev.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No upcoming events</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Add New Event</h3>
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              ></textarea>
              <label>Event Date</label>
              <input
                type="date"
                value={form.event_date}
                onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                required
              />
              <div className="modal-actions">
                <button type="submit" className="btn-save">Save</button>
                <button
                  type="button"
                  className="btn-cancel"
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

export default Dashboard;