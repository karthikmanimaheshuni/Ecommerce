import mongoose from "mongoose";

const connectdb = async ()=>{
        mongoose.connection.on('connected',()=>{
            console.log("DB connected");
        })
       try {
            await mongoose.connect(process.env.MONGODB_URI, { dbName: 'e-commerce' });
            console.log("DB connected");
        } catch (err) {
            console.log("DB connection error:", err.message);
        }

}

export default connectdb;