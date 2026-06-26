const BASE_URL = "http://localhost:4000/api/course";

// GET all courses
export const getCourses = async () => {
  try {
    const res = await fetch(BASE_URL);
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

// ADD course (image upload)
export const addCourse = async (formData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      body: formData,
    });
    return await res.json();
  } catch (err) {
    console.error(err);
  }
};