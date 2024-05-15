const jwt = require("jsonwebtoken");
const secretKey = "BK@9497";

function setUser(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    secretKey
  );
}

// function getUser(token) {
//   if (!token) return null;
//   return jwt.verify(token, secretKey);
// }

function getUser(token) {
  if (!token) {
    // If token is not provided, return null
    return null;
  }

  try {
    // Attempt to verify the token
    const user = jwt.verify(token, secretKey);
    return user;
  } catch (error) {
    // If an error occurs during verification, handle it
    if (error instanceof jwt.JsonWebTokenError) {
      // If the error is a JsonWebTokenError (e.g., malformed token), return null
      console.error("JWT verification error:", error.message);
      return null;
    } else {
      // For other types of errors (e.g., token expired), you can handle them accordingly
      console.error("JWT verification error:", error.message);
      throw error; // You can choose to rethrow the error or handle it differently
    }
  }
}

module.exports = {
  setUser,
  getUser,
};
