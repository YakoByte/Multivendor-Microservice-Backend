const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../config/index");

module.exports.GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, SECRET_KEY, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.ValidateSignature = async (req) => {
  try {
    const token = req.headers.authorization;
    // console.log(token);
    const splitToken = token.split(" ")[1];
    const payload = await jwt.verify(splitToken, SECRET_KEY);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};