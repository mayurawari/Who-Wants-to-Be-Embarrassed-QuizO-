import express from "express"
import cors from 'cors'
import { config } from "dotenv"
import connectDB from "./src/config/db.js";
import QRoute from "./src/Routes/questionsRoute.js";
config();

let server = express();
let port = process.env.PORT || 5000
let url = process.env.MONGO_URL
server.use(express.json());
server.use(cors());

server.use("/api",QRoute);

server.get('/',(req,res)=>{
  res.end(`This is Home Route`);
})

server.listen(port,async()=>{
    try {
        await connectDB(url);
        console.log(`Server is running on ${port} & Connected to DB.`);
    } catch (error) {
        console.log(error)
    }
})