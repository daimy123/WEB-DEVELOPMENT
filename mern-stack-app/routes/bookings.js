const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { authenticate } = require("../middleware/auth");

// Define Booking Schema
const bookingSchema = new mongoose.Schema({
  externalMovieId: {
    type: String,
    required: true,
  },
  movieTitle: {
    type: String,
    required: true,
  },
  moviePoster: String,
  customerName: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  userEmail: String,
  seats: {
    type: Number,
    required: true,
    min: 1,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "confirmed",
  },
});

// Create Booking model if it doesn't exist
const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

// Get all bookings (admin only)
router.get("/", authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const bookings = await Booking.find().sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's bookings
router.get("/user", authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({
      bookingDate: -1,
    });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new booking
router.post("/", authenticate, async (req, res) => {
  try {
    const {
      externalMovieId,
      movieTitle,
      moviePoster,
      customerName,
      seats,
      totalAmount,
      status,
    } = req.body;

    // Validate required fields
    if (!externalMovieId || !movieTitle || !customerName || !seats) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Create new booking
    const newBooking = new Booking({
      externalMovieId,
      movieTitle,
      moviePoster,
      customerName,
      userId: req.user.id,
      userEmail: req.user.email,
      seats,
      totalAmount: totalAmount || seats * 12.99, // Default price if not provided
      status: status || "confirmed",
    });

    await newBooking.save();

    res.status(201).json(newBooking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update booking status (admin only)
router.put("/:id", authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Please provide status" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete booking (admin only)
router.delete("/:id", authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await booking.remove();

    res.json({ message: "Booking removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
