const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// MongoDB Atlas connection string
const MONGODB_URI =
  "mongodb+srv://daimy7940:EVaH3GsBv5i3Tb3g@cluster0.skhpiga.mongodb.net";

// Connect to MongoDB Atlas
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB Atlas connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: "user",
  },
});

// Create User model
const User = mongoose.model("User", userSchema);

// Function to create or update admin user
async function createOrUpdateAdmin() {
  try {
    const email = "admin2@demo.com";
    const password = "AdminDemo@2025";

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // Update existing user to admin
      user.role = "admin";
      await user.save();
      console.log(
        `Existing user ${user.username} (${user.email}) has been made an admin!`
      );
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(password, 10);

      user = new User({
        username: "Admin2",
        email: email,
        password: hashedPassword,
        role: "admin",
      });

      await user.save();
      console.log(`New admin user created with email: ${email}`);
    }

    console.log("User details:", {
      username: user.username,
      email: user.email,
      role: user.role,
      _id: user._id,
    });

    process.exit(0);
  } catch (error) {
    console.error("Error creating/updating admin user:", error);
    process.exit(1);
  }
}

// Create or update admin user
createOrUpdateAdmin();
