const { ValidateSignature } = require('../../utils');
const { buyerModel, adminModel } = require("../../database/models");

module.exports = async (req,res,next) => {
    const isAuthorized = await ValidateSignature(req);
    const user = req.user;

    if(isAuthorized){
        const isBuyer = await buyerModel.findOne({ userId: user });
        const isAdmin = await adminModel.findOne({ userId: user });
        
        if(!isBuyer && !isAdmin){
            return res.status(403).json({ message: "You are not authorized to perform this action" })
        }
            
        return next();
    }
    return res.status(403).json({message: 'Not Authorized'})
}