const { ValidateEmailFormate } = require("../../utils");

module.exports = async (req, res, next) => {
  const ValidEmail = await ValidateEmailFormate(req.body.email);

  if (ValidEmail) {
    return next();
  }
  return res.status(403).json({ message: "Invalid Email" });
};