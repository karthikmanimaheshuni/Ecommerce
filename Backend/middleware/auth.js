import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.json({ success: false, message: "Authorization header missing or invalid" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = { id: decoded.id }; // ✅ Attach safely
        next();
    } catch (error) {
        console.log("❌ Auth error:", error.message);
        return res.json({ success: false, message: "Invalid or expired token" });
    }
};


export default authUser;

