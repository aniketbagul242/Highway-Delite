import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

export default authMiddleware;
