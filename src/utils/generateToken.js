const jwt = require("jsonwebtoken");

require("dotenv").config();

// const generateToken(payload) {
//   return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7 days" })
// }

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7 days" });
};

module.exports = { generateToken };
