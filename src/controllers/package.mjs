import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";
import Package from "../models/package.mjs";

configDotenv();

const addPackage = async (req, res) => {
  try {
    const data = req.body;

    // Basic validation
    if (!data.senderFullName || !data.receiverFullName || !data.packageType || !data.paymentMethod || !data.user_jwt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Decode JWT to extract userId
    let userId;
    try {
      const decoded = jwt.verify(data.user_jwt, process.env.JWT_SECRET);
      userId = decoded.userId;
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Create new Package document
    const newPackage = new Package({
      userId, // Associate with user
      senderFullName: data.senderFullName,
      senderCompanyName: data.senderCompanyName,
      senderStreetAddress: data.senderStreetAddress,
      senderCity: data.senderCity,
      senderPostalCode: data.senderPostalCode,
      senderCountry: data.senderCountry,
      senderPhone: data.senderPhone,
      senderEmail: data.senderEmail,

      receiverFullName: data.receiverFullName,
      receiverCompanyName: data.receiverCompanyName,
      receiverStreetAddress: data.receiverStreetAddress,
      receiverCity: data.receiverCity,
      receiverPostalCode: data.receiverPostalCode,
      receiverCountry: data.receiverCountry,
      receiverPhone: data.receiverPhone,
      receiverEmail: data.receiverEmail,

      packageType: data.packageType,
      weight: data.weight,
      length: data.length,
      width: data.width,
      height: data.height,
      packageDescription: data.packageDescription,

      paymentMethod: data.paymentMethod,
    });

    await newPackage.save();

    res.status(201).json({ message: 'Package added successfully', packageId: newPackage._id });
  } catch (error) {
    console.error('Error saving package:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { addPackage };
