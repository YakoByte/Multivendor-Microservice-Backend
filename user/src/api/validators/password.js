const { ValidatePasswordFormat } = require("../../utils");

module.exports = async (req, res, next) => {
  const validPassword = await ValidatePasswordFormat(req.body.password);

  if (validPassword) {
    return next();
  }
  return res.status(403).json({ message: "Invalid password" });
};
