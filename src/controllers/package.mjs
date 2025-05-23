import jwt from "jsonwebtoken";
import Package from "../models/package.mjs";

const addPackage = async (req, res) => {
  try {
    const data = req.body;

    if (!data.senderFullName || !data.receiverFullName || !data.packageType || !data.paymentMethod || !data.user_jwt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Decode JWT
    let userId;
    try {
      const decoded = jwt.verify(data.user_jwt, process.env.JWT_SECRET);
      userId = decoded.id;
      if (!userId) {
        return res.status(401).json({ error: 'Invalid token: userId not found' });
      }
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const now = new Date();
    const formattedDateTime = now.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:mm'

    const newPackage = new Package({
      userId,
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

      processingDateTime: formattedDateTime,
    });

    await newPackage.save();

    res.status(201).json({ message: 'Package added successfully', packageId: newPackage._id });
  } catch (error) {
    res.status(400).json({ error: 'Please provide all input field unless it is optional' });
  }
};


const getPackage = async (req, res) => {
  try {
    const { packageId } = req.params;

    if (!packageId) {
      return res.status(400).json({ error: "Package ID is required" });
    }

    const foundPackage = await Package.findById(packageId);

    if (!foundPackage) {
      return res.status(404).json({ error: "Package not found" });
    }

    res.status(200).json(foundPackage);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve package" });
  }
};

const getPackages = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Sort packages by creation time descending (newest first)
    const packages = await Package.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(packages);
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};


const deletePackage = async (req, res) => {
  try {
    const { packageId } = req.params;
    await Package.findByIdAndDelete(packageId);
    res.status(200).json({ message: "Package deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete package" });
  }
};

export { addPackage, getPackage, getPackages,  deletePackage};
