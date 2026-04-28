import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import jwtToken from '../utils/jwtWebToken.js';

export const userRegister = async (req, res) => {

    try {
        const { fullname, username, email, gender, password, profilePic } = req.body;
        console.log(req.body);

        const user = await User.findOne({ username, email });

        if (user) return res.status(500).send({ success: false, message: " UserName or Email Already Exist " });

        const hashPassword = bcryptjs.hashSync(password, 10);

        const profileBoy = profilePic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const profileGirl = profilePic || `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({

            fullname,
            username,
            email,
            password: hashPassword,
            gender,
            profilePic: gender === "male" ? profileBoy : profileGirl
        });

        if (newUser) {
            await newUser.save();
            jwtToken(newUser._id, res)
        } else {
            res.status(500).send({ success: false, message: "Invalid User Data" })
        }

        res.status(201).send({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            profilePic: newUser.profilePic,
            email: newUser.email,
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        });

        console.log(error);
    }
}


export const userLogin = async (req, res) => {

    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email })

        if (!user) return res.status(500).send({ success: false, message: "Email Doesn't Exist Register" });

        const comparePass = bcryptjs.compareSync(password, user.password || "");

        if (!comparePass) return res.status(500).send({ success: false, message: "Email Or Password dosen't Matching" });
        
        jwtToken(user._id, res);

        res.status(200).send({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            profilepic: user.profilepic,
            email:user.email,
            message: "Succesfully LogIn"
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        });

        console.log(error);
    }
}


export const userLogOut = async(req, res) => {
    
    try {
        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("jwt",'',{
            maxAge:0,
            httpOnly: true,
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction,
        });

        res.status(200).send({success:true ,message:"User LogOut"});

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        });

        console.log(error);
    }
}
