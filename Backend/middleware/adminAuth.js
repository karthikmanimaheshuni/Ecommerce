import jwt from 'jsonwebtoken';

const adminAuth = async(req,res,next)=>{
    try {
        
        const {token} = req.headers;
        if(!token){
            return res.json({success:false,message:"not Authorized login again"});
        }

        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        if(token_decode !==  process.env.admin_email+process.env.admin_password){//user not Authorized
            return res.json({success:false,message:"not Authorized login again"});
        }

        //call back message 
        next();

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }

}

export default adminAuth;