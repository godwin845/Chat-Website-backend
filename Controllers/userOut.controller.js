import { registerUser, loginUser } from "../services/auth.service.js";
import jwtToken from "../utils/jwtWebToken.js";

export const userRegister = async (req, res) => {
    try {
        const user = await registerUser(req.body);

        jwtToken(user._id, res);

        res.status(201).send({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
        });

    } catch (error) {
        console.log(error);

        res.status(400).send({
            success: false,
            message: error.message || error
        });
    }
};


export const userLogin = async (req, res) => {
    try {
        const user = await loginUser(req.body);

        jwtToken(user._id, res);

        res.status(200).send({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            message: "Successfully Logged In"
        });

    } catch (error) {
        console.log(error);

        res.status(400).send({
            success: false,
            message: error.message || error
        });
    }
};


export const userLogOut = async (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("jwt", "", {
            maxAge: 0,
            httpOnly: true,
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction,
        });

        res.status(200).send({
            success: true,
            message: "User logged out"
        });

    } catch (error) {
        console.log(error);

        res.status(500).send({
            success: false,
            message: error.message || error
        });
    }
};