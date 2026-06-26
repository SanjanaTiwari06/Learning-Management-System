import React, { useState } from "react";
import AdminNavbar from "../components/Navbar";

const AddCourse = () => {
  const [form, setForm] = useState({
    name: "",
    teacher: "",
    rating: "",
    hours: "",
    minutes: "",
    lectures: "",
    pricingType: "free",
    price: "",
    lectureTitle: "",
    videoUrl: "",
    image: null,
    overview: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // BASIC DATA
      formData.append("name", form.name);
      formData.append("teacher", form.teacher);
      formData.append("pricingType", form.pricingType);

      // PRICE
      formData.append(
        "price",
        JSON.stringify({
          original: Number(form.price) || 0,
          sale: Number(form.price) || 0,
        })
      );

      // LECTURES
      formData.append(
        "lectures",
        JSON.stringify([
          {
            title: form.lectureTitle || "Introduction",
            duration: {
              hours: Number(form.hours) || 0,
              minutes: Number(form.minutes) || 0,
            },
            chapters: [
              {
                name: form.lectureTitle || "Chapter 1",
                topic: form.overview || "Course Overview",
                videoUrl: form.videoUrl || "",
                duration: {
                  hours: Number(form.hours) || 0,
                  minutes: Number(form.minutes) || 0,
                },
              },
            ],
          },
        ])
      );

      // IMAGE
      if (form.image) {
        formData.append("image", form.image);
      }

      // API CALL
      const res = await fetch("https://learning-management-system-hv7g.onrender.com/api/course", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert("Course Added Successfully 🎉");
      } else {
        alert("Error adding course ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error ❌");
    }
  };

  const styles = {
    container: {
      padding: "30px",
      background: "#f5f7fb",
      minHeight: "100vh",
    },
    card: {
      background: "#fff",
      padding: "25px",
      borderRadius: "12px",
      maxWidth: "800px",
      margin: "auto",
      boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "15px",
    },
    input: {
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #ccc",
    },
    textarea: {
      width: "100%",
      marginTop: "15px",
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #ccc",
    },
    uploadBox: {
      border: "2px dashed #ccc",
      padding: "20px",
      marginTop: "15px",
      textAlign: "center",
      borderRadius: "10px",
    },
    button: {
      marginTop: "20px",
      padding: "12px",
      width: "100%",
      background: "#4f46e5",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <AdminNavbar/>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2>📘 Course Information</h2>

        <div style={styles.grid}>
          <input type="text" name="name" placeholder="Course Name" value={form.name} onChange={handleChange} style={styles.input} />

          <input type="text" name="teacher" placeholder="Instructor Name" value={form.teacher} onChange={handleChange} style={styles.input} />

          <input type="number" name="rating" placeholder="Course Rating" value={form.rating} onChange={handleChange} style={styles.input} />

          <input type="number" name="price" placeholder="Course Price" value={form.price} onChange={handleChange} style={styles.input} />

          <div style={{ display: "flex", gap: "10px" }}>
            <input type="number" name="hours" placeholder="Hours" value={form.hours} onChange={handleChange} style={styles.input} />
            <input type="number" name="minutes" placeholder="Minutes" value={form.minutes} onChange={handleChange} style={styles.input} />
          </div>

          <input type="text" name="lectureTitle" placeholder="Lecture Title" value={form.lectureTitle} onChange={handleChange} style={styles.input} />

          <input type="text" name="videoUrl" placeholder="YouTube Video URL" value={form.videoUrl} onChange={handleChange} style={styles.input} />

          <select name="pricingType" value={form.pricingType} onChange={handleChange} style={styles.input}>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <div style={styles.uploadBox}>
          <input type="file" name="image" onChange={handleChange} />
        </div>

        <textarea name="overview" placeholder="Course Overview" value={form.overview} onChange={handleChange} style={styles.textarea} />

        <button type="submit" style={styles.button}>Add Course</button>
      </form>
    </div>
  );
};

export default AddCourse;