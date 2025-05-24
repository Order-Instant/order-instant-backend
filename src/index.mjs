import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose";
import router from "./routes/index.mjs";

dotenv.config();

//8000 is fallback port number
let PORT = process.env.PORT  || 8000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://orderinstantmultipurpose.com:27017/instant-order';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MONGODB CONNECTED'))
  .catch((err) => console.error('MongoDB connection error:', err));

let app = express();
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8080','https://orderinstantmultipurpose.com', 'https://www.orderinstantmultipurpose.com', 'https://admin.orderinstantmultipurpose.com'],
  credentials: true
}))
app.use(express.json()); // For JSON payloads
app.use(express.urlencoded({ extended: true })); // For form submissions
app.use("/", router);

app.listen(PORT, ()=>{
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`)
});