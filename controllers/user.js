const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const User = require("../models/user");
const { spatialUserSchema } = require("../helper/validation");

const signUp = async (req, res) => {
  try {
    const { error } = spatialUserSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        msg: error.details[0].message,
      });
    }
    const { name, phone, password, designation } = req.body;

    const spatialUserInfo = await User.findOne({ phone: phone });

    if (spatialUserInfo) {
      return res.status(400).json({
        msg: "Phone already registered.",
      });
    }

    const hashPassword = await bcrypt.hashSync(password, 10);

    const user = await User.create({
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

    const user = await User.findOne({ phone: phone });

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

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

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

module.exports = {
  signUp,
  login,
};
