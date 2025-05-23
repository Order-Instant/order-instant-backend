import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema({
  userId: { type: String, required: true },

  // Sender Info
  senderFullName: { type: String, required: true },
  senderCompanyName: { type: String, default: '' }, // optional
  senderStreetAddress: { type: String, required: true },
  senderCity: { type: String, required: true },
  senderPostalCode: { type: String, required: true },
  senderCountry: { type: String, required: true },
  senderPhone: { type: String, required: true },
  senderEmail: { type: String, required: true },

  // Receiver Info
  receiverFullName: { type: String, required: true },
  receiverCompanyName: { type: String, default: '' }, // optional
  receiverStreetAddress: { type: String, required: true },
  receiverCity: { type: String, required: true },
  receiverPostalCode: { type: String, required: true },
  receiverCountry: { type: String, required: true },
  receiverPhone: { type: String, required: true },
  receiverEmail: { type: String, required: true },

  // Package Info
  packageType: { type: String, required: true }, // e.g., box, envelope
  weight: { type: Number, default: 0 },      // in kg or lbs
  length: { type: Number, default: 0 },      // in cm or inches
  width: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
  packageDescription: { type: String, default: '' },

  // Payment Info
  paymentMethod: { type: String, required: true }, // e.g., Credit Card, Cash

  estimatedDeliveryTime: { type: String, default: '' },
  lastKnownLocation: { type: String, default: '' },

  processingDateTime: { type: String, default: '' },
  pickedUpDataTime: { type: String, default: '' },
  departedDateTime: { type: String, default: '' },
  deliveredDateTime: { type: String, default: '' },
  cancelledDateTime: { type: String, default: '' },
}, {
  timestamps: true,
});

export default mongoose.model('Package', PackageSchema);
