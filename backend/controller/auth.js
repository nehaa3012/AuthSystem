import userModel from "../model/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../lib/cloudnary.js";
// Auth Controller for register
// export const register = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;
//         const { buffer } = req.file;
//         // convert this buffer to base64
//         const base64Image = buffer.toString("base64");
//         const image = `data:${req.file.mimetype};base64,${base64Image}`;
//         const uploadResponse = await cloudinary.uploader.upload(image, {
//             folder: "profile_pics",

//         });
//         console.log(uploadResponse);
//         if (!name || !email || !password) {
//             return res.status(400).json({ message: "All fields are required" });
//         }
//         const user = await userModel.findOne({ email });
//         if (user) {
//             return res.status(400).json({ message: "User already exists" });
//         }
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = await userModel.create({ name, email, password: hashedPassword });

//         const token = jwt.sign({ id: newUser._id, name: newUser.name, email: newUser.email }, process.env.JWT_SECRET);
//         console.log(token);
//         res.cookie("token", token, {
//             httpOnly: true,
//             secure: false, // true only in production with HTTPS
//             sameSite: "lax",
//         });
//         res.status(201).json({ token, user: newUser });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("req.body", req.body);
        let imageUrl = null;

        // Handle file upload if image exists
        if (req.file) {
            console.log("req.file", req.file);
            const base64Image = req.file.buffer.toString("base64");
            console.log("base64Image", base64Image);
            const image = `data:${req.file.mimetype};base64,${base64Image}`;
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: "profile_pics",
            });
            imageUrl = uploadResponse.secure_url;
            console.log("imageUrl", imageUrl);
        }

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({ 
            name, 
            email, 
            password: hashedPassword,
            ...(imageUrl && { profilePic: imageUrl }) // Only add profilePic if imageUrl exists
        });

        const token = jwt.sign(
            { id: newUser._id, name: newUser.name, email: newUser.email }, 
            process.env.JWT_SECRET
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true in production with HTTPS
            sameSite: "lax",
        });

        // Don't send password in response
        const { password: _, ...userWithoutPassword } = newUser.toObject();
        res.status(201).json({ token, user: userWithoutPassword });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ 
            message: "Error in registration",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
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

// Auth controller for Update
export const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        user.name = name || user.name;
        user.email = email || user.email;
        if(req.file){
            const base64Image = req.file.buffer.toString("base64");
            const image = `data:${req.file.mimetype};base64,${base64Image}`;
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: "profile_pics",
            });
            user.profilePic = uploadResponse.secure_url;
        }
        await user.save();
        res.status(201).json({ user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
