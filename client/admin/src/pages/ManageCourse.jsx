import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const ManageCourse = () => {
    const navigate = useNavigate();
const API = "http://localhost:4000/api/course";
    const [courses, setCourses] = useState([]);

    const fetchCourses = async () => {
        const res = await fetch(API);
        const data = await res.json();
        if (data.success) setCourses(data.courses);
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // ✅ DELETE
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this course?")) return;

        const res = await fetch(`${API}/${id}`, {
            method: "DELETE",
        });

        const data = await res.json();
        if (data.success) {
            alert("Deleted ✅");
            fetchCourses();
        }
    };

    return (
        <div style={{ padding: "30px" }}>
            <h2>📚 Manage Courses</h2>

            {courses.map((course) => (
                <div
                    key={course._id}
                    style={{
                        border: "1px solid #ccc",
                        padding: "15px",
                        marginBottom: "10px",
                        borderRadius: "8px",
                    }}
                >
                    <h3>{course.name}</h3>
                    <p>{course.teacher}</p>

                    <button onClick={() => handleDelete(course._id)}>
                        ❌ Delete
                    </button>
                    <button onClick={() => navigate(`/admin/edit/${course._id}`)}>
                        ✏️ Edit
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ManageCourse;