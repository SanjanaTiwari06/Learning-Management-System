import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminCourses from "./pages/AdminCourses";
import AddCourse from "./pages/addCourses";
import EditCourse from "./pages/EditCOurses";

function App() {
  return (
    <>
    
    <Routes>
        <Route path="/" element={<AdminCourses />} />
        <Route path="/admin/add-course" element={<AddCourse />} />
        <Route path="/admin/edit-course/:id" element={<EditCourse />} />
      </Routes>
    </>
      

  );
}

export default App;