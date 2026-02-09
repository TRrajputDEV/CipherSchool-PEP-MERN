import mongoose from "mongoose";
const MONGO_URL = "mongodb://localhost:27017/Book";

const connectDB = async () =>{
    try {
        await mongoose.connect(MONGO_URL)
        console.log("Database Connected !!!")
    } catch (error) {
        console.log("Database connection failed")
        process.exit(1);
    }
}


export default connectDB;