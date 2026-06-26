import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", form);

    // yaha baad me API call lagayenge
    setSubmitted(true);

    setForm({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

        {/* LEFT SIDE */}
        <div>
          <h1 className="text-4xl font-bold text-indigo-600 mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 mb-6">
            Have questions? We'd love to hear from you.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="text-indigo-500" />
              <span>support@lms.com</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="text-indigo-500" />
              <span>+91 9876543210</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="text-indigo-500" />
              <span>Delhi, India</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (FORM) */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Send Message</h2>

          {submitted && (
            <p className="text-green-600 mb-4">
              ✅ Message sent successfully!
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
              rows="4"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition"
            >
              <Send size={18} />
              Send Message
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;