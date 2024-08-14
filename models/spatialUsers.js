const mongoose = require("mongoose");

const upiSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    trim: true,
  },
  qr: {
    type: String,
    required: true,
  },
});

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const spatialUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    designation: {
      type: String,
      enum: ["Aalim", "Hafiz", "Muazzan"],
    },
    mosqueName: {
      type: String,
    },
    mosqueArea: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "subadmin", "user"],
      required: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SpatialUser",
      },
    ],
    upi: upiSchema,
    profilePic: {
      type: String,
      match: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SpatialUser", spatialUserSchema);
