import userSchema from "../model/userSchema.js";

// user controller for getting user information
export const getUserInfo = async (req, res) => {
    try{
        const userDetail = await userSchema.findById(req.user.id);
        res.status(200).json({ userDetail });
    }
     catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
// check user authenticated or not 
export const checkAuth = async (req, res) => {
    try {
        const userDetail = await userSchema.findById(req.user.id);
        res.status(200).json({ userDetail });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};