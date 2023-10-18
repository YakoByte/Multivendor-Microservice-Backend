const nodemailer = require("nodemailer");
const { google } = require('googleapis');

module.exports = async (email) => {    
    const oauth2Client = new google.auth.OAuth2(
      YOUR_CLIENT_ID,
      YOUR_CLIENT_SECRET,
      YOUR_REDIRECT_URL
    );
    
    oauth2Client.setCredentials({
      refresh_token: YOUR_REFRESH_TOKEN,
    });
    
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        type: 'OAuth2',
        user: 'mayanksinghms9852@gmail.com',
        clientId: YOUR_CLIENT_ID,
        clientSecret: YOUR_CLIENT_SECRET,
        refreshToken: YOUR_REFRESH_TOKEN,
        accessToken: oauth2Client.getAccessToken(),
      },
    });

  const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const mailOptions = {
    from: "mayanksinghms9852@gmail.com",
    to: email,
    subject: "Verification Code",
    text: `Your verification code is: ${verificationCode}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
