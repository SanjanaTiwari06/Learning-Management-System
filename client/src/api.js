const API = import.meta.env.VITE_API_URL;

export const getCourses = async () => {
  const res = await fetch("http://localhost:4000/api/course");
  return res.json();
};

export const createBooking = async (data) => {
  const res = await fetch(`${API}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};