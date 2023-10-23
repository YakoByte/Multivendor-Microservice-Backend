const { ValidateSignature } = require('../../utils');
const { adminModel } = require("../../database/models");

module.exports = async (req,res,next) => {
    const isAuthorized = await ValidateSignature(req);
    const user = req.user;

    if(isAuthorized){
        const isAdmin = await adminModel.findOne({ userId: user });
        if(!isAdmin || !isAdmin._id){
            return res.status(403).json({message:"Unauthorized"});
        }
        return next();
    }
    return res.status(403).json({message: 'Not Authorized'})
}