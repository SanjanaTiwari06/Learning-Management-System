// import Booking from "../models/bookingModel.js";
// import Stripe from 'stripe';
// import { v4 as uuidv4 } from 'uuid';
// import { getAuth } from '@clerk/express';
// import dotenv from 'dotenv';

// dotenv.config();

// const STRIPE_KEY = process.env.STRIPE_SECRET_KEY
// const FRONTEND_URL = process.env.FRONTEND_URL
// const stripe = STRIPE_KEY ? new Stripe(STRIPE_KEY, { apiVersion: "2023-10-16" }) : null;

// // HELPERS
// const safeNumber = (v) => {
//     const n = Number(v);
//     return Number.isFinite(n) ? n : null;
// };

// const genBookingId = () => `BK-${uuidv4()}`;

// function buildFrontendBase(req) {
//     if (FRONTEND_URL) return FRONTEND_URL.replace(/\/$/, "");
//     const origin = req.get("origin");
//     if (origin) return origin.replace(/\/$/, "");
//     const host = req.get("host");
//     if (host) return `${req.protocol || "http"}://${host}`.replace(/\/$/, "");
//     return null;
// }

// // get bookings
// export const getBookings = async (req, res) => {
//     try {
//         const bookings = await Booking.find().sort({ createdAt: -1 }).lean();

//         return res.json({
//             success: true,
//             bookings
//         });

//     } catch (error) {
//         console.error("getBookings error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Server Error"
//         });
//     }
// };
// // we also need to check for the booking as a user has already enrolled in that course or not
// export const checkBooking = async (req, res) => {
//   try {
//     const { userId } = getAuth(req) || {};
//     const { courseId } = req.query;

//     if (!userId) {
//       return res.json({ success: true, enrolled: false });
//     }

//     const booking = await Booking.findOne({
//       clerkUserId: userId,
//       course: String(courseId), // 🔥 FIX
//       paymentStatus: "Paid",
//     });

//     console.log("CHECK BOOKING:", booking); // 🔥 DEBUG

//     return res.json({
//       success: true,
//       enrolled: !!booking,
//       booking,
//     });

//   } catch (error) {
//     console.error("checkBooking error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };


// export const createBooking = async (req, res) => {
//     try {
        
//         const { userId } = getAuth(req) || {};
//         const finalUserId = userId || "test_user_123";

//         const {
//             courseId,
//             courseName,
//             teacherName = "",
//             price,
//             notes = "",
//             email,
//             studentName,
//         } = req.body;

//         if (!courseId || !courseName) {
//             return res.status(400).json({
//                 success: false,
//                 message: "courseId and courseName required"
//             });
//         }

//         const numericPrice = safeNumber(price);
//         if (numericPrice === null || numericPrice < 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "price must be a valid number"
//             });
//         }

//         const bookingId = genBookingId();

//         const resolvedStudentName =
//             (studentName && String(studentName).trim()) ||
//             (email && String(email).trim()) ||
//             `User-${String(finalUserId).slice(0, 8)}`;

//         const basePayload = {
//             bookingId,
//             clerkUserId: finalUserId, // 🔥 FIX HERE
//             studentName: resolvedStudentName,
//             course: courseId,
//             courseName,
//             teacherName,
//             price: numericPrice,
//             paymentMethod: "Online",
//             paymentStatus: "Unpaid",
//             notes,
//             orderStatus: "Pending",
//             createdAt: new Date(),
//         };


//         if (numericPrice === 0) {
//             const booking = await Booking.create({
//                 ...basePayload,
//                 paymentStatus: "Paid",
//                 orderStatus: "Confirmed",
//                 paidAt: new Date(),
//             });

//             return res.status(201).json({
//                 success: true,
//                 booking,
//                 checkoutUrl: null
//             });
//         }

//         // 💳 PAID COURSE FLOW
//         if (!stripe) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Stripe not configured on server"
//             });
//         }

//         const base = buildFrontendBase(req);
//         if (!base) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Frontend URL not determined."
//             });
//         }

//         const successUrl = `${base}/booking/success?session_id={CHECKOUT_SESSION_ID}`;
//         const cancelUrl = `${base}/booking/cancel`;

//         let session;
//         try {
//             session = await stripe.checkout.sessions.create({
//                 payment_method_types: ["card"],
//                 mode: "payment",
//                 customer_email: email || undefined,
//                 line_items: [
//                     {
//                         price_data: {
//                             currency: "inr",
//                             product_data: { name: courseName },
//                             unit_amount: Math.round(numericPrice * 100),
//                         },
//                         quantity: 1,
//                     },
//                 ],
//                 success_url: successUrl,
//                 cancel_url: cancelUrl,
//                 metadata: {
//                     bookingId,
//                     courseId,
//                     clerkUserId: finalUserId,
//                     studentName: resolvedStudentName
//                 },
//             });
//         } catch (stripeErr) {
//             console.error("Stripe error:", stripeErr);
//             return res.status(502).json({
//                 success: false,
//                 message: "Payment error"
//             });
//         }

//         try {
//             const booking = await Booking.create({
//                 ...basePayload,
//                 sessionId: session.id,
//                 paymentIntentId: session.payment_intent || null,
//             });

//             return res.status(201).json({
//                 success: true,
//                 booking,
//                 checkoutUrl: session.url || null
//             });
//         } catch (dbErr) {
//             console.error("DB error:", dbErr);
//             return res.status(500).json({
//                 success: false,
//                 message: "Failed to save booking"
//             });
//         }

//     } catch (err) {
//         console.error("createBooking error:", err);
//         return res.status(500).json({
//             success: false,
//             message: "Server error"
//         });
//     }
// };

// /* ---------------- Authenticated: confirmPayment ----------------*/
// export const confirmPayment = async (req, res) => {
//     try {
//         const { userId } = getAuth(req) || {};
//         if (!userId) return res.status(401).json({ success: false, message: "Authentication required" });

//         const { session_id } = req.query;
//         if (!session_id) return res.status(400).json({ success: false, message: "session_id is required" });

//         if (!stripe) return res.status(500).json({ success: false, message: "Stripe not configured" });

//         const session = await stripe.checkout.sessions.retrieve(session_id);
//         if (!session) return res.status(400).json({ success: false, message: "Invalid session" });

//         if (session.payment_status !== "paid") {
//             return res.status(400).json({ success: false, message: "Payment not completed" });
//         }

//         // Try match by sessionId first, then metadata.bookingId
//         let booking = await Booking.findOneAndUpdate(
//             { sessionId: session_id },
//             { paymentStatus: "Paid", paymentIntentId: session.payment_intent || null, orderStatus: "Confirmed", paidAt: new Date() },
//             { new: true }
//         );

//         if (!booking && session.metadata?.bookingId) {
//             booking = await Booking.findOneAndUpdate(
//                 { bookingId: session.metadata.bookingId },
//                 { paymentStatus: "Paid", paymentIntentId: session.payment_intent || null, orderStatus: "Confirmed", paidAt: new Date() },
//                 { new: true }
//             );
//         }

//         if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

//         return res.json({ success: true, booking });
//     } catch (err) {
//         console.error("confirmPayment:", err);
//         return res.status(500).json({ success: false, message: "Server error" });
//     }
// };

// // getuserbookings
// export const getUserBookings = async (req, res) => {
//     try {
//         const bookings = await Booking.find().sort({ createdAt: -1 }).lean();

//         return res.json({
//             success: true,
//             bookings
//         });

//     } catch (error) {
//         console.error("getBookings error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Server Error"
//         });
//     }
// };

// // getstats
// // getstats - Complete function as per images
// export const getStats = async (req, res) => {
//     try {
//         const totalBookings = await Booking.countDocuments();

//         const totalRevenueAgg = await Booking.aggregate([
//             { $match: { paymentStatus: 'Paid' } },
//             { $group: { _id: null, total: { $sum: "$price" } } },
//         ]);

//         const totalRevenue = (totalRevenueAgg[0] && totalRevenueAgg[0].total) || 0;

//         const sevenDaysAgo = new Date();
//         sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//         // Pichle 7 dinon ki bookings ka count
//         const bookingsLast7Days = await Booking.countDocuments({
//             createdAt: { $gte: sevenDaysAgo }
//         });

//         // Top courses nikalne ke liye aggregation
//         const topCourses = await Booking.aggregate([
//             {
//                 $group: {
//                     _id: "$courseName",
//                     count: { $sum: 1 },
//                     revenue: { $sum: "$price" }
//                 }
//             },
//             { $sort: { count: -1 } },
//             { $limit: 6 },
//             {
//                 $project: {
//                     courseName: "$_id",
//                     count: 1,
//                     revenue: 1,
//                     _id: 0
//                 }
//             },
//         ]);

//         return res.json({
//             success: true,
//             totalBookings,
//             totalRevenue,
//             bookingsLast7Days,
//             topCourses
//         });

//     } catch (error) {
//         console.error("Error in getStats:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Server error"
//         });
//     }
// };


import Booking from "../models/bookingModel.js";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "@clerk/express";
import dotenv from "dotenv";

dotenv.config();

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL;

const stripe = STRIPE_KEY
  ? new Stripe(STRIPE_KEY, { apiVersion: "2023-10-16" })
  : null;

// helpers
const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const genBookingId = () => `BK-${uuidv4()}`;

function buildFrontendBase(req) {
  if (FRONTEND_URL) return FRONTEND_URL.replace(/\/$/, "");
  const origin = req.get("origin");
  if (origin) return origin.replace(/\/$/, "");
  const host = req.get("host");
  if (host) return `${req.protocol || "http"}://${host}`;
  return null;
}

/* ================= GET ALL BOOKINGS ================= */
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).lean();

    return res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("getBookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ================= CHECK BOOKING (ACCESS CONTROL) ================= */
export const checkBooking = async (req, res) => {
  try {
    const { userId } = getAuth(req) || {};
    const { courseId } = req.query;

    // not logged in -> definitely not enrolled
    if (!userId) {
      return res.json({ success: true, enrolled: false, booking: null });
    }

    if (!courseId) {
      return res.status(400).json({ success: false, message: "courseId is required" });
    }

    // 🔥 FIX: fetch ALL bookings for this user+course, not just the first match.
    // Legacy duplicate records (one Paid, one Unpaid) for the same course can
    // exist in the DB — findOne() picked whichever Mongo returned first, which
    // was sometimes the stale Unpaid one even after the user had paid.
    const bookings = await Booking.find({
      clerkUserId: userId,
      course: String(courseId),
    })
      .sort({ createdAt: -1 })
      .lean();

    const paidBooking = bookings.find(
      (b) =>
        String(b.paymentStatus).toLowerCase() === "paid" ||
        String(b.orderStatus).toLowerCase() === "confirmed" ||
        !!b.paidAt
    );

    const isPaid = !!paidBooking;
    // Prefer the paid record if one exists, otherwise fall back to the most
    // recent one so the frontend can still show "payment pending" correctly.
    const relevantBooking = paidBooking || bookings[0] || null;

    return res.json({
      success: true,
      enrolled: isPaid,
      booking: relevantBooking,
    });
  } catch (error) {
    console.error("checkBooking error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= CREATE BOOKING ================= */
export const createBooking = async (req, res) => {
  try {
    const { userId } = getAuth(req) || {};
    const finalUserId = userId || "test_user_123";

    const {
      courseId,
      courseName,
      teacherName = "",
      price,
      notes = "",
      email,
      studentName,
    } = req.body;

    if (!courseId || !courseName) {
      return res.status(400).json({
        success: false,
        message: "courseId and courseName required",
      });
    }

    const numericPrice = safeNumber(price);
    if (numericPrice === null || numericPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "price must be valid",
      });
    }

    // 🔥 ROOT-CAUSE FIX: check for existing bookings for this user+course
    // BEFORE creating a new one. This is what was causing duplicate Paid/Unpaid
    // records — every retry/re-click was inserting a brand new document.
    const existingBookings = await Booking.find({
      clerkUserId: finalUserId,
      course: String(courseId),
    }).sort({ createdAt: -1 });

    const existingPaid = existingBookings.find(
      (b) =>
        String(b.paymentStatus).toLowerCase() === "paid" ||
        String(b.orderStatus).toLowerCase() === "confirmed" ||
        !!b.paidAt
    );

    // Already enrolled — don't create another record, don't start another checkout.
    if (existingPaid) {
      return res.status(200).json({
        success: true,
        alreadyEnrolled: true,
        booking: existingPaid,
        message: "You are already enrolled in this course",
      });
    }

    const resolvedStudentName =
      studentName ||
      email ||
      `User-${String(finalUserId).slice(0, 8)}`;

    // Reuse the most recent Unpaid booking for this user+course if one exists,
    // instead of inserting a new duplicate document.
    const existingUnpaid = existingBookings[0] || null;

    /* ===== FREE COURSE ===== */
    if (numericPrice === 0) {
      let booking;
      if (existingUnpaid) {
        existingUnpaid.paymentStatus = "Paid";
        existingUnpaid.orderStatus = "Confirmed";
        existingUnpaid.paidAt = new Date();
        existingUnpaid.price = numericPrice;
        existingUnpaid.courseName = courseName;
        existingUnpaid.teacherName = teacherName;
        existingUnpaid.notes = notes;
        booking = await existingUnpaid.save();
      } else {
        booking = await Booking.create({
          bookingId: genBookingId(),
          clerkUserId: finalUserId,
          studentName: resolvedStudentName,
          course: String(courseId),
          courseName,
          teacherName,
          price: numericPrice,
          paymentMethod: "Online",
          paymentStatus: "Paid",
          orderStatus: "Confirmed",
          paidAt: new Date(),
          notes,
        });
      }

      return res.status(201).json({
        success: true,
        booking,
      });
    }

    /* ===== PAID COURSE ===== */
    if (!stripe) {
      return res.status(500).json({
        success: false,
        message: "Stripe not configured",
      });
    }

    const base = buildFrontendBase(req);
    if (!base) {
      return res.status(500).json({
        success: false,
        message: "Frontend URL missing",
      });
    }

    const bookingId = existingUnpaid?.bookingId || genBookingId();

    const successUrl = `${base}/booking/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${base}/booking/cancel`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: courseName },
            unit_amount: Math.round(numericPrice * 100),
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        bookingId,
        courseId,
        clerkUserId: finalUserId,
      },
    });

    let booking;
    if (existingUnpaid) {
      // 🔥 Update the existing Unpaid record instead of creating a new one
      existingUnpaid.bookingId = bookingId;
      existingUnpaid.sessionId = session.id;
      existingUnpaid.paymentIntentId = session.payment_intent || null;
      existingUnpaid.price = numericPrice;
      existingUnpaid.courseName = courseName;
      existingUnpaid.teacherName = teacherName;
      existingUnpaid.notes = notes;
      existingUnpaid.paymentStatus = "Unpaid";
      existingUnpaid.orderStatus = "Pending";
      booking = await existingUnpaid.save();
    } else {
      booking = await Booking.create({
        bookingId,
        clerkUserId: finalUserId,
        studentName: resolvedStudentName,
        course: String(courseId),
        courseName,
        teacherName,
        price: numericPrice,
        paymentMethod: "Online",
        paymentStatus: "Unpaid",
        orderStatus: "Pending",
        notes,
        sessionId: session.id,
        paymentIntentId: session.payment_intent || null,
      });
    }

    return res.status(201).json({
      success: true,
      booking,
      checkoutUrl: session.url,
    });
  } catch (err) {
    console.error("createBooking error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= CONFIRM PAYMENT ================= */
export const confirmPayment = async (req, res) => {
  try {
    const { userId } = getAuth(req) || {};
    if (!userId)
      return res.status(401).json({ success: false });

    const { session_id } = req.query;
    if (!session_id) {
      return res.status(400).json({ success: false, message: "session_id is required" });
    }

    if (!stripe) {
      return res.status(500).json({ success: false, message: "Stripe not configured on server" });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ success: false });
    }

    let booking = await Booking.findOneAndUpdate(
      { sessionId: session_id },
      {
        paymentStatus: "Paid",
        orderStatus: "Confirmed",
        paidAt: new Date(),
      },
      { new: true }
    );

    if (!booking && session.metadata?.bookingId) {
      booking = await Booking.findOneAndUpdate(
        { bookingId: session.metadata.bookingId },
        {
          paymentStatus: "Paid",
          orderStatus: "Confirmed",
          paidAt: new Date(),
        },
        { new: true }
      );
    }

    console.log("PAYMENT UPDATED:", booking);

    return res.json({ success: true, booking });
  } catch (err) {
    console.error("confirmPayment:", err);
    return res.status(500).json({ success: false });
  }
};

/* ================= USER BOOKINGS ================= */
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = getAuth(req) || {};

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const bookings = await Booking.find({
      clerkUserId: userId,
      paymentStatus: "Paid", // 🔥 ONLY PAID
    })
      .sort({ createdAt: -1 })
      .lean();

    console.log("USER BOOKINGS:", bookings);

    return res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("getUserBookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
export const getStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();

    const totalRevenueAgg = await Booking.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    return res.json({
      success: true,
      totalBookings,
      totalRevenue,
    });
  } catch (error) {
    console.error("getStats error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
