const jwt = require("jsonwebtoken");
require("dotenv").config();

/*
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
*/

//requireAuth argument added to getUserId method, in order to provide more flexibility
//...and we assigned true as a default value to UN-AFFECT the previous usages especially inside the resolvers/Mutation.js
//Now, we can conditionally throw an error based on the "requireAuth"
const getUserId = (request, requireAuth = true) => {
  const header = request.request.headers.authorization;

  if (header) {
    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  }

  //if reached that point, nothing returned, means no user/token, no authorization

  if (requireAuth) {
    throw new Error("Authentication required!");
  }

  //if reached that point, means requireAuth=false,
  // as a result IMPLICITLY RETURN UNDEFINED !!! IF we had not written the "return null" below
  return null;
};

module.exports = { getUserId };
