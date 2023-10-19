const { ValidateImageFormate } = require("../../utils");

module.exports = async (req, res, next) => {
  const ValidImage = await ValidateImageFormate(req.file);

  if (ValidImage) {
    return next();
  }
  return res.status(403).json({ message: "Invalid Image Formate" });
};