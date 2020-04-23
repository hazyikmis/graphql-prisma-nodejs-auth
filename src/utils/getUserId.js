const jwt = require("jsonwebtoken");
require("dotenv").config();

const getUserId = (request) => {
  const header = request.request.headers.authorization;

  if (!header) {
    throw new Error("Authentication required!");
  }

  const token = header.replace("Bearer ", "");
  //verify returns us the payload
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  return decoded.userId;
};

module.exports = { getUserId };
