const { ValidateSignature } = require('../../utils');
const { sellerModel, adminModel } = require("../../database/models");

module.exports = async (req,res,next) => {
    const isAuthorized = await ValidateSignature(req);
    const user = req.user;

    if(isAuthorized){
        const isSeller = await sellerModel.findOne({ userId: user });
        const isAdmin = await adminModel.findOne({ userId: user });
        
        if(!isSeller && !isAdmin){
            return res.status(403).json({ message: "You are not authorized to perform this action" })
        }
            
        return next();
    }
    return res.status(403).json({message: 'Not Authorized'})
}