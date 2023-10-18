const { ValidateNumberFormate } = require("../../utils");

module.exports = async (req, res, next) => {
  const ValidNumber = await ValidateNumberFormate(req.body.email);

  if (ValidNumber) {
    return next();
  }
  return res.status(403).json({ message: "Invalid Number" });
};
