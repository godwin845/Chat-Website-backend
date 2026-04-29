import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const registerUser = async ({ fullname, username, email, gender, password, profilePic }) => {

    if (!fullname || !username || !email || !password || !gender) {
        throw new Error("All fields are required");
    }

    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existingUser) {
        throw new Error("Username or Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const defaultBoy = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const defaultGirl = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = await User.create({
        fullname,
        username,
        email,
        password: hashedPassword,
        gender,
        profilePic: profilePic || (gender === "male" ? defaultBoy : defaultGirl)
    });

    return newUser;
};


export const loginUser = async ({ email, password }) => {

    if (!email || !password) {
        throw new Error("Email and password required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    return user;
};