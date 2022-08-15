const jwt = require("jsonwebtoken");
const jwtSecret = "jwtsecretshouldbestoredinDotenv";

//Issue token after authorization
const createToken = (sqlResult) => {
  const accessToken = jwt.sign(
    {
      username: sqlResult[0].username,
      id: sqlResult[0].id,
      type: sqlResult[0].user_type,
    },
    jwtSecret
  );
  return accessToken;
};

//Return userId signed into the token
function decodeJwt(token) {
  const decoded = jwt.verify(token, jwtSecret);
  var userId = decoded.id;
  console.log(userId);
  return userId;
}

//Return user type signed into the token
function checkAdmin(token) {
  const decoded = jwt.verify(token, jwtSecret);
  var userType = decoded.type;
  console.log(userType);
  return userType;
}

//For features that require authentication
const validateToken = async (req, res, next) => {
  console.log("validateToken called");

  const accessToken = await req.cookies["access-token"];
  //if the user does not have an access token send error, else verify then authenticate
  if (!accessToken) {
    console.log("Error: No cookies");

    return res
      .status(400)
      .json({ error: "User not authenticated - no cookies" });
  }
  try {
    const validToken = await jwt.verify(accessToken, jwtSecret);
    //checks if the token is valid
    if (validToken) {
      console.log("token valid");
    }
    return next();
  } catch (err) {
    // thrown error output here, conditional statement in if block verifies if the err object is empty, since thrown error returns empty object
    if (Object.keys(err).length === 0) {
      err = "token id is not the same as body id";
      return res.status(400).json({
        error: err,
      });
    } else {
      return res.status(400).json({
        error: err, // other errors thrown here (e.g Invalid jwt)
      });
    }
  }
};

module.exports = { createToken, validateToken, decodeJwt, checkAdmin };
