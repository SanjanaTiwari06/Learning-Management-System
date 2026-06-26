import React from "react";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const styles = {
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

  actions: {
    display: "flex",
    gap: "10px",
  },

  addBtn: {
    background: "linear-gradient(45deg, #6366f1, #ec4899)",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  logoutBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

  return (
    <div style={styles.navbar}>
      <h2 style={styles.logo}>✨ Admin Panel</h2>

      <div style={styles.actions}>
        <button
          style={styles.addBtn}
          onClick={() => navigate("/admin/add-course")}
        >
          ➕ Add Course
        </button>

        <button style={styles.logoutBtn}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;