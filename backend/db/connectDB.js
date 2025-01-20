import mongoose from "mongoose"

export const connectDB = async () => {
    try{
        if (process.env.NODE_ENV === "production") {
            await mongoose.connect(process.env.MONGO_URI)    
        }else {
            await mongoose.connect(process.env.MONGO_URI_LOCAL)
        }
    } catch(error) {
        console.log("Error Connecting to Mongo database", error.message)
        process.exit(1)
    }
}