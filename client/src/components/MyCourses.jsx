import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { User, PlayCircle } from "lucide-react";
import { myCoursesStyles, myCoursesCustomStyles } from "../assets/dummyStyles";
import { toast, ToastContainer, Slide } from "react-toastify";

const API_BASE = "https://learning-management-system-hv7g.onrender.com/";

function MyCourses() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [courseImages, setCourseImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Show feedback if we just came back from Stripe (?payment_status=Paid|Unpaid)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("payment_status");
    if (!status) return;

    if (status === "Paid") {
      toast.success("Payment successful! Your course is now unlocked.", {
        position: "top-right",
        transition: Slide,
        autoClose: 4000,
        theme: "dark",
      });
    } else if (status === "Unpaid") {
      toast.error("Payment was not completed. Please try enrolling again.", {
        position: "top-right",
        transition: Slide,
        autoClose: 4000,
        theme: "dark",
      });
    }

    // clean the query string so the toast doesn't fire again on refresh
    window.history.replaceState({}, "", window.location.pathname);
  }, []);

  const fetchMyCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      let headers = { "Content-Type": "application/json" };
      let opts = { method: "GET", headers, credentials: "include" };

      if (getToken) {
        try {
          const token = await getToken().catch(() => null);
          if (token) {
            headers.Authorization = `Bearer ${token}`;
            opts = { method: "GET", headers };
          }
        } catch (e) {
          // keep credentials fallback
        }
      }

      const res = await fetch(`${API_BASE}/api/booking/my`, opts);
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load your courses");
      }

      const myBookings = data.bookings || [];
      setBookings(myBookings);

      // Best-effort: fetch each course's thumbnail in the background
      myBookings.forEach((b) => {
        if (!b.course) return;
        fetch(`${API_BASE}/api/course/${b.course}`)
          .then((r) => r.json())
          .then((cData) => {
            if (cData?.success && cData.course?.image) {
              setCourseImages((prev) => ({ ...prev, [b.course]: cData.course.image }));
            }
          })
          .catch(() => {});
      });
    } catch (err) {
      console.error("fetchMyCourses error:", err);
      setError(err.message || "Failed to load your courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSignedIn === false) {
      setLoading(false);
      setBookings([]);
      return;
    }
    if (isSignedIn === true) {
      fetchMyCourses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  const handleOpenCourse = (courseId) => {
    if (!courseId) return;
    navigate(`/course/${courseId}`);
  };

  return (
    <div className={myCoursesStyles.pageContainer}>
      <div className={myCoursesStyles.mainContainer}>
        {!isSignedIn ? (
          <div className="text-center py-20">
            <h2 className={myCoursesStyles.emptyHeader}>My Courses</h2>
            <p className={myCoursesStyles.emptyText}>
              Please log in to view your enrolled courses.
            </p>
          </div>
        ) : loading ? (
          <div className="text-center py-20">
            <p className={myCoursesStyles.emptyText}>Loading your courses...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <h2 className={myCoursesStyles.emptyHeader}>No enrolled courses yet</h2>
            <p className={myCoursesStyles.emptyText}>
              Once you enroll in a course, it will show up here.
            </p>
          </div>
        ) : (
          <>
            <h1 className={myCoursesStyles.header}>My Courses</h1>
            <div className={myCoursesStyles.grid}>
              {bookings.map((b) => (
                <div
                  key={b.bookingId || b._id}
                  className={myCoursesStyles.courseCard}
                  onClick={() => handleOpenCourse(b.course)}
                >
                  <div className={myCoursesStyles.imageContainer}>
                    <img
                      src={
                        courseImages[b.course] ||
                        "https://via.placeholder.com/300x200?text=Course"
                      }
                      alt={b.courseName}
                      className={myCoursesStyles.courseImage}
                    />
                  </div>
                  <div className={myCoursesStyles.courseContent}>
                    <h3 className={myCoursesStyles.courseName}>{b.courseName}</h3>
                    <div className={myCoursesStyles.infoContainer}>
                      {b.teacherName && (
                        <div className={myCoursesStyles.teacherContainer}>
                          <User className={myCoursesStyles.teacherIcon} />
                          <span className={myCoursesStyles.teacherText}>
                            {b.teacherName}
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      className={myCoursesStyles.viewButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCourse(b.course);
                      }}
                    >
                      <PlayCircle className={myCoursesStyles.buttonIcon} />
                      <span>Start Learning</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        theme="dark"
        transition={Slide}
      />
      <style>{myCoursesCustomStyles}</style>
    </div>
  );
}

export default MyCourses;
