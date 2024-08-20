  const mongoose = require("mongoose");

  const upiSchema = new mongoose.Schema({
    id: {
      type: String,
      trim: true,
    },
    qr: {
      type: String,
    },
  });

  const messageSchema = new mongoose.Schema({
    sender: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  });

  const spatialUserSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
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
      },
      role: {
        type: String,
        enum: ["admin", "subadmin", "user"],
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
      },
      messages: [messageSchema],
    },
    {
      timestamps: true,
    }
  );

  module.exports = mongoose.model("SpatialUser", spatialUserSchema);
