import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = "https://learning-management-system-hv7g.onrender.com/api/course";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    teacher: "",
    duration: "",
    image: "",
    description: "",
    price: {
      original: "",
      sale: "",
    },
  });

  // GET DATA
  useEffect(() => {
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const c = data.course;
          setForm({
            name: c.name || "",
            teacher: c.teacher || "",
            duration: c.duration || "",
            image: c.image || "",
            description: c.description || "",
            price: {
              original: c.price?.original || "",
              sale: c.price?.sale || "",
            },
          });
        }
      });
  }, [id]);

  // HANDLE CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePriceChange = (e) => {
    setForm({
      ...form,
      price: { ...form.price, [e.target.name]: e.target.value },
    });
  };

  const styles = {
  container: {
    padding: "30px",
    maxWidth: "500px",
    margin: "auto",
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
  },

  input: {
    padding: "10px",
    margin: "8px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  textarea: {
    padding: "10px",
    margin: "8px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
    minHeight: "80px",
  },

  priceRow: {
    display: "flex",
    gap: "10px",
  },

  btn: {
    marginTop: "10px",
    padding: "10px",
    background: "linear-gradient(45deg, #6366f1, #ec4899)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  preview: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "10px",
  },
};

  // UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      alert("Updated ✅");
      navigate("/admin/courses");
    }
  };

  return (
    <div style={styles.container}>
      <h2>✏️ Edit Course</h2>

      <form onSubmit={handleUpdate} style={styles.form}>
        
        {/* IMAGE PREVIEW */}
        {form.image && (
          <img src={form.image} alt="preview" style={styles.preview} />
        )}

        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          style={styles.input}
        />

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Course Name"
          style={styles.input}
        />

        <input
          name="teacher"
          value={form.teacher}
          onChange={handleChange}
          placeholder="Teacher"
          style={styles.input}
        />

        <input
          name="duration"
          value={form.duration}
          onChange={handleChange}
          placeholder="Duration (e.g. 10h)"
          style={styles.input}
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          style={styles.textarea}
        />

        {/* PRICE */}
        <div style={styles.priceRow}>
          <input
            name="original"
            value={form.price.original}
            onChange={handlePriceChange}
            placeholder="Original Price"
            style={styles.input}
          />

          <input
            name="sale"
            value={form.price.sale}
            onChange={handlePriceChange}
            placeholder="Sale Price"
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.btn}>
          Update Course 🚀
        </button>
      </form>
    </div>
  );
};

export default EditCourse;