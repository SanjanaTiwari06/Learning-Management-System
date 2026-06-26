/* eslint-disable no-unused-vars */
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import Banner from "./components/Banner";
import Home from "./pages/Home";
import HomeCourses from "./components/Homecourses";
import Testimonial from "./components/Testimonial";
import About from "./pages/About";
import Faculty from "./pages/Faculty";
import Courses from "./pages/Courses";
import { useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import CourseDetailHomePage from "./pages/CourseDetailHomePage";
import CourseDetailPage from "./pages/CourseDetailPage";
// import AdminRoutes from "../../admin/AdminRoutes";

import ContactUsPage from "./pages/ContactUsPage";
import MyCoursesPage from "./pages/MyCoursesPage";
import AddCourse from "../admin/src/pages/addCourses";
import verifyPaymentPage from "../verifyPaymentPage";
import VerifyPaymentPage from "../verifyPaymentPage";
import MyCourses from "./components/MyCourses";




function App() {
  // to protect the route
  const ProtectedRoute = ({ children }) => {
    const location = useLocation();

    const isAuthenticated = () => {
      const token = localStorage.getItem("token");
      return Boolean(token);
    };

    if (!isAuthenticated()) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
  };

  const ScrollToTopOnRouteChange = () => {
    const location = useLocation();

    useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, [location]);
  };

  const ScrollTopButton = ({ threshold = 200, showOnMount = false }) => {
    const [visible, setVisible] = useState(!!showOnMount);

    useEffect(() => {
      const onScroll = () => {
        setVisible(window.scrollY > threshold);
      };
      onScroll()
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }, [threshold]);

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!visible) return null;

    return (
      <button
        onClick={scrollToTop}
        className="fixed right-6 bottom-6 z-50 p-2 rounded-full focus:outline-none backdrop-blur-sm border border-white/20 shadow-lg cursor-pointer transition-transform"
      >
        <ArrowUp className="w-6 h-6 text-sky-600 drop-shadow-sm" />
      </button>
    );
  };

  return (
    <>
      <ScrollToTopOnRouteChange />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Courses" element={<Courses />} />
        <Route path="/About" element={<About />} />
        <Route path="/Faculty" element={<Faculty />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/MyCourses" element={<MyCoursesPage />} />
        <Route path="/course/:id" element={<ProtectedRoute><CourseDetailHomePage /></ProtectedRoute>} />
        <Route path="/courses/:id" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />


        <Route path="/admin/*" element={<AddCourse />} />
       <Route path="/booking/success" element={<VerifyPaymentPage />} />
        <Route path="/booking/cancel" element={<VerifyPaymentPage/>} />
      </Routes>
      <ScrollTopButton threshold={250} />

    </>
  );
}

export default App;


