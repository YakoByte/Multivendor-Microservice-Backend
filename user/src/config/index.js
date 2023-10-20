const dotEnv = require("dotenv");
dotEnv.config();

module.exports = {
  PORT: process.env.PORT,
  DATABASE: process.env.DATABASE,
  SECRET_KEY: process.env.SECRET_KEY,
  emailService: process.env.emailService,
  emailUsername: process.env.emailUsername,
  emailPassword: process.env.emailPassword,
};