import userModel from "../models/userModel.js";
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"

const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//route for user login 
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Incorrect credentials" });
        }

        // Generate token
        const token = createToken(user._id);
        res.json({ success: true, token });
        
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};


//route for user registration 
export const registerUser = async(req,res)=>{
    try {
        
        const {name,email,password} = req.body;
        
        // checking user already exists or not 
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({success : false , message : "user already exists "})
        }

        // validating the email format and strong password 
        if(!validator.isEmail(email)){
            return res.json({success : false , message : "please enter a valid email  "})   
        }
         if(password.length < 8){
            return res.json({success : false , message : "please enter a strong password "})   
        }

        // hashing user password 

        const salt = await bcrypt.genSalt(10);//the value can be in b/w 5-15 

        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new userModel({
            name,
            email,
            password:hashedPassword
        });

        const user = await newUser.save();//new user is saved in DB 

        const token = createToken(user._id);

        res.json({success:true,token });




    } catch (error) {

        console.log(error);
        res.json({success:false,message:error.message});
        
    }
}

//route for admin login 
export const adminLogin = async(req,res) =>{

    try {
        
        const {email,password} = req.body;
        if(email === process.env.admin_email && password === process.env.admin_password){

            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token});

        }else{
            res.json({success:false,message:"Invalid credentials"});
        }

    } catch (error) {

        console.log(error);
        res.json({success:false,message:error.message});
        
        
    }



}

