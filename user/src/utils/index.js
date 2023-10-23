const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { SECRET_KEY, emailUsername, emailPassword, emailService } = require("../config/index");

//Utility functions
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt(10);
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (enteredPassword, savedPassword) => {
  return await bcrypt.compare(enteredPassword, savedPassword);
};

module.exports.GenerateSignature = async (payload) => {
  try {
    const token = "Bearer " + (await jwt.sign(payload, SECRET_KEY, { expiresIn: "10d" }));
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
    if (!/[0-9]/.test(number)) {
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports.ValidateImageFormate = (image) => {
  try {
    if (image) {
      if (!["image/png", "image/jpeg", "image/jpg", "image/svg+xml"].includes(image.mimetype)) {
        return false;
      }
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
    return { message: "Data Not found!" };
  }
};

module.exports.EmailSend = async (data) => {
  try {
    const payload = { email: data };
    const verificationToken = "Bearer " + (await jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" }));

    const transporter = nodemailer.createTransport({
      service: emailService,
      auth: {
        user: emailUsername,
        pass: emailPassword,
      },
    });

    const verificationLink = `http://localhost:4000/user/verify/${verificationToken}`;

    const mailOptions = {
      from: emailUsername,
      to: data,
      subject: "Verify your account",
      text: `Hello,\n\nPlease verify your account by clicking the link below:\n${verificationLink}\n\nThank you`
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent: ' + info.response);

    return { message: 'Verification email sent.' };
  } catch (error) {
    console.error(error);
  }
}

module.exports.passwordUpdateEmailSend = async (email, sendEmail, sendId) => {
  try {
    const transporter = nodemailer.createTransport({
      service: emailService,
      auth: {
        user: emailUsername,
        pass: emailPassword,
      },
    });

    const passwordLink = `http://localhost:4000/password/update/${sendEmail}/${sendId}`;

    const mailOptions = {
      from: emailUsername,
      to: email,
      subject: "Update your password",
      text: `Hello,\n\nPlease "Update your password by clicking the link below:\n${passwordLink}\n\nThank you`
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent: ' + info.response);

    return { message: 'Verification email sent.' };
  } catch (error) {
    console.error(error);
  }
}