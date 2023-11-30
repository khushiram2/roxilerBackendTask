import mongoose from "mongoose";



export const dbConnection=async()=>{
    try {        
      await   mongoose.connect(process.env.DBURL)
      console.log("db connected via mongoose")
     } catch (error) {
    console.log(error)
   }
}