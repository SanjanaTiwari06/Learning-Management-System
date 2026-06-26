import Course from '../models/Course.js';
import { getAuth } from '@clerk/express';
import fs from 'fs';
import path from 'path';

// HELPERS 

const toNumber = (v, fallback = 0) => {
  if (typeof v === 'number') return v;
  if (typeof v === 'string' && v.trim() === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const parseJSONSafe = (maybe) => {
  if (!maybe) return null;
  if (typeof maybe === 'object') return maybe;
  try { return JSON.parse(maybe); } catch { return null; }
};

const computeDerivedFields = (courseObj) => {
  let totalCourseMinutes = 0;
  if (!Array.isArray(courseObj.lectures)) courseObj.lectures = [];

  courseObj.lectures = courseObj.lectures.map((lec) => {
    lec = { ...lec };
    lec.duration = lec.duration || {};
    lec.chapters = Array.isArray(lec.chapters) ? lec.chapters : [];

    lec.chapters = lec.chapters.map((ch) => {
      ch = { ...ch };
      ch.duration = ch.duration || {};
      const chHours = toNumber(ch.duration.hours);
      const chMins = toNumber(ch.duration.minutes);
      ch.totalMinutes = chHours * 60 + chMins;
      ch.duration.hours = chHours;
      ch.duration.minutes = chMins;
      return ch;
    });

    const lecHours = toNumber(lec.duration.hours);
    const lecMins = toNumber(lec.duration.minutes);
    const lectureOwnMinutes = lecHours * 60 + lecMins;
    const chaptersMinutes = lec.chapters.reduce((s, c) => s + c.totalMinutes, 0);

    lec.totalMinutes = lectureOwnMinutes + chaptersMinutes;
    lec.duration.hours = lecHours;
    lec.duration.minutes = lecMins;
    totalCourseMinutes += lec.totalMinutes;

    return lec;
  });

  courseObj.totalDuration = {
    hours: Math.floor(totalCourseMinutes / 60),
    minutes: totalCourseMinutes % 60,
  };
  courseObj.totalLectures = courseObj.lectures.length;

  return courseObj;
};

const makeImageAbsolute = (rawImage, req) => {
  if (!rawImage) return "";
  if (rawImage.startsWith("http")) return rawImage;
  return `${req.protocol}://${req.get("host")}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;
};

// Controllers

// getPublicCourses
export const getPublicCourses = async (req, res) => {
  try {
    const courses = await Course.find().lean();
    const mapped = courses.map(c => ({
      ...c,
      image: makeImageAbsolute(c.image || "", req)
    }));
    return res.json(mapped);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// getCourses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 }).lean();
    const mapped = courses.map((c) => ({
      ...c,
      image: makeImageAbsolute(c.image || "", req)
    }));
    return res.json({ success: true, courses: mapped });
  } catch (error) {
    console.error('GetCourses error:', error);
    return res.status(500).json({ success: false, message: "Failed to fetch courses" });
  }
};

// getCourseById
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).lean();
    if (!course) return res.status(404).json({ success: false, message: "Not found" });
    course.image = makeImageAbsolute(course.image || "", req);
    return res.json({ success: true, course });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createCourse = async (req, res) => {
  try {
    const body = req.body || {};
    const imagePath = req.file ? `/uploads/${req.file.filename}` : (body.image || "");

    let lectures = parseJSONSafe(body.lectures) ?? [];
    if (!Array.isArray(lectures)) lectures = [];

    
    const parsedPrice = parseJSONSafe(body.price) || { original: 0, sale: 0 };

    const courseObj = {
      name: body.name || "",
      teacher: body.teacher || "",
      image: imagePath,
      lectures,

      
      pricingType: body.pricingType || "free",
      price: {
        original: toNumber(parsedPrice.original),
        sale: toNumber(parsedPrice.sale),
      },

      courseType: body.courseType || "regular",
      createdBy: body.createdBy || null,
    };

    computeDerivedFields(courseObj);

    const course = new Course(courseObj);
    await course.save();

    const returned = course.toObject();
    returned.image = makeImageAbsolute(returned.image || "", req);

    return res.status(201).json({ success: true, course: returned });

  } catch (error) {
    console.error('CreateCourse error:', error);
    return res.status(500).json({ success: false, message: "Failed to create course" });
  }
};

// deleteCourse
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Not found" });

    if (course.image && !course.image.startsWith('http')) {
      const filePath = path.join(process.cwd(), course.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Course.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Course deleted successfully' });

  } catch (error) {
    console.error('DeleteCourse error:', error);
    return res.status(500).json({ success: false, message: "Failed to delete course" });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const updateData = {
      ...req.body,
    };

    // agar image upload hui hai
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    await Course.findByIdAndUpdate(courseId, updateData);

    res.json({
      success: true,
      message: "Course updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Update failed",
    });
  }
};

// rateCourse
export const rateCourse = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required.' });

    const { courseId } = req.params;
    const { rating } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course Not Found' });

    course.ratings.push({ userId, rating: Number(rating) });

    const total = course.ratings.length;
    const sum = course.ratings.reduce((s, r) => s + r.rating, 0);

    course.avgRating = sum / total;
    course.totalRatings = total;

    await course.save();
    return res.json({ success: true });

  } catch (error) {
    console.error("rateCourse error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// getMyRating
export const getMyRating = async (req, res) => {
  try {
    const { userId } = getAuth(req) || {};
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required.' });

    const course = await Course.findById(req.params.courseId).lean();
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    const my = (course.ratings || []).find(r => String(r.userId) === String(userId)) || null;

    return res.json({
      success: true,
      myRating: my ? { rating: my.rating } : null
    });

  } catch (error) {
    console.error('MyRating error:', error);
    return res.status(500).json({ success: false, message: "Failed to get rating" });
  }
};
