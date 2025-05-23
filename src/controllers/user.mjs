import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.mjs';
import OTP from '../models/otp.mjs';
import sendMail from "../controllers/mail.mjs";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

let signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete old OTPs for this email
    await OTP.deleteMany({ email });

    // Save new OTP
    await OTP.create({ email, otp, type: 'email-verification' });

    // Send OTP email including firstName and lastName
    await sendMail({
      email,
      type: 1, // email verification type
      payload: {
        otp,
        firstName,
        lastName
      }
    });

    res.status(200).json({ message: 'OTP sent to email for verification' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, otp } = req.body;

    // Find OTP
    const existingOtp = await OTP.findOne({ email, type: 'email-verification' });

    if (!existingOtp) {
      return res.status(400).json({ error: 'OTP not found or expired' });
    }

    if (existingOtp.otp !== otp) {
      return res.status(401).json({ error: 'Invalid OTP' });
    }

    // OTP is valid — create user
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Clean up used OTP
    await OTP.deleteOne({ _id: existingOtp._id });

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

let login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      JWT_SECRET
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const accountDeleteRequest = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete existing delete-account OTPs
    await OTP.deleteMany({ email: user.email, type: "account-delete" });

    // Save new OTP
    await OTP.create({ email: user.email, otp, type: "account-delete" });

    // Send OTP mail
    await sendMail({
      email: user.email,
      type: 3,
      payload: {
        otp,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

    return res.status(200).json({ message: "OTP sent to email for account deletion confirmation." });
  } catch (err) {
    console.error("Error in accountDeleteRequest:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};


const deleteAccount = async (req, res) => {
  try {
    const { user_jwt: token, otp } = req.body;

    if (!token || !otp) {
      return res.status(400).json({ message: "Missing token or OTP." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const existingOtp = await OTP.findOne({ email: user.email, type: 'account-delete' });

    if (!existingOtp || existingOtp.otp !== otp) {
      return res.status(403).json({ message: "Invalid or expired OTP." });
    }

    await User.findByIdAndDelete(userId);
    await OTP.deleteOne({ _id: existingOtp._id });
    return res.status(200).json({ message: "Account deleted successfully." });

  } catch (err) {
    console.error("Error deleting account:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};



let changePassword = async (req, res) => {
  try {
    const { email, newPassword, otp } = req.body;

    if (!email || !newPassword || !otp) {
      return res.status(400).json({ error: 'Email, new password, and OTP are required' });
    }

    // Find the OTP record for this email and forgot-password type
    const existingOtp = await OTP.findOne({ email, type: 'forgot-password' });

    if (!existingOtp) {
      return res.status(400).json({ error: 'OTP not found or expired' });
    }

    if (existingOtp.otp !== otp) {
      return res.status(401).json({ error: 'Invalid OTP' });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Hash the new password and update the user
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Remove the used OTP
    await OTP.deleteOne({ _id: existingOtp._id });

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete any previous forgot-password OTPs for this email
    await OTP.deleteMany({ email, type: 'forgot-password' });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP with type 'forgot-password'
    await OTP.create({ email, otp, type: 'forgot-password' });

    // Send OTP email with firstName, lastName included in payload
    await sendMail({
      email,
      type: 2, // forgot-password email template
      payload: {
        otp,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

    res.status(200).json({ message: 'OTP sent to email for password reset verification' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

let updateUserInfo = async (req, res) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];

    // Verify token and decode payload
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    const userId = decoded.id; // Extract user ID from token payload

    const { firstName, lastName, email } = req.body;

    if (!firstName && !lastName && !email) {
      return res.status(400).json({ error: 'At least one field must be provided to update' });
    }

    // Check if email is being updated and if it is taken
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(409).json({ error: 'Email already in use' });
      }
    }

    const updatedFields = {};
    if (firstName) updatedFields.firstName = firstName;
    if (lastName) updatedFields.lastName = lastName;
    if (email) updatedFields.email = email;

    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true });

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User information updated successfully', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserData = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authorization token malformed' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Find user by id from decoded token
    const user = await User.findById(decoded.id).select('-password'); // exclude password field

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send back user document
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default getUserData;


export { signup, createUser, login, forgotPassword, accountDeleteRequest, deleteAccount, changePassword, updateUserInfo };
