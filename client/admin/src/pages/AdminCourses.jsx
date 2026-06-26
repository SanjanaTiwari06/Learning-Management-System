import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/Navbar";

const API = "https://learning-management-system-hv7g.onrender.com/api/course";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setCourses(data.courses || []));
  }, []);

  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    setCourses((prev) => prev.filter((c) => c._id !== id));
  };

  const styles = {
  page: {
    padding: "30px",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e0e7ff, #fce7f3)",
    fontFamily: "sans-serif",
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
    borderRadius: "12px",
    backdropFilter: "blur(10px)",
    background: "rgba(255,255,255,0.6)",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    marginBottom: "30px",
  },

  logo: {
    fontWeight: "bold",
    color: "#4f46e5",
  },

  addBtn: {
    background: "linear-gradient(45deg, #6366f1, #ec4899)",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px",
  },

  card: {
    borderRadius: "15px",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
    background: "rgba(255,255,255,0.7)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
    transition: "0.3s",
  },

  image: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
  },

  content: {
    padding: "15px",
  },

  title: {
    color: "#4f46e5",
  },

  teacher: {
    fontSize: "14px",
    color: "#555",
  },

  sale: {
    color: "#10b981",
    fontWeight: "bold",
  },

  original: {
    textDecoration: "line-through",
    marginLeft: "8px",
    color: "#999",
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
  },

  editBtn: {
    background: "#6366f1",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  deleteBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

  return (
    <div style={styles.page}>
      
      {/* 🌈 NAVBAR */}
      <AdminNavbar/>

      {/* 📦 CARDS */}
      <div style={styles.grid}>
        {courses.map((c) => (
          <div key={c._id} style={styles.card}>
            
            <img
              src={c.image || "https://via.placeholder.com/300"}
              alt={c.name}
              style={styles.image}
            />

            <div style={styles.content}>
              <h3 style={styles.title}>{c.name}</h3>
              <p style={styles.teacher}>👨‍🏫 {c.teacher}</p>

              <div>
                <span style={styles.sale}>
                  ₹{c.price?.sale || "Free"}
                </span>
                {c.price?.original && (
                  <span style={styles.original}>
                    ₹{c.price.original}
                  </span>
                )}
              </div>
            </div>

            {/* ACTIONS */}
            <div style={styles.actions}>
              <button
                style={styles.editBtn}
                onClick={() => navigate(`/admin/edit-course/${c._id}`)}
              >
                Edit
              </button>

              <button
                style={styles.deleteBtn}
                onClick={() => deleteCourse(c._id)}
              >
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCourses;