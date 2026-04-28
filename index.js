import express from "express";
import dotenv from 'dotenv';
import dbConnect from "./DB/db.js";
import authRouter from  './routes/auth.route.js';
import messageRouter from './routes/message.route.js';
import userRouter from './routes/user.route.js';
import cookieParser from "cookie-parser";
import cors from "cors";
// import path from "path";

import {app , server} from './Socket/socket.js';

// const __dirname = path.resolve();

dotenv.config();


app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        // origin: ["http://localhost:5173"],
        origin: ["https://chat-web-si-te.netlify.app"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    })
);

app.use('/api/auth',authRouter);
app.use('/api/message',messageRouter);
app.use('/api/user',userRouter);

// app.use(express.static(path.join(__dirname,"/frontend/dist")))

// app.get("*",(req,res)=>{
//     res.sendFile(path.join(__dirname,"frontend","dist","index.html"))
// })

const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
    dbConnect();
    console.log(`Server running on port ${PORT}`);
});
