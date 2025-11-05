import userModel from "../model/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Auth Controller for register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({ name, email, password: hashedPassword });
      
        const token = jwt.sign({ id: newUser._id, name: newUser.name, email: newUser.email }, process.env.JWT_SECRET);
        console.log(token);
        res.cookie("token", token, {
  httpOnly: true,
  secure: false, // true only in production with HTTPS
  sameSite: "lax",
});
        res.status(201).json({ token, user: newUser });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Auth Controller for login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET);
        console.log(token);
        res.cookie("token", token, {
  httpOnly: true,
  secure: false, // true only in production with HTTPS
  sameSite: "lax",
});
        res.status(201).json({ token, user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Auth Controller for logout
export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};