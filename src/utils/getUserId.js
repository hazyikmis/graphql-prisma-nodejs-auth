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
//Another thing:
//BE CAREFUL: Subscriptions are different from Query & Mutations
//Becasue Query & Mutations use HTTP, but Subscriptions use WEBSOCKETs
//As a result of this, we need to make change inside the getUserId method
//in order to extract token correctly from request object
//for HTTP      : request.request.headers.authorization
//for WebSockets: request.connection.context.Authorization
//SIDE_NOTE: If request contains request, it means that it's a HTTP request (not a subscription, its a Query or mutation)

const getUserId = (request, requireAuth = true) => {
  const header = request.request
    ? request.request.headers.authorization
    : request.connection.context.Authorization;

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
