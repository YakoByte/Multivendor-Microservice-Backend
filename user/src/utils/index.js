const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/index");

//Utility functions
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt(10);
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (enteredPassword, savedPassword) => {
  return (await bcrypt.compare(enteredPassword, savedPassword));
};

module.exports.GenerateSignature = async (payload) => {
  try {
    const token = "Bearer " + await jwt.sign(payload, SECRET_KEY, { expiresIn: "10d" });
    return token;
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

module.exports.ValidateEmailFormate = async (email) => {
  try {
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports.ValidatePasswordFormat = async (password) => {
  try {
    if (password.length < 8) {
      return false;
    }
    if (/\s/.test(password)) {
      return false;
    }
    if (!/[a-z]/.test(password)) {
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      return false;
    }
    if (!/\d/.test(password)) {
      return false;
    }
    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password)) {
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports.ValidateNumberFormate = (number) => {
  try {
    if (number.length < 1) {
      return false;
    }
    if (/\s/.test(number)) {
      return false;
    }
    if(!/[0-9]/.test(number)){
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    return {message: "Data Not found!"};
  }
};