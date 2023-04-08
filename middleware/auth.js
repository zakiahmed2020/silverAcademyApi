const jwt=require("jsonwebtoken");
// const config=require("config");
const moment=require("moment");

function Auth(req, res,next) {
    const token=req.headers["auth-token"]
    if(!token) return res.status(401).send("access Denied. No Token Provided..");
    try {
        const Decoded=jwt.verify(token,"jwtPriviteKey");
        // const Decoded=jwt.verify(token,config.get("jwtPriviteKey"));
        const {SubscriptionExpiredDate,tokenExpiredDate}=Decoded
        let todaydate=moment()
        let subscriptionDate=moment(SubscriptionExpiredDate)
        let tokenDate=moment(tokenExpiredDate)
        
        let reminedsecondstoken=tokenDate.diff(todaydate, 'seconds')
        let reminedsecondSubscription=subscriptionDate.diff(todaydate, 'seconds')

        if(reminedsecondstoken<=0) return res.send({status:false,message:"token date was expired please logout then log in "})
        if(reminedsecondSubscription<=0) return res.send({message:"subscription date was expired please logout then log in "})
        
     
        req.user=Decoded;
        next();
        
    } catch (error) {
        res.status(401).send("Invalid Token");
        
    }
}
module.exports = Auth;