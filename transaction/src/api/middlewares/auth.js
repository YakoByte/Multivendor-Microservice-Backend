const { ValidateSignature } = require('../../utils/index');

module.exports = async (req,res,next) => {
    
    const isAuthorized = await ValidateSignature(req);

    if(isAuthorized){
        return next();
    }
    return res.status(403).json({message: 'Not Authorized'})
}










// const jwt = require("jsonwebtoken");
// const User = require("../../database/models/user/user");

// exports.Authentication = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization;

//     if (!token || !token.startsWith("Bearer ")) {
//       return res.status(401).json({ error: "Authentication token missing or invalid" });
//     }

//     const splitToken = token.split(" ")[1];

//     const decoded = jwt.verify(splitToken, process.env.SECRET_KEY);

//     if (!decoded) {
//       return res.status(403).json({ error: "Invalid Token" });
//     }

//     // Check if the user exists in the database
//     const user = await User.findOne({_id: decoded.id});

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Attach the user ID, email, and token to the response
//     res.locals.userId = user._id;
//     res.locals.userEmail = user.email;
//     res.locals.token = splitToken;

//     next();
//   } catch (error) {
//     console.error(error); // Log the error for debugging
//     res.status(401).json({ error: "Authentication failed" });
//   }
// };