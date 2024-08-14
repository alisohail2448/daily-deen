const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SpatialUser = require("../models/spatialUsers");
const { spatialUserSchema } = require("../helper/validation");
const wbm = require('wbm');

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
      data: user,
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
    const updates = req.body;

    const user = await SpatialUser.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    Object.assign(user, updates);

    await user.save();

    res.status(200).json({
      msg: "User profile updated successfully",
      data: user,
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
    const { name, phone, adminId } = req.body;

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
      role: "user",
    });

    await user.save();

    spatialUser.users.push(user._id);
    await spatialUser.save();

    // const inviteMessage = `Hello ${name}, your account has been created. Your password is: ${password}. Please log in to access your account.`;

    // await sendWhatsAppInvite(phone, inviteMessage);

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
