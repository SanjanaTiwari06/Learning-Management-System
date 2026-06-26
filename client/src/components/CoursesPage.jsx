/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */
// /* eslint-disable no-empty */

// import React, { useState, useEffect } from "react";
// import { homeCoursesStyles } from "../assets/dummyStyles";
// import { coursesData } from "../assets/dummyHdata";
// import { useNavigate } from "react-router-dom";
// import { ArrowRight, Star, User } from "lucide-react";
// import { Slide, toast, ToastContainer } from "react-toastify";

// const HomeCourses = () => {
//   const navigate = useNavigate();

//   const [searchTerm, setSearchTerm] = useState("");

//   const [userRatings, setUserRatings] = useState(() => {
//     try {
//       const raw = localStorage.getItem("userCourseRatings");
//       return raw ? JSON.parse(raw) : {};
//     } catch {
//       return {};
//     }
//   });

//   const [hoverRatings, setHoverRatings] = useState({});

//   useEffect(() => {
//     try {
//       localStorage.setItem("userCourseRatings", JSON.stringify(userRatings));
//     } catch {}
//   }, [userRatings]);

//   const showLoginToast = () => {
//     toast.error("Please login to access this course", {
//       position: "top-right",
//       transition: Slide,
//       autoClose: 3000,
//       theme: "dark",
//     });
//   };

// //   const handleBrowseClick = () => {
// //     const token = localStorage.getItem("token");
// //     if (!token) {
// //       showLoginToast();
// //       return;
// //     }
// //     navigate("/courses");
// //   };

//   const handleSetRating = (e, courseId, rating) => {
//     e.stopPropagation();
//     setUserRatings((prev) => ({ ...prev, [courseId]: rating }));
//   };

//   const handleCourseClick = (id) => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       showLoginToast();
//       return;
//     }
//     navigate(`/courses/${id}`);
//   };

//   const renderInteractiveStars = (course) => {
//     const userRating = userRatings[course.id] || 0;
//     const hover = hoverRatings[course.id] || 0;
//     const displayRating = hover || userRating;

//     return (
//       <div className={homeCoursesStyles.starsContainer}>
//         <div
//           className={homeCoursesStyles.interactiveStars}
//           onClick={(e) => e.stopPropagation()}
//         >
//           {Array.from({ length: 5 }).map((_, i) => {
//             const idx = i + 1;
//             const filled = idx <= displayRating;

//             return (
//               <button
//                 key={i}
//                 onClick={(e) => handleSetRating(e, course.id, idx)}
//                 onMouseEnter={() =>
//                   setHoverRatings((s) => ({ ...s, [course.id]: idx }))
//                 }
//                 onMouseLeave={() =>
//                   setHoverRatings((s) => ({ ...s, [course.id]: 0 }))
//                 }
//                 className={`${homeCoursesStyles.starButton} ${
//                   filled
//                     ? homeCoursesStyles.starButtonActive
//                     : homeCoursesStyles.starButtonInactive
//                 }`}
//                 style={{ background: "transparent" }}
//               >
//                 <Star
//                   size={16}
//                   fill={filled ? "currentColor" : "none"}
//                   stroke="currentColor"
//                   className={homeCoursesStyles.starIcon}
//                 />
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   const { title, course: courseFont, detail } = homeCoursesStyles.fonts;

//   const visibleCourses = coursesData
//     .filter((course) =>
//       course.name.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     .slice(0, 8);

//   return (
//     <div className={homeCoursesStyles.container}>
//       <div className={homeCoursesStyles.mainContainer}>
//         <div className={homeCoursesStyles.header}>
//           <h2 className={`${title} ${homeCoursesStyles.title}`}>
//             <Star className={homeCoursesStyles.titleIcon} />
//             Explore Top Courses
//             <Star className={homeCoursesStyles.titleIcon} />
//           </h2>
//         </div>

//         {/* 🔍 Search Bar */}
//         <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
//           <input
//             type="text"
//             placeholder="Search courses..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={{
//               width: "320px",
//               padding: "10px 15px",
//               borderRadius: "8px",
//               border: "1px solid #444",
//               background: "#111",
//               color: "#fff",
//               outline: "none",
//               fontSize: "14px",
//             }}
//           />
//         </div>

//         <div className={homeCoursesStyles.coursesGrid}>
//           {visibleCourses.length === 0 ? (
//             <div
//               style={{
//                 gridColumn: "1 / -1",
//                 textAlign: "center",
//                 padding: "60px 20px",
//                 color: "#aaa",
//               }}
//             >
//               <div style={{ fontSize: "60px", marginBottom: "10px" }}>😕</div>
//               <h3 style={{ fontWeight: "500" }}>No Results Found</h3>
//               <p style={{ fontSize: "14px", opacity: 0.7 }}>
//                 Try searching with different keywords
//               </p>
//             </div>
//           ) : (
//             visibleCourses.map((course) => {
//               const isFree = !!course.isFree || !course.price;

//               return (
//                 <div
//                   key={course.id}
//                   onClick={() => handleCourseClick(course.id)}
//                   className={homeCoursesStyles.courseCard}
//                 >
//                   <div className={homeCoursesStyles.imageContainer}>
//                     <img
//                       src={course.image}
//                       alt={course.name}
//                       className={homeCoursesStyles.courseImage}
//                       loading="lazy"
//                     />
//                   </div>

//                   <div className={homeCoursesStyles.courseInfo}>
//                     <h3 className={`${courseFont} ${homeCoursesStyles.courseName}`}>
//                       {course.name}
//                     </h3>

//                     <div className={`${detail} ${homeCoursesStyles.teacherInfo}`}>
//                       <User className={homeCoursesStyles.teacherIcon} size={15} />
//                       <span className={homeCoursesStyles.teacherName}>
//                         {course.teacher}
//                       </span>
//                     </div>

//                     <div className={homeCoursesStyles.ratingContainer}>
//                       {renderInteractiveStars(course)}
//                     </div>

//                     <div className={homeCoursesStyles.pricingContainer}>
//                       {isFree ? (
//                         <span className={homeCoursesStyles.freePrice}>Free</span>
//                       ) : (
//                         <>
//                           <span className={homeCoursesStyles.salePrice}>
//                             &#8377;{course.price?.sale ?? "-"}
//                           </span>
//                           {course.price?.original && (
//                             <span className={homeCoursesStyles.originalPrice}>
//                               ₹{course.price.original}
//                             </span>
//                           )}
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>

//         <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
//           <div className={homeCoursesStyles.ctaWrapper}>
//             <span
//               className={homeCoursesStyles.ctaGlow}
//               style={{
//                 zIndex: 0,
//                 background:
//                   "conic-gradient(from 0deg, rgba(236,72,153,0.9), rgba(99,102,241,0.9), rgba(139,92,246,0.9), rgba(236,72,153,0.9))",
//                 filter: "blur(5px)",
//                 opacity: 0.8,
//               }}
//             />
//             {/* <button
//               onClick={handleBrowseClick}
//               className={homeCoursesStyles.ctaButton}
//               style={{
//                 background:
//                   "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
//               }}
//             >
//               <span className={homeCoursesStyles.ctaButtonContent}>
//                 <span className={homeCoursesStyles.ctaText}>Discover Courses</span>
//                 <ArrowRight className={homeCoursesStyles.ctaIcon} />
//               </span>
//             </button> */}
//           </div>
//         </div>
//       </div>

//       <ToastContainer position="top-right" autoClose={3000} theme="dark" transition={Slide} />
//       <style jsx>{homeCoursesStyles.animations}</style>
//     </div>
//   );
// };

// export default HomeCourses;


import React, { useState, useEffect } from "react";
import { homeCoursesStyles } from "../assets/dummyStyles";
import { coursesData } from "../assets/dummyHdata";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star, User } from "lucide-react";
import { Slide, toast, ToastContainer } from "react-toastify";
import { useUser, useAuth } from "@clerk/clerk-react";

const API_BASE = "http://localhost:4000"

const HomeCourses = () => {


  const navigate = useNavigate();
  const { title, course: coursefont, detail } = homeCoursesStyles.fonts;
  const [courses, setCourses] = useState([]);


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clerk Authentication
  const { isSignedIn, user } = useUser(); // user is null if not signed in.
  const { getToken } = useAuth();

  const [userRatings, setUserRatings] = useState(() => {
    try {
      const raw = localStorage.getItem("userCourseRatings");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [hoverRatings, setHoverRatings] = useState({});

  useEffect(() => {
    try {
      localStorage.setItem("userCourseRatings", JSON.stringify(userRatings));
    } catch { }
  }, [userRatings]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/api/course`).then(
      async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch courses from server");
        }
        return res.json();
      }
    )


      .then((json) => {
        if (!mounted) return;
        const items = (json && (json.items || json.courses || [])) || [];
        const mapped = items.map((c) => ({
          id: c._id || c.id,
          name: c.name,
          teacher: c.teacher,
          image: c.image,
          price: c.price || {
            original: c.price?.original,
            sale: c.price?.sale,
          },
          isFree:
            c.pricingType === "free" ||
            !c.price ||
            (c.price && !c.price.sale && !c.price.original),
          // prefer avgRating / totalRatings from backend if available
          avgRating:
            typeof c.avgRating !== "undefined" ? c.avgRating : c.rating || 0,
          totalRatings:
            typeof c.totalRatings !== "undefined"
              ? c.totalRatings
              : c.ratingCount || 0,
          courseType: c.courseType || "regular",
        }));
        setCourses(mapped)
      }).catch((err) => {
        console.error("failed to fetch courses", err)
        if (mounted) setError("Failed to load server")
      }).finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const submitRatingToServer = async (courseId, ratingValue) => {
    try {
      const headers = { "Content-Type": "application/json" };
      // try to get Clerk JWT token if available (works with Clerk)
      try {
        if (getToken) {
          const token = await getToken().catch(() => null);
          if (token) headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
      
      }

      const res = await fetch(`${API_BASE}/api/course/${courseId}/rate`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ rating: ratingValue }),
      });
      const data = await res.json().catch(() => ({ success: false }));
      if (!res.ok && !data.success) {
        const msg =
          (data && (data.message || data.error)) ||
          `Failed to rate (${res.status})`;
        throw new Error(msg);
      }
    } catch (err) {
      toast.error(err.message || "Failed to submit rating", {
        position: "top-right",
        transition: Slide,
        autoClose: 3000,
        theme: "dark",
      });
    }
  };


  const showLoginToast = () => {
    toast.error("Please login to access this course", {
      position: "top-right",
      transition: Slide,
      autoClose: 3000,
      theme: "dark",
    });
  };

  const handleBrowseClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showLoginToast();
      return;
    }
    navigate("/courses");
  };


  const handleSetRating = async (e, courseId, rating) => {
    e.stopPropagation();


    if (!isSignedIn) {
      toast('Please sign in to submit a rating...', { icon: '⭐' });
      return
    }

    setUserRatings((prev) => ({
      ...prev,
      [courseId]: rating
    }));
    await submitRatingToServer(courseId, rating);
  };
  const handleCourseClick = (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showLoginToast();
      return;
    }
    navigate(`/course/${id}`);
  };

  const renderInteractiveStars = (course) => {
    const userRating = userRatings[course.id] || 0;
    const hover = hoverRatings[course.id] || 0;

    const displayRating = hover || userRating;

    return (
      <div className={homeCoursesStyles.starsContainer}>
        <div
          className={homeCoursesStyles.interactiveStars}
          onClick={(e) => e.stopPropagation()}
        >
          {Array.from({ length: 5 }).map((_, i) => {
            const idx = i + 1;
            const filled = idx <= displayRating;



            return (
              <button
                key={i}
                onClick={(e) => handleSetRating(e, course.id, idx)}
                onMouseEnter={() =>
                  setHoverRatings((s) => ({ ...s, [course.id]: idx }))
                }
                onMouseLeave={() =>
                  setHoverRatings((s) => ({ ...s, [course.id]: 0 }))
                }
                className={`${homeCoursesStyles.starButton} ${filled
                  ? homeCoursesStyles.starButtonActive
                  : homeCoursesStyles.starButtonInactive
                  }`}
                style={{ background: "transparent" }}>
                <Star
                  size={16}
                  fill={filled ? "currentColor" : "none"}
                  stroke="currentColor"
                  className={homeCoursesStyles.starIcon}
                />
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // const Courses = coursesData.slice(0, 8);

  return (
    <div className={homeCoursesStyles.container}>

      <div className={homeCoursesStyles.mainContainer}>
        <div className={homeCoursesStyles.header}>
          <h2 className={`${title} ${homeCoursesStyles.title}`}>
            <Star className={homeCoursesStyles.titleIcon} />
            Explore Top Courses
            <Star className={homeCoursesStyles.titleIcon} />
          </h2>
        </div>
        {loading ? (
          <div className="p-6 text-center">Loading courses...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : (
          <>
            <div className={homeCoursesStyles.coursesGrid}>
              {courses.map((course) => {
                const isFree = !!course.isFree || !course.price;

                return (
                  <div
                    key={course.id}
                    onClick={() => handleCourseClick(course.id)}
                    className={homeCoursesStyles.courseCard} >
                    <div className={homeCoursesStyles.imageContainer}>
                      <img
                        src={course.image || "https://via.placeholder.com/300"}
                        alt={course.name}
                        className={homeCoursesStyles.courseImage}
                      />

                    </div>

                    <div className={homeCoursesStyles.courseInfo}>
                      <h3
                        className={`${coursefont} ${homeCoursesStyles.courseName}`}
                      >
                        {course.name}
                      </h3>

                      <div
                        className={`${detail} ${homeCoursesStyles.teacherInfo}`}>
                        <User
                          className={homeCoursesStyles.teacherIcon}
                          size={15}
                        />
                        <span className={homeCoursesStyles.teacherName}>
                          {course.teacher}
                        </span>
                      </div>

                      <div className={homeCoursesStyles.ratingContainer}>
                        {renderInteractiveStars(course)}
                      </div>

                      <div className={homeCoursesStyles.pricingContainer}>
                        {isFree ? (
                          <span className={homeCoursesStyles.freePrice}>
                            Free
                          </span>
                        ) : (
                          <>
                            <span className={homeCoursesStyles.salePrice}>
                              &#8377;{course.price?.sale ?? "-"}
                            </span>
                            {course.price?.original && (
                              <span className={homeCoursesStyles.originalPrice}>
                                ₹{course.price.original}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}



        {/*Single Bottom Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "40px",
          }}
        >
          <div className={homeCoursesStyles.ctaWrapper}>
            <span
              className={homeCoursesStyles.ctaGlow}
              style={{
                zIndex: 0,
                background:
                  "conic-gradient(from 0deg, rgba(236,72,153,0.9), rgba(99,102,241,0.9), rgba(139,92,246,0.9), rgba(236,72,153,0.9))",
                filter: "blur(5px)",
                opacity: 0.8,
              }}
            />
            {/* <button
              onClick={handleBrowseClick}
              className={homeCoursesStyles.ctaButton}
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
              }}
            >
              <span className={homeCoursesStyles.ctaButtonContent}>
                <span className={homeCoursesStyles.ctaText}>
                  Discover Courses
                </span>
                <ArrowRight className={homeCoursesStyles.ctaIcon} />
              </span>
            </button> */}
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        transition={Slide}
      />

      <style jsx>{homeCoursesStyles.animations}</style>
    </div>
  );
};

export default HomeCourses;