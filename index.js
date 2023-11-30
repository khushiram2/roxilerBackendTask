import express from "express"
import * as dotenv from "dotenv"
import { dbConnection } from "./Database/Connnection.js"
import { seedData } from "./Utilities/SeedData.js"
import { TransactionRouter } from "./Routes/TransactionRoutes.js"
import cors from "cors"
dotenv.config()
const app=express()
app.use(express.json())
app.use(cors())
await dbConnection()



app.use("/transactions",TransactionRouter)
app.get('/', (_, res) => {
  res.send('GET request to the homepage')
})

app.get("/data-seeding", async (_, res) => {
  seedData(res)
 });




app.listen(process.env.PORT,()=>console.log("app started on "+process.env.PORT))




