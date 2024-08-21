const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SpatialUser = require("../models/spatialUsers");
const { spatialUserSchema } = require("../helper/validation");
const wbm = require('wbm');
const { sendBySms, sendSms } = require("../helper/twillio");

const sendWhatsAppInvite = async (phoneNumber, message) => {
  wbm
    .start()
    .then(async () => {
      const phones = ["7249047105"];
      const message = "Good Morning.";
      await wbm.send(phones, message);
      await wbm.end();
    })
    .catch((err) => console.log(err));
};

const generateReadablePassword = (name) => {
  const randomNumber = Math.floor(Math.random() * 10000);
  return `${name}${randomNumber}`;
};

const signUp = async (req, res) => {
  try {
    const { error } = spatialUserSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        msg: error.details[0].message,
      });
    }
    const { name, phone, password, designation } = req.body;

    const spatialUserInfo = await SpatialUser.findOne({ phone: phone });

    if (spatialUserInfo) {
      return res.status(400).json({
        msg: "Phone already registered.",
      });
    }

    const hashPassword = await bcrypt.hashSync(password, 10);

    const user = await SpatialUser.create({
      name: name,
      phone: phone,
      password: hashPassword,
      designation: designation,
      role:
        designation === "Aalim" || designation === "Hafiz"
          ? "admin"
          : "subadmin",
    });


    return res.status(200).json({
      msg: "Account created successfully",
      success: true,
      data: { user },
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error, please try again",
      error: error,
    });
  }
};

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await SpatialUser.findOne({ phone });

    if (!user) {
      return res.status(401).json({
        msg: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        msg: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      msg: "Login successful",
      user: user,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

const getSpatialProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await SpatialUser.findById(id).populate('users');

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      msg: "User profile fetched successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

const editSpatialProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { updates } = req.body;

    const user = await SpatialUser.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }   
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      msg: "User profile updated successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

const addUser = async (req, res) => {
  try {
    const { name, phone, role, adminId } = req.body;

    const existingUser = await SpatialUser.findOne({ phone });

    if (existingUser) {
      return res.status(400).json({ msg: "Phone number is already registered" });
    }

    const spatialUser = await SpatialUser.findById(adminId);

    if (!spatialUser) {
      return res.status(404).json({ msg: "Spatial user not found" });
    }

    const password = generateReadablePassword(name);

    const hashedPassword = await bcrypt.hashSync(password, 10);

    const user = new SpatialUser({
      name,
      phone,
      password: hashedPassword,
      role: role ?? "user",
    });

    await user.save();

    spatialUser.users.push(user._id);
    await spatialUser.save();

    await sendSms(phone, password);

    res.status(201).json({
      msg: "Normal user created, password generated, and invite sent successfully",
      data: {
        name,
        phone,
        password,
      },
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  signUp,
  login,
  getSpatialProfileById,
  editSpatialProfile,
  addUser,
};
